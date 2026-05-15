import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
  Copy,
  Check,
  X,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  Save,
  ArrowLeft,
  Filter,
  Columns,
  GripVertical,
} from "lucide-react";
import { useShop } from "../../ShopContext.jsx";
import {
  parseCSV,
  detectColumnMapping,
  mapRow,
  validateRow,
  generateBulkSku,
  resetSkuCounter,
  buildProduct,
  exportToCSV,
  computeDiff,
  PRODUCT_FIELDS,
  REQUIRED_FIELDS,
  BADGE_OPTIONS,
} from "./bulkEditorHelpers.js";

// ─── Constants ───
const ROW_HEIGHT = 40;
const VISIBLE_BUFFER = 15;
const DEBOUNCE_MS = 300;

// ─── Column definitions for the grid ───
const GRID_COLUMNS = [
  { key: "__rowNum", label: "#", width: 50, fixed: true, editable: false },
  { key: "id", label: "ID", width: 80, fixed: false, editable: false },
  { key: "name", label: "Name", width: 180, fixed: true, editable: true, required: true },
  { key: "description", label: "Description", width: 220, fixed: false, editable: true },
  { key: "price", label: "Price (₹)", width: 100, fixed: false, editable: true, required: true, type: "number" },
  { key: "oldPrice", label: "Compare-at (₹)", width: 120, fixed: false, editable: true, type: "number" },
  { key: "discountPercent", label: "Disc %", width: 75, fixed: false, editable: true, type: "number" },
  { key: "category", label: "Category", width: 140, fixed: false, editable: true, required: true },
  { key: "subcategory", label: "Subcategory", width: 130, fixed: false, editable: true },
  { key: "fabric", label: "Fabric", width: 100, fixed: false, editable: true },
  { key: "badge", label: "Badge", width: 130, fixed: false, editable: true, type: "badge" },
  { key: "image", label: "Image URL", width: 160, fixed: false, editable: true },
  { key: "videoLink", label: "Video Link", width: 150, fixed: false, editable: true },
  { key: "stockLeft", label: "Stock", width: 80, fixed: false, editable: true, type: "number" },
  { key: "sku", label: "SKU", width: 120, fixed: false, editable: true },
  { key: "barcode", label: "Barcode", width: 120, fixed: false, editable: true },
  { key: "qrCode", label: "QR Code", width: 120, fixed: false, editable: true },
  { key: "rating", label: "Rating", width: 75, fixed: false, editable: true, type: "number" },
  { key: "reviews", label: "Reviews", width: 80, fixed: false, editable: true, type: "number" },
  { key: "purchasedCount", label: "Purchased", width: 90, fixed: false, editable: true, type: "number" },
  { key: "taxGstPercent", label: "Tax %", width: 70, fixed: false, editable: true, type: "number" },
  { key: "taxHsnCode", label: "HSN", width: 90, fixed: false, editable: true },
  { key: "taxAmount", label: "Tax Amt", width: 85, fixed: false, editable: true, type: "number" },
  { key: "seoSlug", label: "Slug", width: 140, fixed: false, editable: true },
  { key: "seoMetaTitle", label: "Meta Title", width: 160, fixed: false, editable: true },
  { key: "seoMetaDescription", label: "Meta Desc", width: 180, fixed: false, editable: true },
  { key: "seoKeywords", label: "Keywords", width: 150, fixed: false, editable: true },
  { key: "seoTags", label: "SEO Tags", width: 150, fixed: false, editable: true },
  { key: "color", label: "Color", width: 100, fixed: false, editable: true },
  { key: "shippingInfo", label: "Shipping", width: 130, fixed: false, editable: true },
  { key: "metadata", label: "Metadata", width: 130, fixed: false, editable: true },
];

// ─── Helper: flatten product to grid row ───
function productToGridRow(product, index) {
  return {
    __rowNum: index + 1,
    __source: product,
    __isNew: !product.id,
    id: product.id || "",
    name: product.name || "",
    description: product.description || "",
    price: product.price ?? "",
    oldPrice: product.oldPrice ?? "",
    discountPercent: product.discountPercent ?? "",
    category: product.category || "",
    subcategory: product.subcategory || "",
    fabric: product.fabric || "",
    badge: product.badge || "",
    image: product.image || "",
    videoLink: product.videoLink || "",
    stockLeft: product.stockLeft ?? "",
    sku: product.sku || "",
    barcode: product.barcode || "",
    qrCode: product.qrCode || "",
    rating: product.rating ?? "",
    reviews: product.reviews ?? "",
    purchasedCount: product.purchasedCount ?? "",
    taxGstPercent: product.tax?.gstPercent ?? "",
    taxHsnCode: product.tax?.hsnCode ?? "",
    taxAmount: product.tax?.amount ?? "",
    seoSlug: product.seo?.slug ?? "",
    seoMetaTitle: product.seo?.metaTitle ?? "",
    seoMetaDescription: product.seo?.metaDescription ?? "",
    seoKeywords: (product.seo?.keywords || []).join(", "),
    seoTags: (product.seo?.tags || []).join(", "),
    color: (product.colors || []).join(", "),
    shippingInfo: product.shippingInfo || "",
    metadata: product.metadata || "",
  };
}

// ─── Helper: grid row back to product ───
function gridRowToProduct(row, categories) {
  const mapped = {};
  for (const col of GRID_COLUMNS) {
    if (col.key.startsWith("__")) continue;
    mapped[col.key] = row[col.key];
  }
  return buildProduct(mapped, row.__source, categories);
}

// ─── Main Component ───
const AdminBulkEditor = () => {
  const navigate = useNavigate();
  const { catalogProducts, categories, batchApplyChanges } = useShop();

  // ─── State ───
  const [gridRows, setGridRows] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [rawHeaders, setRawHeaders] = useState([]);
  const [importMode, setImportMode] = useState("file"); // "file" | "paste"
  const [pasteText, setPasteText] = useState("");
  const [filterText, setFilterText] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null); // { rowIdx, colKey }
  const [editValue, setEditValue] = useState("");
  const [validationErrors, setValidationErrors] = useState({}); // rowIdx -> errors[]
  const [showDiff, setShowDiff] = useState(false);
  const [diffResult, setDiffResult] = useState(null);
  const [showColumnMapper, setShowColumnMapper] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });
  const [hiddenColumns, setHiddenColumns] = useState(new Set());
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const [isApplying, setIsApplying] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const gridContainerRef = useRef(null);
  const filterTimerRef = useRef(null);

  // ─── Debounced filter ───
  useEffect(() => {
    if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
    filterTimerRef.current = setTimeout(() => {
      setDebouncedFilter(filterText);
    }, DEBOUNCE_MS);
    return () => {
      if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
    };
  }, [filterText]);

  // ─── Measure container height ───
  useEffect(() => {
    const updateHeight = () => {
      if (gridContainerRef.current) {
        const rect = gridContainerRef.current.getBoundingClientRect();
        setContainerHeight(rect.height || 600);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // ─── Show toast ───
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Handle file import ───
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      processImport(text);
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Handle paste import ───
  const handlePasteImport = () => {
    if (!pasteText.trim()) {
      showToast("Please paste data first", "error");
      return;
    }
    processImport(pasteText);
  };

  // ─── Process imported data ───
  const processImport = (text) => {
    const { headers, rows } = parseCSV(text);

    if (headers.length === 0 || rows.length === 0) {
      showToast("No data found. Check your CSV/TSV format.", "error");
      return;
    }

    const mapping = detectColumnMapping(headers);
    setRawHeaders(headers);
    setColumnMapping(mapping);

    resetSkuCounter();

    const newGridRows = rows.map((rawRow, idx) => {
      const mapped = mapRow(rawRow, mapping);

      // Check if this row has an ID that matches an existing product
      let existingProduct = null;
      if (mapped.id) {
        existingProduct = catalogProducts.find(
          (p) => String(p.id) === String(mapped.id)
        );
      }

      // Auto-generate SKU for new rows without one
      if (!existingProduct && !mapped.sku) {
        mapped.sku = generateBulkSku(mapped.category || "GEN");
      }

      const product = buildProduct(mapped, existingProduct, categories);
      return productToGridRow(product, idx);
    });

    setGridRows(newGridRows);
    setSelectedRows(new Set());
    setValidationErrors({});
    setShowDiff(false);
    setDiffResult(null);
    showToast(`Imported ${newGridRows.length} rows`, "success");
  };

  // ─── Load existing catalog ───
  const loadExistingCatalog = () => {
    resetSkuCounter();
    const rows = catalogProducts.map((p, i) => productToGridRow(p, i));
    setGridRows(rows);
    setRawHeaders([]);
    setColumnMapping({});
    setSelectedRows(new Set());
    setValidationErrors({});
    setShowDiff(false);
    setDiffResult(null);
    showToast(`Loaded ${rows.length} products from catalog`, "success");
  };

  // ─── Validate all rows ───
  const validateAll = useCallback(() => {
    const errors = {};
    for (let i = 0; i < gridRows.length; i++) {
      const row = gridRows[i];
      const mapped = {};
      for (const col of GRID_COLUMNS) {
        if (col.key.startsWith("__")) continue;
        mapped[col.key] = row[col.key];
      }
      const rowErrors = validateRow(mapped, i, categories);
      if (rowErrors.length > 0) {
        errors[i] = rowErrors;
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [gridRows, categories]);

  // ─── Handle cell edit ───
  const startEdit = (rowIdx, colKey) => {
    const row = gridRows[rowIdx];
    setEditingCell({ rowIdx, colKey });
    setEditValue(row[colKey] ?? "");
  };

  const commitEdit = () => {
    if (!editingCell) return;
    const { rowIdx, colKey } = editingCell;
    setGridRows((prev) => {
      const updated = [...prev];
      updated[rowIdx] = { ...updated[rowIdx], [colKey]: editValue };
      return updated;
    });
    setEditingCell(null);
    setEditValue("");

    // Clear validation for this row
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[rowIdx];
      return next;
    });
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      commitEdit();
      // Move to next editable cell
      if (editingCell) {
        const { rowIdx, colKey } = editingCell;
        const editableCols = GRID_COLUMNS.filter((c) => c.editable);
        const currentIdx = editableCols.findIndex((c) => c.key === colKey);
        const nextIdx = e.shiftKey ? currentIdx - 1 : currentIdx + 1;
        if (nextIdx >= 0 && nextIdx < editableCols.length) {
          const nextCol = editableCols[nextIdx];
          startEdit(rowIdx, nextCol.key);
        } else if (!e.shiftKey && rowIdx + 1 < gridRows.length) {
          // Move to first editable column of next row
          startEdit(rowIdx + 1, editableCols[0].key);
        }
      }
    }
  };

  // ─── Row operations ───
  const addNewRow = () => {
    const newProduct = buildProduct(
      { name: "", price: "0", category: categories[0]?.name || "" },
      null,
      categories
    );
    newProduct.sku = generateBulkSku(newProduct.category);
    const newRow = productToGridRow(newProduct, gridRows.length);
    setGridRows((prev) => [...prev, newRow]);
    showToast("New row added", "success");
  };

  const duplicateRow = (rowIdx) => {
    const source = gridRows[rowIdx];
    const newProduct = buildProduct(
      { ...source, id: null, name: `${source.name || "Copy"} (Copy)` },
      null,
      categories
    );
    newProduct.sku = generateBulkSku(newProduct.category);
    const newRow = productToGridRow(newProduct, gridRows.length);
    setGridRows((prev) => {
      const updated = [...prev];
      updated.splice(rowIdx + 1, 0, newRow);
      return updated;
    });
    showToast("Row duplicated", "success");
  };

  const deleteSelectedRows = () => {
    if (selectedRows.size === 0) {
      showToast("No rows selected", "error");
      return;
    }
    setGridRows((prev) => prev.filter((_, i) => !selectedRows.has(i)));
    setSelectedRows(new Set());
    showToast(`Deleted ${selectedRows.size} row(s)`, "success");
  };

  const deleteRow = (rowIdx) => {
    setGridRows((prev) => prev.filter((_, i) => i !== rowIdx));
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.delete(rowIdx);
      return next;
    });
  };

  // ─── Selection ───
  const toggleRowSelection = (rowIdx) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowIdx)) next.delete(rowIdx);
      else next.add(rowIdx);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredRows.map((_, i) => i)));
    }
  };

  // ─── Auto-generate SKUs for selected rows ───
  const autoGenerateSkus = () => {
    const targetRows = selectedRows.size > 0 ? selectedRows : new Set(gridRows.map((_, i) => i));
    setGridRows((prev) =>
      prev.map((row, i) => {
        if (targetRows.has(i)) {
          const catName = row.category || "GEN";
          return { ...row, sku: generateBulkSku(catName) };
        }
        return row;
      })
    );
    showToast(`Generated SKUs for ${targetRows.size} row(s)`, "success");
  };

  // ─── Sorting ───
  const handleSort = (colKey) => {
    setSortConfig((prev) => ({
      key: colKey,
      dir: prev.key === colKey && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  // ─── Filtering ───
  const filteredRows = useMemo(() => {
    if (!debouncedFilter.trim()) return gridRows;

    const q = debouncedFilter.toLowerCase();
    return gridRows.filter((row) => {
      return GRID_COLUMNS.some((col) => {
        if (col.key.startsWith("__")) return false;
        const val = String(row[col.key] ?? "").toLowerCase();
        return val.includes(q);
      });
    });
  }, [gridRows, debouncedFilter]);

  // ─── Sorted rows ───
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = String(a[sortConfig.key] ?? "").toLowerCase();
      const bVal = String(b[sortConfig.key] ?? "").toLowerCase();
      if (aVal < bVal) return sortConfig.dir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortConfig]);

  // ─── Virtual scrolling ───
  const totalHeight = sortedRows.length * ROW_HEIGHT;
  const visibleStart = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - VISIBLE_BUFFER);
  const visibleEnd = Math.min(
    sortedRows.length,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + VISIBLE_BUFFER
  );
  const visibleRows = sortedRows.slice(visibleStart, visibleEnd);
  const offsetY = visibleStart * ROW_HEIGHT;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // ─── Column mapping override ───
  const updateColumnMapping = (header, fieldKey) => {
    setColumnMapping((prev) => ({ ...prev, [header]: fieldKey || null }));
  };

  // ─── Toggle column visibility ───
  const toggleColumn = (colKey) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colKey)) next.delete(colKey);
      else next.add(colKey);
      return next;
    });
  };

  // ─── Diff preview ───
  const handlePreviewChanges = () => {
    // First validate
    const valid = validateAll();
    if (!valid) {
      showToast("Please fix validation errors before previewing changes", "error");
      return;
    }

    // Build product list from grid
    const newProducts = gridRows.map((row) => gridRowToProduct(row, categories));

    // Compute diff
    const diff = computeDiff(catalogProducts, newProducts);
    setDiffResult(diff);
    setShowDiff(true);
  };

  // ─── Apply changes ───
  const handleApplyChanges = async () => {
    setIsApplying(true);
    try {
      const newProducts = gridRows.map((row) => gridRowToProduct(row, categories));
      const diff = diffResult || computeDiff(catalogProducts, newProducts);

      // Single atomic batch operation
      batchApplyChanges({
        additions: diff.additions,
        updates: diff.updates.map((u) => ({ id: u.old.id, ...u.new })),
        deletions: diff.deletions,
      });

      const total = diff.additions.length + diff.updates.length + diff.deletions.length;
      showToast(
        `Applied ${total} change(s): ${diff.additions.length} added, ${diff.updates.length} updated, ${diff.deletions.length} deleted`,
        "success"
      );

      setShowDiff(false);
      setDiffResult(null);
    } catch (err) {
      showToast(`Error applying changes: ${err.message}`, "error");
    } finally {
      setIsApplying(false);
    }
  };

  // ─── Export ───
  const handleExport = () => {
    const products = gridRows.map((row) => gridRowToProduct(row, categories));
    const csv = exportToCSV(products);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fabricforever-products-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully", "success");
  };

  // ─── Visible columns ───
  const visibleColumns = useMemo(
    () => GRID_COLUMNS.filter((c) => !hiddenColumns.has(c.key)),
    [hiddenColumns]
  );

  // ─── Total grid width ───
  const totalGridWidth = visibleColumns.reduce((sum, c) => sum + c.width, 50); // +50 for checkbox

  // ─── Render ───
  const hasData = gridRows.length > 0;
  const errorCount = Object.keys(validationErrors).length;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ─── Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 rounded-lg hover:bg-white/10 text-stone-400 transition-colors"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-heading font-bold text-white">Bulk Product Editor</h1>
            <p className="text-xs text-stone-500">
              Import CSV, edit in grid, preview & apply changes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasData && (
            <>
              <button
                onClick={handlePreviewChanges}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary-foreground text-sm font-medium hover:bg-primary/30 transition-all"
              >
                <Eye className="w-4 h-4" />
                Preview Changes
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-stone-300 text-sm font-medium hover:bg-white/10 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </>
          )}
        </div>
      </div>

      {/* ─── Import Section ─── */}
      {!hasData && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-2xl">
            {/* Import mode tabs */}
            <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1">
              <button
                onClick={() => setImportMode("file")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  importMode === "file"
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload CSV File
              </button>
              <button
                onClick={() => setImportMode("paste")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  importMode === "paste"
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 inline mr-2" />
                Paste Data
              </button>
            </div>

            {importMode === "file" ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-white/[0.02] transition-all group"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-stone-600 group-hover:text-primary/60 transition-colors" />
                <p className="text-stone-400 text-sm mb-2">
                  Drop a CSV or TSV file here, or click to browse
                </p>
                <p className="text-stone-600 text-xs">
                  Supports comma-separated (.csv) and tab-separated (.tsv) files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste your CSV or tab-separated data here...&#10;First row should contain column headers.&#10;Example:&#10;Name,Price,Category&#10;Silk Saree,2999,Silk Fabrics&#10;Cotton Kurta,1499,Cotton Fabrics"
                  rows={10}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm font-mono placeholder:text-stone-600 focus:outline-none focus:border-primary/50 resize-y"
                />
                <button
                  onClick={handlePasteImport}
                  className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all"
                >
                  Parse & Import Data
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-stone-500 text-sm mb-3">— or —</p>
              <button
                onClick={loadExistingCatalog}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-stone-300 text-sm font-medium hover:bg-white/10 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 inline mr-2" />
                Edit Existing Catalog ({catalogProducts.length} products)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Grid Section ─── */}
      {hasData && (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter rows..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Row count */}
            <span className="text-xs text-stone-500 px-2">
              {filteredRows.length} of {gridRows.length} rows
              {errorCount > 0 && (
                <span className="ml-2 text-red-400">
                  • {errorCount} row{errorCount !== 1 ? "s" : ""} with errors
                </span>
              )}
            </span>

            <div className="flex-1" />

            {/* Actions */}
            <button
              onClick={addNewRow}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-stone-300 text-sm hover:bg-white/10 transition-all"
              title="Add new row"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
            <button
              onClick={autoGenerateSkus}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-stone-300 text-sm hover:bg-white/10 transition-all"
              title="Auto-generate SKUs"
            >
              <RefreshCw className="w-4 h-4" />
              Gen SKUs
            </button>
            <button
              onClick={deleteSelectedRows}
              disabled={selectedRows.size === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Delete selected rows"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedRows.size})
            </button>
            <button
              onClick={validateAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20 transition-all"
              title="Validate all rows"
            >
              <AlertTriangle className="w-4 h-4" />
              Validate
            </button>

            {/* Column visibility */}
            <div className="relative">
              <button
                onClick={() => setShowColumnMapper(!showColumnMapper)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-stone-300 text-sm hover:bg-white/10 transition-all"
              >
                <Columns className="w-4 h-4" />
                Columns
              </button>
              {showColumnMapper && (
                <div className="absolute right-0 top-full mt-1 z-50 w-64 max-h-80 overflow-y-auto bg-stone-900 border border-white/10 rounded-xl shadow-2xl p-3">
                  <p className="text-xs text-stone-500 mb-2">Toggle column visibility</p>
                  {GRID_COLUMNS.filter((c) => !c.key.startsWith("__")).map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer text-sm text-stone-300"
                    >
                      <input
                        type="checkbox"
                        checked={!hiddenColumns.has(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded border-white/20 bg-white/5"
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column mapping info (if imported) */}
          {rawHeaders.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg">
              <span className="text-xs text-stone-500">Column mapping:</span>
              {rawHeaders.map((header) => (
                <div
                  key={header}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs"
                >
                  <span className="text-stone-400">{header}</span>
                  <span className="text-stone-600">→</span>
                  <select
                    value={columnMapping[header] || ""}
                    onChange={(e) => updateColumnMapping(header, e.target.value || null)}
                    className="bg-transparent text-primary text-xs border-none outline-none cursor-pointer"
                  >
                    <option value="">Ignore</option>
                    {PRODUCT_FIELDS.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.key}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                onClick={() => {
                  const { headers } = parseCSV(
                    rawHeaders.join(",") + "\n" + gridRows.map((r) => rawHeaders.map((h) => r[columnMapping[h]] || "").join(",")).join("\n")
                  );
                  // Re-process with updated mapping
                  processImport(
                    rawHeaders.join(",") + "\n" +
                    gridRows.map((r) =>
                      rawHeaders.map((h) => {
                        const fieldKey = columnMapping[h];
                        if (!fieldKey) return "";
                        return r[fieldKey] ?? "";
                      }).join(",")
                    ).join("\n")
                  );
                }}
                className="ml-auto text-xs text-primary hover:underline"
              >
                Re-import with mapping
              </button>
            </div>
          )}

          {/* Grid */}
          <div
            ref={gridContainerRef}
            className="flex-1 overflow-auto border border-white/10 rounded-xl bg-stone-950"
            onScroll={handleScroll}
            style={{ maxHeight: "calc(100vh - 320px)" }}
          >
            <div style={{ minWidth: totalGridWidth, height: totalHeight, position: "relative" }}>
              {/* Header row */}
              <div
                className="sticky top-0 z-20 flex bg-stone-900 border-b border-white/10"
                style={{ height: ROW_HEIGHT }}
              >
                {/* Checkbox column */}
                <div
                  className="flex-shrink-0 flex items-center justify-center border-r border-white/5"
                  style={{ width: 50 }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredRows.length && filteredRows.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-white/20 bg-white/5"
                  />
                </div>

                {visibleColumns.map((col) => (
                  <div
                    key={col.key}
                    className={`flex-shrink-0 flex items-center gap-1 px-2 border-r border-white/5 text-xs font-semibold text-stone-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors select-none ${
                      col.fixed ? "sticky left-0 bg-stone-900 z-10" : ""
                    }`}
                    style={{
                      width: col.width,
                      ...(col.key === "name" ? { left: 50 } : {}),
                    }}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {col.required && <span className="text-red-400">*</span>}
                    {sortConfig.key === col.key && (
                      <span className="ml-0.5">
                        {sortConfig.dir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Virtual scrolled rows */}
              <div style={{ transform: `translateY(${offsetY}px)` }}>
                {visibleRows.map((row, visibleIdx) => {
                  const actualIdx = visibleStart + visibleIdx;
                  const hasErrors = !!validationErrors[actualIdx];
                  const isSelected = selectedRows.has(actualIdx);

                  return (
                    <div
                      key={actualIdx}
                      className={`flex border-b border-white/[0.03] transition-colors ${
                        hasErrors
                          ? "bg-red-500/5 hover:bg-red-500/10"
                          : isSelected
                          ? "bg-primary/10 hover:bg-primary/15"
                          : "hover:bg-white/[0.02]"
                      }`}
                      style={{ height: ROW_HEIGHT }}
                    >
                      {/* Checkbox + row actions */}
                      <div
                        className="flex-shrink-0 flex items-center justify-center gap-1 border-r border-white/5 px-1"
                        style={{ width: 50 }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(actualIdx)}
                          className="rounded border-white/20 bg-white/5"
                        />
                        <button
                          onClick={() => duplicateRow(actualIdx)}
                          className="p-0.5 rounded hover:bg-white/10 text-stone-600 hover:text-stone-300 transition-colors"
                          title="Duplicate row"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteRow(actualIdx)}
                          className="p-0.5 rounded hover:bg-red-500/20 text-stone-600 hover:text-red-400 transition-colors"
                          title="Delete row"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {visibleColumns.map((col) => {
                        const isEditing =
                          editingCell?.rowIdx === actualIdx && editingCell?.colKey === col.key;
                        const cellValue = row[col.key];
                        const isNewRow = row.__isNew;
                        const hasFieldError = hasErrors && validationErrors[actualIdx]?.some(
                          (e) => e.field === col.key
                        );

                        return (
                          <div
                            key={col.key}
                            className={`flex-shrink-0 flex items-center px-2 border-r border-white/[0.03] text-sm transition-colors ${
                              col.fixed ? "sticky left-0 z-[5]" : ""
                            } ${
                              hasFieldError
                                ? "bg-red-500/10 text-red-300"
                                : isNewRow
                                ? "text-green-400"
                                : "text-stone-300"
                            } ${col.editable ? "cursor-cell" : "cursor-default"}`}
                            style={{
                              width: col.width,
                              ...(col.key === "name"
                                ? { left: 50, backgroundColor: hasFieldError ? "rgb(239 68 68 / 0.1)" : isSelected ? "rgb(34 197 94 / 0.05)" : "rgb(12 10 9)" }
                                : {}),
                            }}
                            onClick={() => {
                              if (col.editable && !isEditing) {
                                startEdit(actualIdx, col.key);
                              }
                            }}
                            title={hasFieldError ? validationErrors[actualIdx]?.find((e) => e.field === col.key)?.message : ""}
                          >
                            {isEditing ? (
                              col.type === "badge" ? (
                                <select
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={commitEdit}
                                  onKeyDown={handleEditKeyDown}
                                  className="w-full bg-stone-800 border border-primary/50 rounded px-1 py-0.5 text-white text-sm outline-none"
                                  autoFocus
                                >
                                  <option value="">None</option>
                                  {BADGE_OPTIONS.filter((b) => b !== "None").map((b) => (
                                    <option key={b} value={b}>
                                      {b}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={col.type === "number" ? "number" : "text"}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={commitEdit}
                                  onKeyDown={handleEditKeyDown}
                                  className="w-full bg-stone-800 border border-primary/50 rounded px-1 py-0.5 text-white text-sm outline-none"
                                  autoFocus
                                  min={col.type === "number" ? 0 : undefined}
                                  step={col.type === "number" ? "any" : undefined}
                                />
                              )
                            ) : (
                              <span className="truncate block w-full">
                                {col.key === "badge" && cellValue ? (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary-foreground border border-primary/30">
                                    {cellValue}
                                  </span>
                                ) : col.key === "image" && cellValue ? (
                                  <span className="text-primary text-xs truncate">📷 Image</span>
                                ) : col.key === "videoLink" && cellValue ? (
                                  <span className="text-primary text-xs truncate">🎬 Video</span>
                                ) : (
                                  cellValue || (
                                    <span className="text-stone-700">
                                      {col.required ? "— required —" : "—"}
                                    </span>
                                  )
                                )}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Empty state when filtered */}
              {visibleRows.length === 0 && gridRows.length > 0 && (
                <div className="flex items-center justify-center py-20 text-stone-500 text-sm">
                  No rows match your filter
                </div>
              )}
            </div>
          </div>

          {/* Validation error summary */}
          {errorCount > 0 && (
            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">
                  {errorCount} row{errorCount !== 1 ? "s" : ""} with validation errors
                </span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {Object.entries(validationErrors).map(([rowIdx, errors]) => (
                  <div key={rowIdx} className="text-xs text-red-300/80">
                    Row {Number(rowIdx) + 1}:{" "}
                    {errors.map((e) => e.message).join("; ")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── Diff Preview Modal ─── */}
      {showDiff && diffResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-stone-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h2 className="text-lg font-heading font-bold text-white">Review Changes</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {diffResult.additions.length} additions • {diffResult.updates.length} updates •{" "}
                  {diffResult.deletions.length} deletions
                </p>
              </div>
              <button
                onClick={() => setShowDiff(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-stone-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Additions */}
              {diffResult.additions.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-2">
                    <Plus className="w-4 h-4" />
                    New Products ({diffResult.additions.length})
                  </h3>
                  <div className="space-y-2">
                    {diffResult.additions.map((p, i) => (
                      <div
                        key={i}
                        className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg"
                      >
                        <p className="text-sm font-medium text-white">{p.name || "(unnamed)"}</p>
                        <p className="text-xs text-stone-400">
                          ₹{p.price} • {p.category} • SKU: {p.sku || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Updates */}
              {diffResult.updates.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-2">
                    <RefreshCw className="w-4 h-4" />
                    Updated Products ({diffResult.updates.length})
                  </h3>
                  <div className="space-y-2">
                    {diffResult.updates.map((upd, i) => (
                      <div
                        key={i}
                        className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg"
                      >
                        <p className="text-sm font-medium text-white">
                          {upd.new.name || upd.old.name}
                        </p>
                        <div className="mt-1.5 space-y-0.5">
                          {upd.changedFields.slice(0, 8).map((cf) => (
                            <div key={cf.field} className="flex items-center gap-2 text-xs">
                              <span className="text-stone-500 w-24 flex-shrink-0 truncate">
                                {cf.field}:
                              </span>
                              <span className="text-red-400/70 line-through truncate">
                                {String(cf.old ?? "—")}
                              </span>
                              <span className="text-stone-600">→</span>
                              <span className="text-green-400/70 truncate">
                                {String(cf.new ?? "—")}
                              </span>
                            </div>
                          ))}
                          {upd.changedFields.length > 8 && (
                            <p className="text-xs text-stone-600">
                              +{upd.changedFields.length - 8} more changes
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deletions */}
              {diffResult.deletions.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-2">
                    <Trash2 className="w-4 h-4" />
                    Products to Delete ({diffResult.deletions.length})
                  </h3>
                  <div className="space-y-2">
                    {diffResult.deletions.map((p, i) => (
                      <div
                        key={i}
                        className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg"
                      >
                        <p className="text-sm font-medium text-white">{p.name || "(unnamed)"}</p>
                        <p className="text-xs text-stone-400">
                          ID: {p.id} • ₹{p.price} • {p.category}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {diffResult.additions.length === 0 &&
                diffResult.updates.length === 0 &&
                diffResult.deletions.length === 0 && (
                  <div className="text-center py-10 text-stone-500">
                    <Check className="w-10 h-10 mx-auto mb-3 text-green-500/50" />
                    <p>No changes detected</p>
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10">
              <button
                onClick={() => setShowDiff(false)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-stone-300 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyChanges}
                disabled={
                  isApplying ||
                  (diffResult.additions.length === 0 &&
                    diffResult.updates.length === 0 &&
                    diffResult.deletions.length === 0)
                }
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Apply All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast ─── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4 transition-all ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-stone-800 text-white border border-white/10"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminBulkEditor;