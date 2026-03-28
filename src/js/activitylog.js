import { getData } from "../../controller/crud.js";
const activityDiv = document.querySelector(".activity-div");
const clear = document.querySelector(".clearLogBtn");
const selectForm = document.querySelector("#selectForm");
function logActivityData(logData) {
  activityDiv.innerHTML = "";
  logData.forEach((el) => {
    activityDiv.insertAdjacentHTML(
      "beforeend",
      `
      <div class="d-flex justify-content-between align-items-start py-2 border-bottom">
        <div class="d-flex gap-3">
          <div class="bg-light p-2 rounded-3">
            <i class="fa-solid ${getIcon(el.type)}"></i>
          </div>
          <div>
            <div class="fw-semibold">${el.action}</div>
            <div class="text-secondary small">
              ${el.message}
            </div>
          </div>
        </div>
        <small class="text-secondary">${el.date}</small>
      </div>
      `,
    );
  });
}
function getIcon(type) {
  if (type === "products") return "fa-box text-primary";
  if (type === "suppliers") return "fa-truck text-success";
  if (type === "orders") return "fa-receipt text-warning";
  return "fa-clock text-secondary";
}
window.addEventListener("load", async function () {
  const logData = await getData("activityLog");
  document.querySelector(".log-count").textContent =
    `${logData.length} logged actions `;
  logActivityData(logData);

  selectForm.addEventListener("change", function () {
    if (this.value == "All Types") return logActivityData(logData);
    const filterlog = logData.filter((el) => {
      return el.type.toLowerCase() == this.value.toLowerCase();
    });

    logActivityData(filterlog);
  });
});
async function clearAllLogs() {
  const logData = await getData("activityLog");

  for (let log of logData) {
    await fetch(`http://localhost:3000/activityLog/${log.id}`, {
      method: "DELETE",
    });
  }

  activityDiv.innerHTML = "";
  document.querySelector(".log-count").textContent = "0 logged actions";
}

clear.addEventListener("click", clearAllLogs);
// clearLogBtn.addEventListener("click");
