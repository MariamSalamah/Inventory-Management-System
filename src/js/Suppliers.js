import {
  deleteData,
  getData,
  getSingleData,
  postData,
  putData,
} from "../../controller/crud.js";
import Validation from "./validation.js";
// import { deleteData } from "../../controller/crud.js";

// * sellectors
const suppliersContainer = document.getElementById("suppliersContainer");

async function suppliers() {
  console.log(suppliersContainer);
  let suppliersData = await getData("suppliers");
  displaySuppliers(suppliersData);
}
suppliers();
//^ displayData
function displaySuppliers(suppliers) {
  let cartona = "";

  suppliers.forEach((supplier, index) => {
    cartona += `
      <div class="card card-A p-4 bg-white">
                <div
                  class="top d-flex justify-content-between align-items-start"
                >
                  <div class="left d-flex align-items-center">
                    <div class="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-truck text-emerald-600"
                        aria-hidden="true"
                      >
                        <path
                          d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
                        ></path>
                        <path d="M15 18H9"></path>
                        <path
                          d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"
                        ></path>
                        <circle cx="17" cy="18" r="2"></circle>
                        <circle cx="7" cy="18" r="2"></circle>
                      </svg>
                    </div>
                    <div class="text">
                      <h6>${supplier.companyName || "UnKnown"}</h6>
                      <p>${supplier.name || "UnKnown"}</p>
                    </div>
                  </div>
                  <div
                    class="right actions d-flex justify-content-center align-items-center gap-2"
                  >
                    <svg
                    data-id="${supplier.id}"
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                        data-bs-toggle="modal"
                data-bs-target="#supplierModal"
                      class="lucide text-gray-400 edit-supplier"
                      aria-hidden="true"
                    >
                      <path
                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                      ></path>
                    </svg>
                    <svg
                    data-id="${supplier.id}"

                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide delete-supplier text-danger text-red-400"
                      aria-hidden="true"
                    >
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                      <path d="M3 6h18"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </div>
                </div>

                <div class="bottom">
                  <p class="email">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-mail text-gray-300"
                      aria-hidden="true"
                    >
                      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    </svg>
                    <span>${supplier.email || "UnKnown"}</span>
                  </p>
                  <p class="phone">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-phone text-gray-300"
                      aria-hidden="true"
                    >
                      <path
                        d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
                      ></path>
                    </svg>
                    <span>${supplier.phone}</span>
                  </p>
                  <p class="location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-map-pin text-gray-300"
                      aria-hidden="true"
                    >
                      <path
                        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
                      ></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${supplier.address || "UnKnown"}</span>
                  </p>
                </div>
              </div>
    `;
  });

  suppliersContainer.innerHTML = cartona;
}
suppliersContainer.addEventListener("click", function (e) {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete-supplier")) {
    deleteSupplier(id);
  }

  if (e.target.classList.contains("edit-supplier")) {
    editSupplier(id);
  }
});

async function deleteSupplier(id) {
  const ConfirmedDelete = confirm(
    "Are you sure you want to delete this Supplier?",
  );
  let productsData = await getData("products");

  if (ConfirmedDelete) {
    //^ sure that no product with this supplier
    if (productsData.find((elm) => elm.supplierId == id)) {
      alert("there product with this supplier can't deleted ");
      return;
    }
    await deleteData("suppliers", id);
    suppliers();
    alert("File deleted.");
  } else {
    alert("File not deleted.");
  }
}
// ^ edit function
async function editSupplier(id) {
  const supplier = await getSingleData("suppliers", id);

  document.getElementById("exampleInputCompanyName").value =
    supplier.companyName;
  document.getElementById("exampleInputName").value = supplier.name;
  document.getElementById("exampleInputAddress").value = supplier.address;
  document.getElementById("exampleInputEmail").value = supplier.email;
  document.getElementById("exampleInputPhone").value = supplier.phone;

  document.getElementById("saveBtnSupplier").dataset.id = id;
}

document
  .getElementById("saveBtnSupplier")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const id = this.dataset.id;
    const emailResult = Validation.Email(
      document.getElementById("exampleInputEmail").value,
    );
    const nameResult = Validation.Text(
      document.getElementById("exampleInputName").value,
    );
    const componeyNameResult = Validation.Text(
      document.getElementById("exampleInputCompanyName").value,
    );
    const addressResult = Validation.Text(
      document.getElementById("exampleInputAddress").value,
    );
    const phoneResult = Validation.Phone(
      document.getElementById("exampleInputPhone").value,
    );

    //^ handel validation
    showValidation(
      document.getElementById("error-Company"),
      componeyNameResult,
    );
    showValidation(document.getElementById("error-email"), emailResult);
    showValidation(document.getElementById("error-address"), addressResult);
    showValidation(document.getElementById("error-name"), nameResult);
    showValidation(document.getElementById("error-phone"), phoneResult);

    if (
      emailResult.isValid &&
      componeyNameResult.isValid &&
      addressResult.isValid &&
      nameResult.isValid &&
      phoneResult.isValid
    ) {
      // ^ Edit
      if (id) {
        const updatedSupplier = {
          companyName: document.getElementById("exampleInputCompanyName").value,
          name: document.getElementById("exampleInputName").value,
          address: document.getElementById("exampleInputAddress").value,
          email: document.getElementById("exampleInputEmail").value,
          phone: document.getElementById("exampleInputPhone").value,
        };

        await putData("suppliers", id, updatedSupplier);
        this.removeAttribute("data-id");
        suppliers();
        return;
      }
      // ^ Add suppliersData
      const suppliersData = await getData("suppliers");
      let newId;
      if (suppliersData.length > 0) {
        const lastId = Math.max(...suppliersData.map((s) => Number(s.id)));
        console.log(lastId);

        newId = lastId + 1;
      } else {
        newId = 1;
      }
      console.log(newId);
      // return;

      const DataSupplier = {
        id: newId,
        companyName: document.getElementById("exampleInputCompanyName").value,
        name: document.getElementById("exampleInputName").value,
        address: document.getElementById("exampleInputAddress").value,
        email: document.getElementById("exampleInputEmail").value,
        phone: document.getElementById("exampleInputPhone").value,
      };
      await postData("suppliers", DataSupplier);
      alert("supplier data added sucssefully");
      suppliers();
    } else {
      return;
    }
  });
function clearData(elm) {
  elm.removeAttribute("data-id");
  document.getElementById("exampleInputCompanyName").value = "";
  document.getElementById("exampleInputName").value = "";
  document.getElementById("exampleInputAddress").value = "";
  document.getElementById("exampleInputEmail").value = "";
  document.getElementById("exampleInputPhone").value = "";
  document.getElementById("error-email").innerHTML = "";
  document.getElementById("error-address").innerHTML = "";
  document.getElementById("error-name").innerHTML = "";
  document.getElementById("error-phone").innerHTML = "";
  document.getElementById("error-Company").innerHTML = "";
}
// ^ clear Data From Add Supplier
document.getElementById("closeBtn").addEventListener("click", (e) => {
  clearData(document.getElementById("saveBtnSupplier"));
});
document.getElementById("closeBtnhead").addEventListener("click", (e) => {
  clearData(document.getElementById("saveBtnSupplier"));
});

// ^ Search
document
  .getElementById("searchSupplier")
  .addEventListener("input", async (e) => {
    let searchWord = e.target.value.trim().toLowerCase();
    let suppliersData = await getData("suppliers");
    let data;
    if (searchWord === "") {
      data = suppliersData;
    } else {
      data = Search(
        suppliersData,
        [...Object.keys(suppliersData[0]).filter((k) => k !== "id")],
        searchWord,
      );
    }
    displaySuppliers(data);
  });
function Search(arr, sections, word) {
  word = word.toLowerCase();

  const foundArr = arr.filter((element) => {
    return sections.some((section) =>
      element[section].toLowerCase().includes(word),
    );
  });

  return foundArr;
}
function showValidation(errorElement, result) {
  errorElement.innerText = result.message;

  if (result.isValid) {
    errorElement.style.color = " green";
  } else {
    errorElement.style.color = " red";
  }
}
