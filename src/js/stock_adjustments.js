// ===== Stock Adjustments =====

import * as api from "../../controller/crud.js";

window.addEventListener("load", async () => {

    const stockTbody = document.getElementById("stockAdjustmentsTable");
    const products = await api.getData("products"); 
    const adjustments = await api.getData("stockAdjustments");


// 
function renderStockTable() {
    stockTbody.innerHTML = "";
    adjustments.forEach(adj => {
        const product = products.find(p => p.id === adj.productId);
        const isIncrease = adj.type === "increase";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="${isIncrease ? "text-success" : "text-danger"}">
                <i class="fa-solid ${isIncrease ? "fa-circle-arrow-up text-success" : "fa-circle-arrow-down text-danger"}"></i>
                ${adj.type}
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

// ===== Products In Modal =====
const stockProductsList = document.getElementById("stockProductsList");
products.forEach(p => {
    stockProductsList.innerHTML += `
        <li><a class="dropdown-item" href="#" data-id="${p.id}">${p.name} — Current: ${p.stock ?? 0}</a></li>
    `;
});

// 
let selectedStockProductId = null;
stockProductsList.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        selectedStockProductId = Number(e.target.dataset.id);
        document.getElementById("stockProductBtn").textContent = e.target.textContent;
    });
});

//
let selectedStockType = "increase";
document.getElementById("stockTypeList").querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        selectedStockType = e.target.textContent.trim().toLowerCase();
        document.getElementById("stockTypeBtn").textContent = e.target.textContent;
    });
});

// ===== Submit =====
document.getElementById("submitAdjustmentBtn").addEventListener("click", async () => {
    const quantity = Number(document.getElementById("stockQtyInput").value);
    const reason = document.getElementById("stockReasonInput").value;

    if (!selectedStockProductId || !quantity || !reason) {
        alert("Complete All fields Please!");
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
    renderStockTable();

    // 
    document.getElementById("stockQtyInput").value = "";
    document.getElementById("stockReasonInput").value = "";
    selectedStockProductId = null;
    bootstrap.Modal.getInstance(document.getElementById("newStockAdjustment")).hide();
});

});
