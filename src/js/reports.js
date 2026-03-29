// Elements
const lowBtn = document.querySelector(".low-stock-btn");
const inventoryBtn = document.querySelector(".inventory-value-btn");
const container = document.querySelector(".table-container");

import { getData } from "../../controller/crud.js";

async function loadLowStock() {
  const products = await getData("products");
  const categories = await getData("categories");

  const lowProducts = products.filter((el) => el.quantity <= el.reorderLevel);
  let totalRetail = 0;
  products.forEach((p) => {
    totalRetail += p.price * p.quantity;
  });
  document.querySelector(".inventory-ratialvalue").textContent =
    `${totalRetail.toFixed(2)} $`;

  document.querySelectorAll("#low-notify").forEach((el) => {
    el.textContent = lowProducts.length;
  });

  container.innerHTML = `
    <div class="alert alert-danger d-flex align-items-center gap-3 mb-4">
      <i class="fa-solid fa-triangle-exclamation fs-4"></i>
      <div>
        <strong>${lowProducts.length} products at or below reorder level</strong>
        <div class="small">These items need to be reordered soon</div>
      </div>
    </div>

    <div class="bg-white p-4 rounded-4 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle text-center mb-0">
          <thead class="table-light">
            <tr>
              <th>Products</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Current Qty</th>
              <th>Reorder Level</th>
              <th>Deficit</th>
            </tr>
          </thead>
          <tbody class="low-table"></tbody>
        </table>
      </div>
    </div>
  `;

  const table = document.querySelector(".low-table");

  lowProducts.forEach((el) => {
    const category = categories.find((cat) => cat.id == el.categoryId);

    const deficit = el.reorderLevel - el.quantity;
    table.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${el.name}</td>
        <td>${el.sku}</td>
        <td>${category.name}</td>
        <td>${el.quantity}</td>
        <td>${el.reorderLevel}</td>
        <td class="text-danger fw-semibold">${deficit}</td>
      </tr>`,
    );
  });
}

// ======================= Inventory Value =======================
async function loadInventoryValue() {
  const products = await getData("products");
  const categories = await getData("categories");

  let totalRetail = 0;
  let totalcost = 0;
  // Total Inventory Value
  products.forEach((p) => {
    totalcost += p.cost * p.quantity;
    totalRetail += p.price * p.quantity;
  });

  // Category Calculation
  let categoryMap = {};

  products.forEach((p) => {
    const category = categories.find((c) => c.id == p.categoryId);

    if (!categoryMap[category.name]) {
      categoryMap[category.name] = {
        products: 0,
        price: 0,
        cost: 0,
      };
    }

    categoryMap[category.name].products += 1;
    categoryMap[category.name].price += p.price * p.quantity;
    categoryMap[category.name].cost += p.cost * p.quantity;
  });

  // Category Rows
  let categoryRows = "";
  for (let cat in categoryMap) {
    categoryRows += `
      <tr>
        <td>${cat}</td>
        <td>${categoryMap[cat].products}</td>
        <td>$${categoryMap[cat].price.toFixed(2)}</td>
        <td>$${categoryMap[cat].cost.toFixed(2)}</td>
        <td class="text-success">$${(categoryMap[cat].price - categoryMap[cat].cost).toFixed(2)}</td>
      </tr>
    `;
  }

  // Products Rows
  let productRows = "";
  products.forEach((p) => {
    const total = p.price * p.quantity;

    productRows += `
      <tr>
        <td>
          <div class="fw-semibold">${p.name}</div>
          <small class="text-secondary">${p.sku}</small>
        </td>
        <td>$${p.price}</td>
        <td>$${p.cost}</td>
        <td>${p.quantity}</td>
        <td class="text-end fw-bold">$${total.toFixed(2)}</td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="d-flex flex-column gap-4 ">

      <div class="row g-3">
        
        <div class="col-md-4">
          <div class="bg-white overflow-x-scroll p-3 rounded-4 shadow-sm d-flex align-items-center gap-3">
            <div class="bg-success-subtle p-2 rounded-3">
              <i class="fa-solid fa-dollar-sign fs-4 text-success"></i>
            </div>
            <div>
              <p class="mb-1 small">Total Retail Value</p>
              <strong>$${totalRetail.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="bg-white overflow-x-scroll p-3 rounded-4 shadow-sm d-flex align-items-center gap-3">
            <div class="bg-warning-subtle p-2 rounded-3">
              <i class="fa-solid fa-coins fs-4 text-warning"></i>
            </div>
            <div>
              <p class="mb-1 small">Total Cost Value</p>
              <strong>$${totalcost.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="bg-white p-3 rounded-4 shadow-sm d-flex align-items-center gap-3">
            <div class="bg-primary-subtle p-2 rounded-3">
              <i class="fa-solid fa-chart-line fs-4 text-primary"></i>
            </div>
            <div>
              <p class="mb-1 small">Potential Profit</p>
              <strong>$${(totalRetail - totalcost).toFixed(2)}</strong>
            </div>
          </div>
        </div>

      </div>

      <!-- Category Table -->
      <div class="bg-white p-4 overflow-x-scroll rounded-4 shadow-sm">
        <h5 class="fw-bold mb-3">Value by Category</h5>
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>Category</th>
              <th>Products</th>
              <th>Retail Value</th>
              <th>Cost Value</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            ${categoryRows}
          </tbody>
        </table>
      </div>

      <!-- Products Table -->
      <div class="bg-white p-4 overflow-x-scroll rounded-4 shadow-sm">
        <h5 class="fw-bold mb-3">All Products — Inventory Value</h5>
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Cost</th>
              <th>Qty</th>
              <th class="text-end">Total Value</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>

        <div class="d-flex justify-content-end pt-3 mt-3">
          <strong>Grand Total: $${totalRetail}</strong>
        </div>
      </div>

    </div>
  `;
}

document.addEventListener("DOMContentLoaded", loadLowStock);

lowBtn.addEventListener("click", function () {
  if (lowBtn.classList.contains("bg-white")) return;

  lowBtn.classList.add("bg-white");
  inventoryBtn.classList.remove("bg-white");

  loadLowStock();
});

inventoryBtn.addEventListener("click", function () {
  if (inventoryBtn.classList.contains("bg-white")) return;

  inventoryBtn.classList.add("bg-white");
  lowBtn.classList.remove("bg-white");

  loadInventoryValue();
});
