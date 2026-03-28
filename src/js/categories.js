import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../controller/crud.js";

$(document).ready(async () => {
  // ── 1. Data ───────────────────────────────────────────────────────────────
  let categoriesData = await getData("categories");
  let productsData = await getData("products");

  let editingId = null;

  // ── 2. Inject modal HTML into DOM *first*, then capture reference ──────────
  injectModal();
  const $modal = $(".Categories .sec-Form");

  // Validation rules
  const rules = [
    {
      id: "categoryName",
      msg: "Category name is required.",
      test: (v) => v.trim() !== "",
    },
  ];

  // ── 3. Bootstrap ──────────────────────────────────────────────────────────
  injectErrorSpans();
  renderCards(categoriesData);

  // ── 4. Event bindings ─────────────────────────────────────────────────────

  // "Add Category" button — use the class we added in HTML
  $(".Categories .addCatBTN").on("click", () => openModal("Add Category"));

  // Close modal
  $modal.on("click", ".closeWindow, .cancel", closeModal);

  // Close on backdrop click
  $modal.on("click", function (e) {
    if (e.target === this) closeModal();
  });

  // Save
  $modal.on("click", ".create", saveCategory);

  // Edit / Delete — delegated on the cards container for dynamic cards
  $(".Categories .cards").on("click", ".edit-cat-btn", handleEdit);
  $(".Categories .cards").on("click", ".delete-cat-btn", handleDelete);

  // Search
  $(".Categories .input-field").on("input", function () {
    const q = $(this).val().toLowerCase().trim();
    renderCards(categoriesData.filter((c) => c.name.toLowerCase().includes(q)));
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Functions
  // ═══════════════════════════════════════════════════════════════════════════

  function productCountFor(catId) {
    return productsData.filter((p) => p.categoryId === catId).length;
  }

  // ── Inject modal ──────────────────────────────────────────────────────────
  // Prepended to .Categories section (outside .container) so it can be
  // position:fixed over the full viewport without being clipped.

  function injectModal() {
    if ($(".Categories .sec-Form").length) return; // guard against double-inject

    $(".Categories").prepend(`
      <div class="sec-Form heddin vh-100 vw-100 position-fixed top-0 start-0
                  d-flex justify-content-center align-items-center">
        <div class="window">

          <div class="title">
            <h4>Add Category</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" class="closeWindow" style="cursor:pointer" aria-label="Close">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </div>

          <div class="content p-4 d-flex flex-column gap-4">

            <div class="input">
              <label class="fw-semibold d-block mb-1" for="catName">
                Category Name <span class="text-danger">*</span>
              </label>
              <input class="w-100" type="text" id="catName" placeholder="e.g. Storage Devices">
            </div>

            <div class="input">
              <label class="fw-semibold d-block mb-1" for="catDescription">Description</label>
              <textarea class="w-100" id="catDescription" rows="3"
                placeholder="Short description of this category..."></textarea>
            </div>

          </div>

          <div class="actions p-4 pt-0">
            <button class="cancel">Cancel</button>
            <button class="create">Save</button>
          </div>

        </div>
      </div>
    `);
  }

  // ── Render cards ──────────────────────────────────────────────────────────

  function renderCards(list) {
    const $container = $(".Categories .cards");
    $container.empty();

    if (!list.length) {
      $container.append(`<p class="text-muted mt-3">No categories found.</p>`);
      return;
    }

    list.forEach((cat) => {
      const count = productCountFor(cat.id);
      $container.append(`

        <div class="card card-A p-4 bg-white" data-id="${cat.id}">
              <div class="top d-flex justify-content-between align-items-start ">
                <div class="left d-flex align-items-center">
                  <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      class="lucide lucide-tag text-purple-600" aria-hidden="true">
                      <path
                        d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z">
                      </path>
                      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </svg>
                  </div>
                  <div class="text">
                    <h6>Electronics</h6>
                    <p><span>0</span> products</p>
                  </div>
                </div>
                <div class="right actions d-flex justify-content-center align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide text-gray-400" aria-hidden="true">
                    <path
                      d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z">
                    </path>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide text-danger text-red-400" aria-hidden="true">
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M3 6h18"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </div>

              </div>
              <p>Electronic devices and components</p>
            </div>





        <div class="card card-A p-4 bg-white" data-id="${cat.id}">
          <div class="top d-flex justify-content-between align-items-start">
            <div class="left d-flex align-items-center gap-3">
              <div class="icon d-flex justify-content-center align-items-center rounded-3 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true">
                  <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>
                  <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>
                </svg>
              </div>
              <div class="text">
                <h6 class="mb-0">${cat.name}</h6>
                <p class="mb-0 small text-muted">
                  <span>${count}</span> product${count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div class="right actions d-flex justify-content-center align-items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="edit-cat-btn" style="cursor:pointer" aria-label="Edit">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="delete-cat-btn text-danger" style="cursor:pointer" aria-label="Delete">
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <path d="M3 6h18"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
          </div>
          ${
            cat.description
              ? `<p class="mt-3 mb-0 text-muted" style="font-size:14px">${cat.description}</p>`
              : ""
          }
        </div>
      `);
    });
  }

  // ── Modal ─────────────────────────────────────────────────────────────────

  function openModal(title = "Add Category") {
    $modal.find(".title h4").text(title);
    clearAllErrors();
    $modal.removeClass("heddin");
    requestAnimationFrame(() => $modal.addClass("modal-open"));
  }

  function closeModal() {
    $modal.removeClass("modal-open");
    setTimeout(() => {
      $modal.addClass("heddin");
      resetForm();
      editingId = null;
    }, 300);
  }

  function resetForm() {
    $modal.find("input, textarea").val("");
  }

  // ── Validation ────────────────────────────────────────────────────────────

  function injectErrorSpans() {
    rules.forEach(({ id, msg }) => {
      const $field = $modal.find(`#${id}`);
      if (!$field.length) return;
      const $wrap = $field.closest(".input");
      if (!$wrap.find(".error-msg").length) {
        $wrap.append(`<span class="error-msg">${msg}</span>`);
      }
      $field.on("input change", () => $wrap.removeClass("field-error"));
    });
  }

  function validate() {
    let ok = true;
    rules.forEach(({ id, test }) => {
      const $field = $modal.find(`#${id}`);
      if (!$field.length) return;
      const $wrap = $field.closest(".input");
      if (!test($field.val())) {
        $wrap.addClass("field-error");
        ok = false;
      } else {
        $wrap.removeClass("field-error");
      }
    });
    return ok;
  }

  function clearAllErrors() {
    $modal.find(".field-error").removeClass("field-error");
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async function saveCategory() {
    if (!validate()) return;

    const payload = {
      name: $modal.find("#catName").val().trim(),
      description: $modal.find("#catDescription").val().trim(),
    };

    if (editingId !== null) {
      const updated = await putData("categories", editingId, payload);
      if (updated) {
        const idx = categoriesData.findIndex((c) => c.id === editingId);
        categoriesData[idx] = updated;
      }
    } else {
      const created = await postData("categories", payload);
      if (created) categoriesData.push(created);
    }

    renderCards(categoriesData);
    closeModal();
  }

  function handleEdit() {
    const id = $(this).closest(".card-A").data("id");
    const cat = categoriesData.find((c) => c.id === id);
    if (!cat) return;

    editingId = id;
    $modal.find("#catName").val(cat.name);
    $modal.find("#catDescription").val(cat.description ?? "");
    openModal("Edit Category");
  }

  async function handleDelete() {
    const id = $(this).closest(".card-A").data("id");
    const cat = categoriesData.find((c) => c.id === id);
    if (!cat) return;

    const count = productCountFor(id);
    if (count > 0) {
      alert(
        `Cannot delete "${cat.name}" — it still has ${count} product(s) assigned to it.`,
      );
      return;
    }

    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;

    await deleteData("categories", id);
    categoriesData = categoriesData.filter((c) => c.id !== id);
    renderCards(categoriesData);
  }
});
