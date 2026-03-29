import * as api from "../../controller/crud.js";

window.addEventListener("load", async () => {

    const ordersPurchased = await api.getData("purchaseOrders");
    const suppliers = await api.getData("suppliers");
    const products = await api.getData("products");

    // ===== table reload=====
    const tbody = document.getElementById("purchaseOrdersTable");
    tbody.innerHTML = "";
    ordersPurchased.forEach(order => tbody.appendChild(createRow(order, suppliers)));

    function createRow(order, suppliers) {
        const supplier = suppliers.find(s => s.id === order.supplierId);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>PO-${String(order.id).padStart(2, '0')}</td>
            <td class="d-none d-sm-table-cell">${supplier?.name || "Unknown"}</td>
            <td>${order.items.length}</td>
            <td>$${order.total?.toFixed(2) || "0.00"}</td> 
            <td><span class="rounded-pill px-2 py-1 status bg-warning">${order.status}</span></td>
            <td class="d-none d-md-table-cell">${order.date}</td>
            <td><span class="d-flex justify-content-end gap-2 align-items-center">
                <i class="fa-regular fa-eye text-dark-emphasis text-opacity-25"></i>
                <i class="fa-regular fa-circle-check text-success"></i>
                <i class="fa-regular fa-circle-xmark text-danger"></i>
            </span></td>
        `;
        return tr;
    }





    // ===== Create Order Card =====
    let selectedSupplierId = null;

   
    const itemsContainer = document.createElement("div");
    itemsContainer.id = "itemsContainer";

    const totalEl = document.createElement("p");
    totalEl.className = "text-end fw-semibold mt-2";
    totalEl.innerHTML = `Total: <span id="orderTotal">$0.00</span>`;

   
    const modalBody = document.querySelector("#createOrderModal .modal-body");
    const actionsDiv = modalBody.querySelector(".d-flex.justify-content-end");
    modalBody.insertBefore(itemsContainer, actionsDiv);
    modalBody.insertBefore(totalEl, actionsDiv);






// ===== Add Item =====
document.getElementById("addItemBtn").addEventListener("click", () => {
    addItemRow();
});

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
        const cost = e.target.selectedOptions[0].dataset.cost;
        div.querySelector(".cost-input").value = cost || "";
        updateTotal();
    });

    div.querySelector(".qty-input").addEventListener("input", updateTotal);
    div.querySelector(".cost-input").addEventListener("input", updateTotal);
    
    div.querySelector(".delete-item").addEventListener("click", () => {
        div.remove();
        updateTotal();
        if (itemsContainer.querySelectorAll(".d-flex").length === 0) {
            document.getElementById("noItemsMsg").classList.remove("visually-hidden");
        }
    });

    itemsContainer.appendChild(div);
}

    function updateTotal() {
        let total = 0;
        itemsContainer.querySelectorAll(".d-flex").forEach(row => {
            const qty = parseFloat(row.querySelector(".qty-input").value) || 0;
            const cost = parseFloat(row.querySelector(".cost-input").value) || 0;
            total += qty * cost;
        });
        document.getElementById("orderTotal").textContent = `$${total.toFixed(2)}`;
    }

    // ===== Create Order =====
    document.getElementById("createOrderBtn").addEventListener("click", async () => {
        const items = [];
        itemsContainer.querySelectorAll(".d-flex").forEach(row => {
            const productId = Number(row.querySelector(".product-select").value); 
            const quantity = Number(row.querySelector(".qty-input").value);
            const cost = Number(row.querySelector(".cost-input").value);
            if (productId && quantity) items.push({ productId, quantity, cost });
        });


        const newOrder = {
            supplierId: Number(selectedSupplierId),
            date: new Date().toISOString().split("T")[0],
            status: "pending",
            total: parseFloat(document.getElementById("orderTotal").textContent.replace("$", "")),
            items
        };

        await api.postData("purchaseOrders", newOrder);
    });



    
let currentFilter = "all";


document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const selected = e.target.textContent;
        document.querySelector(".dropdown-toggle").textContent = selected; 
        currentFilter = selected;
        renderTable(currentFilter);
        
    });
});




function renderTable(filter) {
    tbody.innerHTML = "";
    const filtered = filter.toLowerCase() === "all statuses" 
        ? ordersPurchased.forEach(order => tbody.appendChild(createRow(order, suppliers)))    
        : ordersPurchased.filter(order => order.status === filter.toLowerCase())
        .forEach(order => tbody.appendChild(createRow(order, suppliers)));
}





// end
});