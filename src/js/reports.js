// Elements
const lowBtn = document.querySelector(".low-stock-btn");
const inventoryBtn = document.querySelector(".inventory-value-btn");
const container = document.querySelector(".table-container");
import { getData } from "../../controller/crud.js";

// Load Low Stock
// Load Low Stock
async function loadLowStock() {
  const products = await getData("products");
  const categories = await getData("categories");

  const lowProducts = products.filter((el) => el.quantity <= el.reorderLevel);
  document.querySelector("#low-notify").textContent = lowProducts.length;
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
              <th>Urgency</th>
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
    console.log(category.name);

    const deficit = el.reorderLevel - el.quantity;
    const urgency = deficit <= 0 ? "high" : deficit <= 5 ? "medium" : "low";

    table.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${el.name}</td>
        <td>${el.sku}</td>
        <td>${category.name}</td>
        <td>${el.quantity}</td>
        <td>${el.reorderLevel}</td>
        <td class="text-danger fw-semibold">${deficit}</td>
        <td><span class="badge ${urgency === "high" ? "bg-danger" : urgency === "medium" ? "bg-warning" : "bg-success"}">${urgency}</span></td>
      </tr>`,
    );
  });
}

function loadInventoryValue() {
  container.innerHTML = `
    <div class="d-flex flex-column gap-4">

    
      <div class="row g-3">
        <div class="col-md-4">
          <div class="bg-white p-3 rounded-4 shadow-sm d-flex align-items-center gap-3">
            <div class="bg-success-subtle p-2 rounded-3">
              <i class="fa-solid fa-dollar-sign fs-4 text-success"></i>
            </div>
            <div>
              <p class="mb-1 small">Total Retail Value</p>
              <strong>$38,766.13</strong>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="bg-white p-3 rounded-4 shadow-sm d-flex align-items-center gap-3">
            <div class="bg-warning-subtle p-2 rounded-3">
              <i class="fa-solid fa-dollar-sign fs-4 text-warning"></i>
            </div>
            <div>
              <p class="mb-1 small">Total Cost Value</p>
              <strong>$38,766.13</strong>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="bg-white p-3 rounded-4 shadow-sm d-flex align-items-center gap-3">
            <div class="bg-primary-subtle p-2 rounded-3">
              <i class="fa-solid fa-dollar-sign fs-4 text-primary"></i>
            </div>
            <div>
              <p class="mb-1 small">Potential Profit</p>
              <strong>$38,766.13</strong>
            </div>
          </div>
        </div>
      </div>

  
      <div class="bg-white p-4 rounded-4 shadow-sm">
        <h5 class="fw-bold mb-3">Value by Category</h5>
        <div class="table-responsive">
          <table class="table align-middle mb-0">
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
              <tr>
                <td>Electronics</td>
                <td>4</td>
                <td>$33,669.39</td>
                <td>$112,326.00</td>
                <td class="text-success">-$78,656.61</td>
              </tr>
              <tr>
                <td>Office Supplies</td>
                <td>2</td>
                <td>$1,847.41</td>
                <td>$918.00</td>
                <td class="text-success">$929.41</td>
              </tr>
              <tr>
                <td>Furniture</td>
                <td>2</td>
                <td>$2,949.93</td>
                <td>$1,540.00</td>
                <td class="text-success">$1,409.93</td>
              </tr>
              <tr>
                <td>Cleaning</td>
                <td>1</td>
                <td>$299.40</td>
                <td>$108.00</td>
                <td class="text-success">$191.40</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      
      <div class="bg-white p-4 rounded-4 shadow-sm">
        <h5 class="fw-bold mb-3">All Products — Inventory Value</h5>

        <div class="table-responsive">
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
              <tr>
                <td>electric<br><small class="text-secondary">ele-666</small></td>
                <td>$155.00</td>
                <td>$555.00</td>
                <td>200</td>
                <td class="text-end">$31,000.00</td>
              </tr>
              <tr>
                <td>A4 Copy Paper<br><small class="text-secondary">OFFC-001</small></td>
                <td>$8.99</td>
                <td>$4.50</td>
                <td>200</td>
                <td class="text-end">$1,798.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-end border-top pt-3 mt-3">
          <strong>Grand Total: $38,766.13</strong>
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
