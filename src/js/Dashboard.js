import { getData } from "../../controller/crud.js";

let productsData = await getData("products");
let categoriesData = await getData("categories");
let suppliersData = await getData("suppliers");
let purchaseOrdersData = await getData("purchaseOrders");
let activityLog = (await getData("activityLog"))
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);
let reports = await getData("reports");
let PendingOrders = purchaseOrdersData.filter(
  (elm) => elm.status === "pending",
);
// let totalRetail = 0;

// // Total Inventory Value
// productsData.forEach((p) => {
//   totalRetail += p.price * p.quantity;
// });

document.getElementById("prodlen").innerHTML = productsData.length;
document.getElementById("catlen").innerHTML = categoriesData.length;
document.getElementById("suplLen").innerHTML = suppliersData.length;
// document.getElementById("InventoryValue").innerHTML =
//   `${totalRetail.toFixed()}$`;
// document.getElementById("LowStockLen").innerHTML = reports.filter(
//   (elm) => elm.urgency == "high",
// ).length;

document.getElementById("PendingOrdersLen").innerHTML = PendingOrders.length;
function displayAlerts(reports) {
  let cartona = "";

  productsData
    .filter((el) => el.reorderLevel > el.quantity)
    .forEach((r, index) => {
      let category = categoriesData.find((el) => el.id == r.categoryId);
      cartona += `<div
                      class="cell pb-3 mb-3 d-flex align-items-center justify-content-between"
                    >
                      <div class="right">
                        <p class="m-0">${r.name}</p>
                        <p class="m-0">${category.name} · SKU: ${r.sku}</p>
                      </div>
                      <div class="left alert-danger text-danger p-2 rounded-4">
                        <i class="fa-solid fa-triangle-exclamation"></i>  
                      </div>
                    </div>`;
    });
  document.querySelector("#reports-dashboard").innerHTML = cartona;
}
function displayActivityLog(activityLogs) {
  let cartona = "";

  activityLogs.forEach((activityLog, index) => {
    cartona += `  <div
                      class="cell d-flex mb-1 pb-1 align-items-center justify-content-between"
                    >
                      <div class="right">
                        <p class="m-0 mb-1">${activityLog.action}</p>
                        <p class="m-0 ">
                          ${activityLog.description || "No Description"}
                        </p>
                        <p class="m-0">
                           ${activityLog.date}
                        </p>
                      </div>
                    </div>
    `;
  });
  document.querySelector("#card-RecentActivity-dashboard").innerHTML = cartona;
}
displayActivityLog(activityLog);
displayAlerts(reports);
