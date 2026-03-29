import * as api from "../../controller/crud.js";
import { logActivity } from "../../controller/activity.js";

window.addEventListener("load", async () => {

    const stockTbody = document.getElementById("stockAdjustmentsTable");
    const products = await api.getData("products");
    let adjustments = await api.getData("stockAdjustments");

    //Render Table
    function renderStockTable() {
        stockTbody.innerHTML = "";
        adjustments.forEach(adj => {
            const product = products.find(p => Number(p.id) === Number(adj.productId));
            const isIncrease = adj.type === "increase";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="${isIncrease ? "text-success" : "text-danger"}">
                    <i class="fa-solid ${isIncrease ? "fa-circle-arrow-up text-success" : "fa-circle-arrow-down text-danger"}"></i>
                    ${isIncrease ? "Increase" : "Decrease"}
                </td>
                <td>${product?.name || "Unknown"}</td>
                <td>${isIncrease ? "+" : "-"}${adj.quantity}</td>
                <td colspan="2">${adj.reason}</td>
                <td colspan="2">${adj.date || "—"}</td>
            `;
            stockTbody.appendChild(tr);
        });
    }
    renderStockTable();

    //Products Dropdown in Modal
    const stockProductsList = document.getElementById("stockProductsList");
    stockProductsList.innerHTML = "";
    products.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `<a class="dropdown-item" href="#" data-id="${p.id}">${p.name} — Current: ${p.quantity ?? 0}</a>`;
        stockProductsList.appendChild(li);
    });

    //Product Selection
    let selectedStockProductId = null;
    stockProductsList.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            selectedStockProductId = Number(e.target.dataset.id);
            document.getElementById("stockProductBtn").textContent = e.target.textContent;
        });
    });

    //Type Selection
    let selectedStockType = "increase";
    document.getElementById("stockTypeList").querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            selectedStockType = e.target.textContent.trim().toLowerCase();
            document.getElementById("stockTypeBtn").textContent = e.target.textContent;
        });
    });

    //Submit Adjustment
    document.getElementById("submitAdjustmentBtn").addEventListener("click", async () => {
        const quantity = Number(document.getElementById("stockQtyInput").value);
        const reason = document.getElementById("stockReasonInput").value.trim();

        // Validation
        if (!selectedStockProductId) {
            alert("Please select a product.");
            return;
        }
        if (!quantity || quantity < 1) {
            alert("Quantity must be at least 1.");
            return;
        }
        if (!reason) {
            alert("Please enter a reason for the adjustment.");
            return;
        }

        const newAdj = {
            productId: selectedStockProductId,
            type: selectedStockType,
            quantity,
            reason,
            date: new Date().toISOString().split("T")[0]
        };

        await api.postData("stockAdjustments", newAdj);
        adjustments.push(newAdj);

        // Update product quantity in DB
        const productToUpdate = await api.getSingleData("products", selectedStockProductId);
        if (productToUpdate) {
            const updatedQty = selectedStockType === "increase"
                ? (productToUpdate.quantity || 0) + quantity
                : Math.max(0, (productToUpdate.quantity || 0) - quantity);
            await api.putData("products", productToUpdate.id, { ...productToUpdate, quantity: updatedQty });
        }

        renderStockTable();

        // Log activity
        const product = products.find(p => Number(p.id) === selectedStockProductId);
        const actionLabel = selectedStockType === "increase" ? "Stock increased" : "Stock decreased";
        await logActivity(
            "products",
            actionLabel,
            `${actionLabel} for "${product?.name || "product"}" by ${quantity} — Reason: ${reason}`
        );

        // Reset form
        document.getElementById("stockQtyInput").value = "";
        document.getElementById("stockReasonInput").value = "";
        document.getElementById("stockProductBtn").textContent = "— Select Product —";
        document.getElementById("stockTypeBtn").textContent = "Increase";
        selectedStockProductId = null;
        selectedStockType = "increase";

        bootstrap.Modal.getInstance(document.getElementById("newStockAdjustment")).hide();
    });

});