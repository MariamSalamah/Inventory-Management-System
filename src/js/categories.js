import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../controller/crud.js";

$(document).ready(async () => {
  let categoriesData = await getData("categories");
  let productsData = await getData("products");

  let editingId = null;

  const $modal = $(".Categories .sec-Form");

  const rules = [
    {
      id: "categoryName",
      msg: "Category name is required.",
      test: (v) => v.trim() !== "",
    },
  ];

  injectErrorSpans();
  renderCards(categoriesData);

  $(".Categories .addCatBTN").on("click", () => openModal("Add Category"));

  $modal.on("click", ".closeWindow, .cancel", closeModal);

  $modal.on("click", function (e) {
    if (e.target === this) closeModal();
  });

  $modal.on("click", ".create", saveCategory);

  $(".Categories .cards").on("click", ".edit-cat-btn", handleEdit);
  $(".Categories .cards").on("click", ".delete-cat-btn", handleDelete);

  $(".Categories .input-field").on("input", function () {
    const q = $(this).val().toLowerCase().trim();
    renderCards(categoriesData.filter((c) => c.name.toLowerCase().includes(q)));
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Functions
  // ═══════════════════════════════════════════════════════════════════════════

  function productCountFor(catId) {
    // FIX 3: Use loose equality (==) to handle string/number ID mismatch
    return productsData.filter((p) => p.categoryId == catId).length;
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
                    <h6>${cat.name}</h6>
                    <span>${count}</span> product${count !== 1 ? "s" : ""}
                  </div>
                </div>
                <div class="right actions d-flex justify-content-center align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="edit-cat-btn lucide text-gray-400" aria-hidden="true">
                    <path
                      d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z">
                    </path>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="delete-cat-btn lucide text-danger text-red-400" aria-hidden="true">
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M3 6h18"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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
      name: $modal.find("#categoryName").val().trim(),
      description: $modal.find("#categoryDescription").val().trim(),
    };

    if (editingId !== null) {
      const updated = await putData("categories", editingId, payload);
      if (updated) {
        const idx = categoriesData.findIndex((c) => c.id === editingId);
        categoriesData[idx] = updated;

        const affectedProducts = productsData.filter(
          (p) => p.categoryId == editingId,
        );
        await Promise.all(
          affectedProducts.map((p) =>
            putData("products", p.id, { ...p, categoryId: editingId }),
          ),
        );
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
    // FIX 2: Use correct IDs matching the HTML (#categoryName, #categoryDescription)
    $modal.find("#categoryName").val(cat.name);
    $modal.find("#categoryDescription").val(cat.description ?? "");
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

    if (!confirm(` "${cat.name}" category will delete .`)) return;

    await deleteData("categories", id);
    categoriesData = categoriesData.filter((c) => c.id !== id);
    renderCards(categoriesData);
  }
});
