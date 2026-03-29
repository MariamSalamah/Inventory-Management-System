import {
  getData,
  postData,
  putData,
  deleteData,
} from "../../../controller/crud.js";

$(document).ready(async () => {
  // ── 1. Data ───────────────────────────────────────────────────────────────
  let productsData = await getData("products");
  const categoriesData = await getData("categories");
  const suppliersData = await getData("suppliers");

  let editingId = null;

  // ── 2. Stable const references (must be before any function that uses them) ─
  const $modal = $(".Products .sec-Form");

  // Validation uses element ids
  const rules = [
    { id: "sku", msg: "SKU is required.", test: (v) => v.trim() !== "" },
    {
      id: "productName",
      msg: "Product name is required.",
      test: (v) => v.trim() !== "",
    },
    {
      id: "productDescription",
      msg: "Product description is required.",
      test: (v) => v.trim() !== "",
    },
    {
      id: "productCategory",
      msg: "Please select a category.",
      test: (v) => v !== "none" && v !== "",
    },
    {
      id: "productSupplier",
      msg: "Please select a supplier.",
      test: (v) => v !== "none" && v !== "",
    },
    {
      id: "SellingPrice",
      msg: "Enter a valid selling price (> 0).",
      test: (v) => v !== "" && !isNaN(v) && parseFloat(v) > 0,
    },
    {
      id: "CostPrice",
      msg: "Enter a valid selling price (> 0).",
      test: (v) => v !== "" && !isNaN(v) && parseFloat(v) > 0,
    },
    {
      id: "productQuantity",
      msg: "Enter a valid quantity (≥ 0).",
      test: (v) => v !== "" && !isNaN(v) && parseInt(v) >= 0,
    },
    {
      id: "productReorder",
      msg: "Enter a valid reorder level (≥ 0).",
      test: (v) => v !== "" && !isNaN(v) && parseInt(v) >= 0,
    },
  ];

  // ── 3. Bootstrap ──────────────────────────────────────────────────────────
  updateCount();
  populateSelect("#productCategory", categoriesData);
  populateSelect("#productSupplier", suppliersData);
  populateCategoryFilter();
  addErrorSpans();
  renderProducts(productsData);

  // ── 4. Event bindings ─────────────────────────────────────────────────────

  // Open modal
  $(".Products .addBTN").on("click", () => openModal("Add Product"));

  // Close modal — X button and Cancel button
  $modal.on("click", ".closeWindow, .cancel", closeModal);

  // Close on backdrop click
  $modal.on("click", function (e) {
    if (e.target === this) closeModal();
  });

  // Save (create / update)
  $modal.on("click", ".create", saveProduct);

  // Edit / Delete — delegated on tbody for dynamically rendered rows
  $(".Products .productTable tbody").on("click", ".edit-btn", handleEdit);
  $(".Products .productTable tbody").on("click", ".delete-btn", handleDelete);

  // Search + category filter
  $(".Products .input-field").on("input", () => renderProducts(getFiltered()));
  $(".Products #categories").on("change", () => renderProducts(getFiltered()));

  // ═══════════════════════════════════════════════════════════════════════════
  // Functions
  // ═══════════════════════════════════════════════════════════════════════════

  function updateCount() {
    $(".Products .sec-header .text span").text(productsData.length);
  }

  function populateSelect(id, data) {
    const $sel = $modal.find(id);
    $sel.find("option:not(:first)").remove();
    data.forEach((item) =>
      $sel.append(`<option value="${item.id}">${item.name}</option>`),
    );
  }

  function populateCategoryFilter() {
    const $sel = $(".Products #categories");
    $sel.find("option:not(:first)").remove();
    categoriesData.forEach((c) =>
      $sel.append(`<option value="${c.id}">${c.name}</option>`),
    );
  }

  function getCategoryName(id) {
    return categoriesData.find((c) => c.id == id)?.name ?? "—";
  }

  function getFiltered() {
    const query = $(".Products .input-field").val().toLowerCase().trim();
    const catId = $(".Products #categories").val();
    return productsData.filter((p) => {
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query);
      const matchCat =
        catId === "all" || String(p.categoryId) === String(catId);
      return matchSearch && matchCat;
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  function renderProducts(list) {
    const $tbody = $(".Products .productTable tbody");
    $tbody.empty();

    if (!list.length) {
      $tbody.append(
        `<tr><td colspan="7" class="text-center py-5 text-muted">No products found.</td></tr>`,
      );
      return;
    }

    list.forEach((p) => {
      const isLow = p.quantity <= p.reorderLevel;
      $tbody.append(`
        <tr data-id="${p.id}">
          <td class="title d-flex justify-content-start align-items-center gap-2">
            <div class="title-icon d-flex justify-content-center align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true">
                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                <path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/>
                <path d="m7.5 4.27 9 5.15"/>
              </svg>
            </div>
            <span>${p.name}</span>
          </td>
          <td class="SKU">${p.sku}</td>
          <td class="category">${getCategoryName(p.categoryId)}</td>
          <td class="price">$${p.price}</td>
          <td class="stock">${p.quantity}</td>
          <td class="product-status ${isLow ? "low" : "in-stock"}">
            <div>${isLow ? "Low" : "In Stock"}</div>
          </td>
          <td class="actions d-flex justify-content-center align-items-center gap-2">
            <svg type="button" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" class="edit-btn" style="cursor:pointer" aria-label="Edit">
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
            </svg>
            <svg type="button" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" class="delete-btn text-danger" style="cursor:pointer" aria-label="Delete">
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
              <path d="M3 6h18"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </td>
        </tr>`);
    });
  }

  // ── Modal ─────────────────────────────────────────────────────────────────

  function openModal(title = "Add Product") {
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
    $modal.find("#productCategory, #productSupplier").val("none");
  }

  // ── Validation ────────────────────────────────────────────────────────────

  function addErrorSpans() {
    rules.forEach(({ id, msg }) => {
      const $field = $modal.find(`#${id}`);
      if (!$field.length) return;
      const $wrap = $field.closest(".input, .textArea");
      if (!$wrap.find(".error-msg").length) {
        $wrap.append(`<span class="error-msg">${msg}</span>`);
      }
      // Clear error as the user fixes the field
      $field.on("input change", () => $wrap.removeClass("field-error"));
    });
  }

  function validate() {
    let ok = true;
    rules.forEach(({ id, test }) => {
      const $field = $modal.find(`#${id}`);
      if (!$field.length) return;
      const $wrap = $field.closest(".input, .textArea");
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

  async function saveProduct() {
    if (!validate()) return;

    const payload = {
      name: $modal.find("#productName").val().trim(),
      sku: $modal.find("#sku").val().trim(),
      categoryId: parseInt($modal.find("#productCategory").val()),
      supplierId: parseInt($modal.find("#productSupplier").val()),
      cost: parseFloat($("#CostPrice").val()),
      price: parseFloat($("#SellingPrice").val()),
      quantity: parseInt($modal.find("#productQuantity").val()),
      reorderLevel: parseInt($modal.find("#productReorder").val()),
    };

    if (editingId !== null) {
      const updated = await putData("products", editingId, payload);
      if (updated) {
        const idx = productsData.findIndex((p) => p.id === editingId);
        productsData[idx] = updated;
      }
    } else {
      const created = await postData("products", payload);
      if (created) productsData.push(created);
    }

    updateCount();
    renderProducts(getFiltered());
    closeModal();
  }

  function handleEdit(e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");
    const p = productsData.find((x) => id == x.id);
    console.log(id);

    if (!p) return;

    editingId = id;
    $modal.find("#sku").val(p.sku);
    $modal.find("#productName").val(p.name);
    $modal.find("#productDescription").val(p.description ?? "");
    $modal.find("#productCategory").val(p.categoryId);
    $modal.find("#productSupplier").val(p.supplierId);
    $modal.find("#CostPrice").val(p.costPrice);
    $modal.find("#SellingPrice").val(p.sellingPrice);
    $modal.find("#productQuantity").val(p.quantity);
    $modal.find("#productReorder").val(p.reorderLevel);

    openModal("Edit Product");
  }

  async function handleDelete(e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");
    const p = productsData.find((x) => id == x.id);
    if (!p) return;

    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;

    await deleteData("products", id);
    productsData = productsData.filter((x) => x.id !== id);
    updateCount();
    renderProducts(getFiltered());
  }
});
