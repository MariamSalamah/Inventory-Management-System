import * as api from "../../controller/crud.js";
import { logActivity } from "../../controller/activity.js";

window.addEventListener("load", async () => {

    let ordersPurchased = await api.getData("purchaseOrders");
    const suppliers = await api.getData("suppliers");
    const products = await api.getData("products");

    // Status Badge Helper 
    function getStatusBadge(status) {
        const s = status?.toLowerCase();
        const label = status ? (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()) : "Unknown";
        const base = "rounded-pill px-2 py-1 status fw-semibold ";
        if (s === "pending")   return `<span class="${base}text-warning"   style="background-color:#fff8e1;">${label}</span>`;
        if (s === "received")  return `<span class="${base}text-success"   style="background-color:#e8f5e9;">${label}</span>`;
        if (s === "cancelled") return `<span class="${base}text-secondary" style="background-color:#e0e0e0;">${label}</span>`;
        return `<span class="${base}bg-light">${label}</span>`;
    }

    // Table Render
    const tbody = document.getElementById("purchaseOrdersTable");
    let currentFilter = "all";

    function renderTable(filter = "all") {
        tbody.innerHTML = "";
        const list = filter.toLowerCase() === "all" || filter.toLowerCase() === "all statuses"
            ? ordersPurchased
            : ordersPurchased.filter(o => o.status?.toLowerCase() === filter.toLowerCase());

        list.forEach(order => {
            const globalIndex = ordersPurchased.indexOf(order);
            tbody.appendChild(createRow(order, globalIndex));
        });
    }

    function createRow(order, index) {
        //
        const poNumber = `PO-${String(index + 1).padStart(2, '0')}`;
        const supplier = suppliers.find(s => String(s.id) === String(order.supplierId));
        const isFinal = order.status === "received" || order.status === "cancelled";
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${poNumber}</td>
            <td class="d-none d-sm-table-cell">${supplier?.companyName || supplier?.name || "Unknown"}</td>
            <td>${order.items?.length || 0}</td>
            <td>$${(order.total ?? 0).toFixed(2)}</td>
            <td>${getStatusBadge(order.status)}</td>
            <td class="d-none d-md-table-cell">${order.date || "—"}</td>
            <td>
                <span class="d-flex justify-content-end gap-2 align-items-center">
                    <i class="fa-regular fa-eye" style="cursor:pointer; color:#b0b0b0;" title="View Details"></i>
                    ${!isFinal ? `
                    <i class="fa-regular fa-circle-check" style="cursor:pointer; color:#86c98e;" title="Mark as Received"></i>
                    <i class="fa-regular fa-circle-xmark" style="cursor:pointer; color:#e08080;" title="Cancel Order"></i>
                    ` : ""}
                </span>
            </td>
        `;

        tr.querySelector(".fa-eye").addEventListener("click", () => openViewModal(order, poNumber));

        if (!isFinal) {
            tr.querySelector(".fa-circle-check").addEventListener("click", async () => {
               
                await api.putData("purchaseOrders", order.id, { ...order, status: "received" });
                order.status = "received";
                ordersPurchased = ordersPurchased.map(o => o.id === order.id ? { ...o, status: "received" } : o);

                
                for (const item of order.items) {
                    const product = await api.getSingleData("products", item.productId);
                    if (product) {
                        
                        const newQty = (product.quantity || 0) + item.quantity;
                        await api.putData("products", product.id, { ...product, quantity: newQty });
                        await logActivity("orders", "Order received", `${poNumber} marked as Received — stock updated`);

                        
                        await api.postData("stockAdjustments", {
                            productId: product.id,
                            type: "increase",
                            quantity: item.quantity,
                            reason: `Purchase order received (${poNumber})`,
                            date: new Date().toISOString().split("T")[0]
                        });

                      
                        await logActivity("products", "Stock increased", `Stock of "${product.name}" increased by ${item.quantity} — via ${poNumber}`);
                    }
                }

                renderTable(currentFilter);
                
            });

            tr.querySelector(".fa-circle-xmark").addEventListener("click", async () => {
                await api.putData("purchaseOrders", order.id, { ...order, status: "cancelled" });
                order.status = "cancelled";
                ordersPurchased = ordersPurchased.map(o => o.id === order.id ? { ...o, status: "cancelled" } : o);
                renderTable(currentFilter);
                await logActivity("orders", "Order cancelled", `${poNumber} was Cancelled`);
            });
        }

        return tr;
    }

    renderTable();

    //Filter Dropdown
    const purchaseSection = document.querySelector(".Purchase");
    const filterDropdownToggle = purchaseSection.querySelector(":scope > .dropdown .dropdown-toggle");
    purchaseSection.querySelectorAll(":scope > .dropdown .dropdown-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const selected = e.target.textContent.trim();
            filterDropdownToggle.textContent = selected;
            currentFilter = selected;
            renderTable(currentFilter);
        });
    });

    //View Details Modal
    if (!document.getElementById("viewOrderModal")) {
        document.body.insertAdjacentHTML("beforeend", `
        <div class="modal fade" id="viewOrderModal" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
              <div class="modal-body" id="viewOrderModalBody"></div>
            </div>
          </div>
        </div>`);
    }

    function openViewModal(order, poNumber) {
        const supplier = suppliers.find(s => String(s.id) === String(order.supplierId));
        const itemsHTML = (order.items || []).map(item => {
            const product = products.find(p => Number(p.id) === Number(item.productId));
            return `<tr>
                <td>${product?.name || "Unknown"}</td>
                <td>${item.quantity}</td>
                <td>$${(item.cost ?? 0).toFixed(2)}</td>
                <td>$${((item.quantity || 0) * (item.cost || 0)).toFixed(2)}</td>
            </tr>`;
        }).join("");

        document.getElementById("viewOrderModalBody").innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="fw-bold mb-0">Order Details — ${poNumber}</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <hr>
            <div class="row mb-3">
                <div class="col-6">
                    <p class="mb-1 text-muted small">Supplier</p>
                    <p class="fw-semibold">${supplier?.companyName || supplier?.name || "Unknown"}</p>
                </div>
                <div class="col-6">
                    <p class="mb-1 text-muted small">Contact</p>
                    <p class="fw-semibold">${supplier?.name || "—"}</p>
                </div>
                <div class="col-6">
                    <p class="mb-1 text-muted small">Date</p>
                    <p class="fw-semibold">${order.date || "—"}</p>
                </div>
                <div class="col-6">
                    <p class="mb-1 text-muted small">Status</p>
                    <p>${getStatusBadge(order.status)}</p>
                </div>
            </div>
            <h6 class="fw-bold mb-2">Items</h6>
            <table class="table table-bordered table-sm">
                <thead class="table-light">
                    <tr><th>Product</th><th>Qty</th><th>Unit Cost</th><th>Subtotal</th></tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
            </table>
            <div class="text-end fw-bold fs-5">Total: $${(order.total ?? 0).toFixed(2)}</div>
        `;
        new bootstrap.Modal(document.getElementById("viewOrderModal")).show();
    }

    // Supplier Dropdown in Create Modal
    const supplierDropdownMenu = document.querySelector("#createOrderModal .dropdown-menu");
    const supplierDropdownBtn = document.querySelector("#createOrderModal .dropdown-toggle");
    supplierDropdownMenu.innerHTML = "";
    suppliers.forEach(s => {
        const li = document.createElement("li");
        li.innerHTML = `<a class="dropdown-item" href="#" data-id="${s.id}">${s.companyName || s.name}</a>`;
        supplierDropdownMenu.appendChild(li);
    });

    let selectedSupplierId = null;
    supplierDropdownMenu.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            selectedSupplierId = e.target.dataset.id;
            supplierDropdownBtn.textContent = e.target.textContent;
        });
    });

    //Items Container
    const itemsContainer = document.getElementById("itemsContainer");
    const totalEl = document.createElement("p");
    totalEl.className = "text-end fw-semibold mt-2";
    totalEl.innerHTML = `Total: <span id="orderTotal">$0.00</span>`;
    const modalBody = document.querySelector("#createOrderModal .modal-body");
    const actionsDiv = modalBody.querySelector(".d-flex.justify-content-end");
    modalBody.insertBefore(totalEl, actionsDiv);

    //Add Item
    document.getElementById("addItemBtn").addEventListener("click", () => addItemRow());

    function addItemRow() {
        const div = document.createElement("div");
        div.className = "d-flex gap-2 align-items-center mb-2";
        document.getElementById("noItemsMsg").classList.add("visually-hidden");

        div.innerHTML = `
            <select class="form-select product-select flex-1">
                <option value="">— Product —</option>
                ${products.map(p => `<option value="${p.id}" data-cost="${p.price}">${p.name}</option>`).join("")}
            </select>
            <input type="number" class="form-control qty-input" placeholder="Qty" min="1" value="1" style="width: 80px;">
            <input type="number" class="form-control cost-input" placeholder="Cost" min="0" step="0.01" style="width: 100px;">
            <button class="btn btn-sm btn-danger delete-item">🗑</button>
        `;

        div.querySelector(".product-select").addEventListener("change", (e) => {
            div.querySelector(".cost-input").value = e.target.selectedOptions[0].dataset.cost || "";
            updateTotal();
        });
        div.querySelector(".qty-input").addEventListener("input", updateTotal);
        div.querySelector(".cost-input").addEventListener("input", updateTotal);
        div.querySelector(".delete-item").addEventListener("click", () => {
            div.remove();
            updateTotal();
            if (!itemsContainer.querySelector(".d-flex")) {
                document.getElementById("noItemsMsg").classList.remove("visually-hidden");
            }
        });

        itemsContainer.appendChild(div);
    }

    function updateTotal() {
        let total = 0;
        itemsContainer.querySelectorAll(".d-flex").forEach(row => {
            total += (parseFloat(row.querySelector(".qty-input").value) || 0)
                   * (parseFloat(row.querySelector(".cost-input").value) || 0);
        });
        document.getElementById("orderTotal").textContent = `$${total.toFixed(2)}`;
    }

    //Create Order
    document.getElementById("createOrderBtn").addEventListener("click", async () => {
        if (!selectedSupplierId) { alert("Please select a supplier."); return; }

        const itemRows = itemsContainer.querySelectorAll(".d-flex");
        if (!itemRows.length) { alert("Please add at least one item."); return; }

        const items = [];
        for (const row of itemRows) {
            const productId = Number(row.querySelector(".product-select").value);
            const quantity  = Number(row.querySelector(".qty-input").value);
            const cost      = Number(row.querySelector(".cost-input").value);
            if (!productId)   { alert("Please select a product for every item."); return; }
            if (quantity < 1) { alert("Quantity must be at least 1."); return; }
            if (cost < 0)     { alert("Please enter a valid cost."); return; }
            items.push({ productId, quantity, cost });
        }

        const total = parseFloat(document.getElementById("orderTotal").textContent.replace("$", ""));
        const newOrder = {
            supplierId: selectedSupplierId,
            date: new Date().toISOString().split("T")[0],
            status: "pending",
            total,
            items
        };

        const created = await api.postData("purchaseOrders", newOrder);
        ordersPurchased.push(created || newOrder);

        const supplier = suppliers.find(s => String(s.id) === String(selectedSupplierId));
        const newPO = `PO-${String(ordersPurchased.length).padStart(2, '0')}`;
        await logActivity("orders", "Order created", `${newPO} created for ${supplier?.companyName || supplier?.name || "supplier"}`);

        // Reset modal
        itemsContainer.innerHTML = "";
        document.getElementById("noItemsMsg").classList.remove("visually-hidden");
        document.getElementById("orderTotal").textContent = "$0.00";
        selectedSupplierId = null;
        supplierDropdownBtn.textContent = "— Select Suppliers —";

        bootstrap.Modal.getInstance(document.getElementById("createOrderModal")).hide();
        renderTable(currentFilter);
    });

});