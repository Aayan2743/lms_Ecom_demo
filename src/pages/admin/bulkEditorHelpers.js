// ─── Bulk Product Editor Helpers ───
// CSV/TSV parsing, column mapping, validation, SKU generation, export

export const BADGE_OPTIONS = [
  "None",
  "Bestseller",
  "Trending",
  "New Arrival",
  "Premium",
  "Exclusive",
  "Value Pick",
  "Artisanal",
  "Heritage",
  "Limited Edition",
  "Sale",
];

// Canonical product fields with aliases for auto-detection
export const PRODUCT_FIELDS = [
  { key: "id", aliases: ["id", "product id", "productid", "product_id", "sku code"] },
  { key: "name", aliases: ["name", "product name", "productname", "title", "product title"] },
  { key: "description", aliases: ["description", "desc", "product description", "details", "info"] },
  { key: "price", aliases: ["price", "selling price", "sale price", "mrp", "amount", "rate", "cost"] },
  { key: "oldPrice", aliases: ["old price", "compare at price", "compare-at price", "original price", "mrp", "list price", "regular price"] },
  { key: "discountPercent", aliases: ["discount", "discount %", "discount percent", "discountpercent", "off %", "discount rate"] },
  { key: "category", aliases: ["category", "cat", "product category", "type", "fabric type"] },
  { key: "subcategory", aliases: ["subcategory", "sub category", "sub-category", "subcat"] },
  { key: "fabric", aliases: ["fabric", "material", "fabric type", "fabrictype"] },
  { key: "badge", aliases: ["badge", "tag", "label", "product badge", "badge label"] },
  { key: "image", aliases: ["image", "image url", "imageurl", "photo", "picture", "img", "image link"] },
  { key: "videoLink", aliases: ["video", "video link", "videolink", "video url"] },
  { key: "stockLeft", aliases: ["stock", "stock left", "stockleft", "quantity", "qty", "inventory", "available"] },
  { key: "sku", aliases: ["sku", "sku code", "stock keeping unit", "product code"] },
  { key: "barcode", aliases: ["barcode", "bar code", "ean", "upc"] },
  { key: "qrCode", aliases: ["qr code", "qrcode", "qr"] },
  { key: "rating", aliases: ["rating", "stars", "product rating"] },
  { key: "reviews", aliases: ["reviews", "review count", "total reviews"] },
  { key: "purchasedCount", aliases: ["purchased", "purchased count", "sold", "sales count", "orders"] },
  { key: "taxGstPercent", aliases: ["tax %", "gst %", "tax percent", "gst percent", "taxgstpercent", "tax rate"] },
  { key: "taxHsnCode", aliases: ["hsn", "hsn code", "hsncode", "tax hsn", "gst hsn"] },
  { key: "taxAmount", aliases: ["tax amount", "taxamount", "tax", "gst amount"] },
  { key: "seoSlug", aliases: ["slug", "seo slug", "seoslug", "url slug"] },
  { key: "seoMetaTitle", aliases: ["meta title", "seo title", "seotitle", "meta title tag"] },
  { key: "seoMetaDescription", aliases: ["meta description", "seo description", "seodescription", "meta desc"] },
  { key: "seoKeywords", aliases: ["keywords", "seo keywords", "seokeywords", "tags"] },
  { key: "seoTags", aliases: ["seo tags", "seotags", "meta tags"] },
  { key: "color", aliases: ["color", "colour", "color name", "colour name"] },
  { key: "size", aliases: ["size", "dimensions", "length", "width"] },
  { key: "shippingInfo", aliases: ["shipping", "shipping info", "delivery", "shipping details"] },
  { key: "metadata", aliases: ["metadata", "meta", "extra", "notes"] },
];

export const REQUIRED_FIELDS = ["name", "price", "category"];

// ─── Parse CSV / TSV ───
export function parseCSV(text) {
  if (!text || !text.trim()) return { headers: [], rows: [] };

  // Detect delimiter: tab or comma
  const firstLine = text.trim().split("\n")[0];
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g) || []).length;
  const delimiter = tabCount > commaCount ? "\t" : ",";

  const lines = text.trim().split("\n");
  if (lines.length < 1) return { headers: [], rows: [] };

  // Parse headers
  const headers = splitCSVLine(lines[0], delimiter).map((h) =>
    h.trim().replace(/^["']|["']$/g, "")
  );

  // Parse rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = splitCSVLine(line, delimiter).map((v) =>
      v.trim().replace(/^["']|["']$/g, "")
    );
    if (values.length === 0 || values.every((v) => !v)) continue;

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] !== undefined ? values[idx] : "";
    });
    rows.push(row);
  }

  return { headers, rows };
}

function splitCSVLine(line, delimiter) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Auto-detect column mapping ───
export function detectColumnMapping(headers) {
  const mapping = {}; // headerName -> productFieldKey
  const usedFields = new Set();

  for (const header of headers) {
    const normalized = header.toLowerCase().trim();
    let bestMatch = null;

    for (const field of PRODUCT_FIELDS) {
      if (usedFields.has(field.key)) continue; // already mapped
      for (const alias of field.aliases) {
        if (normalized === alias || normalized.includes(alias)) {
          bestMatch = field.key;
          break;
        }
      }
      if (bestMatch) break;
    }

    if (bestMatch) {
      mapping[header] = bestMatch;
      usedFields.add(bestMatch);
    } else {
      mapping[header] = null; // unmapped
    }
  }

  return mapping;
}

// ─── Map a raw row to product fields using column mapping ───
export function mapRow(rawRow, columnMapping) {
  const mapped = {};
  for (const [header, fieldKey] of Object.entries(columnMapping)) {
    if (fieldKey && rawRow[header] !== undefined) {
      mapped[fieldKey] = rawRow[header];
    }
  }
  return mapped;
}

// ─── Validate a mapped row ───
export function validateRow(mappedRow, rowIndex, categories) {
  const errors = [];

  // Required fields
  if (!mappedRow.name || !String(mappedRow.name).trim()) {
    errors.push({ field: "name", message: "Name is required" });
  }
  if (
    mappedRow.price === undefined ||
    mappedRow.price === "" ||
    isNaN(Number(mappedRow.price)) ||
    Number(mappedRow.price) < 0
  ) {
    errors.push({ field: "price", message: "Valid price is required" });
  }
  if (!mappedRow.category || !String(mappedRow.category).trim()) {
    errors.push({ field: "category", message: "Category is required" });
  } else {
    // Validate category exists
    const catName = String(mappedRow.category).trim();
    const found = categories.some(
      (c) => c.name.toLowerCase() === catName.toLowerCase()
    );
    if (!found) {
      errors.push({
        field: "category",
        message: `Category "${catName}" not found in catalog`,
      });
    }
  }

  // Validate badge if present
  if (mappedRow.badge && String(mappedRow.badge).trim()) {
    const badgeVal = String(mappedRow.badge).trim();
    if (
      badgeVal.toLowerCase() !== "none" &&
      !BADGE_OPTIONS.some((b) => b.toLowerCase() === badgeVal.toLowerCase())
    ) {
      errors.push({
        field: "badge",
        message: `Badge "${badgeVal}" is not a valid option`,
      });
    }
  }

  // Validate numeric fields
  if (mappedRow.discountPercent !== undefined && mappedRow.discountPercent !== "") {
    const d = Number(mappedRow.discountPercent);
    if (isNaN(d) || d < 0 || d > 100) {
      errors.push({ field: "discountPercent", message: "Discount must be 0-100" });
    }
  }
  if (mappedRow.stockLeft !== undefined && mappedRow.stockLeft !== "") {
    if (isNaN(Number(mappedRow.stockLeft)) || Number(mappedRow.stockLeft) < 0) {
      errors.push({ field: "stockLeft", message: "Stock must be a non-negative number" });
    }
  }
  if (mappedRow.rating !== undefined && mappedRow.rating !== "") {
    const r = Number(mappedRow.rating);
    if (isNaN(r) || r < 0 || r > 5) {
      errors.push({ field: "rating", message: "Rating must be 0-5" });
    }
  }
  if (mappedRow.taxGstPercent !== undefined && mappedRow.taxGstPercent !== "") {
    if (isNaN(Number(mappedRow.taxGstPercent)) || Number(mappedRow.taxGstPercent) < 0) {
      errors.push({ field: "taxGstPercent", message: "Tax % must be non-negative" });
    }
  }

  return errors;
}

// ─── Generate SKU for bulk rows ───
let _skuCounter = 0;
export function resetSkuCounter() {
  _skuCounter = 0;
}

export function generateBulkSku(categoryName) {
  _skuCounter++;
  const catCode = (categoryName || "GEN")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
  const seq = String(_skuCounter).padStart(4, "0");
  return `${catCode}-${seq}`;
}

// ─── Build a full product object from a mapped row ───
export function buildProduct(mappedRow, existingProduct, categories) {
  const catName = String(mappedRow.category || existingProduct?.category || "").trim();
  const categoryObj = categories.find(
    (c) => c.name.toLowerCase() === catName.toLowerCase()
  );

  const base = existingProduct
    ? { ...existingProduct }
    : {
        id: null,
        rating: "4.5",
        reviews: "0",
        purchasedCount: "0",
        priceTaxInclusive: true,
        variations: [],
        colors: [],
        seo: {},
        tax: {},
      };

  // Normalize values
  const price = mappedRow.price !== undefined ? Number(mappedRow.price) || 0 : base.price || 0;
  const oldPrice =
    mappedRow.oldPrice !== undefined
      ? Number(mappedRow.oldPrice) || 0
      : base.oldPrice || 0;
  const discountPercent =
    mappedRow.discountPercent !== undefined
      ? Number(mappedRow.discountPercent) || 0
      : base.discountPercent || 0;

  // Build SEO object
  const seo = {
    slug:
      mappedRow.seoSlug ||
      base.seo?.slug ||
      String(mappedRow.name || base.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    metaTitle: mappedRow.seoMetaTitle || base.seo?.metaTitle || "",
    metaDescription: mappedRow.seoMetaDescription || base.seo?.metaDescription || "",
    keywords: mappedRow.seoKeywords
      ? String(mappedRow.seoKeywords)
          .split(/[,;]/)
          .map((k) => k.trim())
          .filter(Boolean)
      : base.seo?.keywords || [],
    tags: mappedRow.seoTags
      ? String(mappedRow.seoTags)
          .split(/[,;]/)
          .map((t) => t.trim())
          .filter(Boolean)
      : base.seo?.tags || [],
  };

  // Build tax object
  const taxGstPercent =
    mappedRow.taxGstPercent !== undefined
      ? Number(mappedRow.taxGstPercent) || 5
      : base.tax?.gstPercent || 5;
  const taxAmount =
    mappedRow.taxAmount !== undefined
      ? Number(mappedRow.taxAmount) || 0
      : base.tax?.amount || 0;

  const tax = {
    gstPercent: taxGstPercent,
    hsnCode: mappedRow.taxHsnCode || base.tax?.hsnCode || "",
    amount: taxAmount,
    priceTaxInclusive: base.priceTaxInclusive !== undefined ? base.priceTaxInclusive : true,
  };

  // Handle color → variations
  let variations = base.variations || [];
  let colors = base.colors || [];
  if (mappedRow.color) {
    const colorName = String(mappedRow.color).trim();
    const existingVar = variations.find(
      (v) => v.color?.toLowerCase() === colorName.toLowerCase()
    );
    if (!existingVar) {
      variations = [
        ...variations,
        {
          id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          color: colorName,
          hex: "#888888",
          pricePerMeter: price,
          stock: Number(mappedRow.stockLeft) || 0,
        },
      ];
    }
    if (!colors.includes(colorName)) {
      colors = [...colors, colorName];
    }
  }

  // Handle badge
  let badge = mappedRow.badge !== undefined ? String(mappedRow.badge).trim() : base.badge || "";
  if (badge.toLowerCase() === "none") badge = "";

  return {
    ...base,
    id: existingProduct?.id || base.id,
    name: mappedRow.name !== undefined ? String(mappedRow.name).trim() : base.name || "",
    description:
      mappedRow.description !== undefined
        ? String(mappedRow.description).trim()
        : base.description || "",
    price,
    oldPrice,
    discountPercent,
    category: catName || base.category || "",
    subcategory:
      mappedRow.subcategory !== undefined
        ? String(mappedRow.subcategory).trim()
        : base.subcategory || "",
    fabric:
      mappedRow.fabric !== undefined
        ? String(mappedRow.fabric).trim()
        : base.fabric || "",
    badge,
    image:
      mappedRow.image !== undefined
        ? String(mappedRow.image).trim()
        : base.image || "",
    imagePreview: base.imagePreview || "",
    videoLink:
      mappedRow.videoLink !== undefined
        ? String(mappedRow.videoLink).trim()
        : base.videoLink || "",
    stockLeft:
      mappedRow.stockLeft !== undefined
        ? Number(mappedRow.stockLeft) || 0
        : base.stockLeft || 0,
    sku:
      mappedRow.sku !== undefined
        ? String(mappedRow.sku).trim()
        : base.sku || "",
    barcode:
      mappedRow.barcode !== undefined
        ? String(mappedRow.barcode).trim()
        : base.barcode || "",
    qrCode:
      mappedRow.qrCode !== undefined
        ? String(mappedRow.qrCode).trim()
        : base.qrCode || "",
    rating:
      mappedRow.rating !== undefined
        ? String(mappedRow.rating).trim()
        : base.rating || "4.5",
    reviews:
      mappedRow.reviews !== undefined
        ? String(mappedRow.reviews).trim()
        : base.reviews || "0",
    purchasedCount:
      mappedRow.purchasedCount !== undefined
        ? String(mappedRow.purchasedCount).trim()
        : base.purchasedCount || "0",
    variations,
    colors,
    seo,
    tax,
    shippingInfo:
      mappedRow.shippingInfo !== undefined
        ? String(mappedRow.shippingInfo).trim()
        : base.shippingInfo || "",
    metadata:
      mappedRow.metadata !== undefined
        ? String(mappedRow.metadata).trim()
        : base.metadata || "",
  };
}

// ─── Export catalog to CSV ───
export function exportToCSV(products) {
  if (!products || products.length === 0) return "";

  const headers = [
    "ID",
    "Name",
    "Description",
    "Price",
    "Compare-at Price",
    "Discount %",
    "Category",
    "Subcategory",
    "Fabric",
    "Badge",
    "Image URL",
    "Video Link",
    "Stock Left",
    "SKU",
    "Barcode",
    "QR Code",
    "Rating",
    "Reviews",
    "Purchased Count",
    "Tax GST %",
    "Tax HSN Code",
    "Tax Amount",
    "SEO Slug",
    "SEO Meta Title",
    "SEO Meta Description",
    "SEO Keywords",
    "SEO Tags",
    "Color",
    "Size",
    "Shipping Info",
    "Metadata",
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [headers.join(",")];

  for (const p of products) {
    const row = [
      p.id || "",
      p.name || "",
      p.description || "",
      p.price || "",
      p.oldPrice || "",
      p.discountPercent || "",
      p.category || "",
      p.subcategory || "",
      p.fabric || "",
      p.badge || "",
      p.image || "",
      p.videoLink || "",
      p.stockLeft || "",
      p.sku || "",
      p.barcode || "",
      p.qrCode || "",
      p.rating || "",
      p.reviews || "",
      p.purchasedCount || "",
      p.tax?.gstPercent || "",
      p.tax?.hsnCode || "",
      p.tax?.amount || "",
      p.seo?.slug || "",
      p.seo?.metaTitle || "",
      p.seo?.metaDescription || "",
      (p.seo?.keywords || []).join("; "),
      (p.seo?.tags || []).join("; "),
      (p.colors || []).join("; "),
      "",
      p.shippingInfo || "",
      p.metadata || "",
    ];
    lines.push(row.map(escapeCSV).join(","));
  }

  return lines.join("\n");
}

// ─── Compute diff between old and new products ───
export function computeDiff(catalogProducts, newProducts) {
  const catalogMap = new Map(catalogProducts.map((p) => [p.id, p]));
  const newMap = new Map();

  const additions = [];
  const updates = [];
  const deletions = [];

  // Find additions and updates
  for (const np of newProducts) {
    if (np.id && catalogMap.has(np.id)) {
      // Existing product — check if changed
      const old = catalogMap.get(np.id);
      const changedFields = getChangedFields(old, np);
      if (changedFields.length > 0) {
        updates.push({ old, new: np, changedFields });
      }
      newMap.set(np.id, true);
    } else {
      // New product
      additions.push(np);
    }
  }

  // Find deletions
  for (const [id, old] of catalogMap) {
    if (!newMap.has(id)) {
      deletions.push(old);
    }
  }

  return { additions, updates, deletions };
}

function getChangedFields(oldProduct, newProduct) {
  const fieldsToCompare = [
    "name",
    "description",
    "price",
    "oldPrice",
    "discountPercent",
    "category",
    "subcategory",
    "fabric",
    "badge",
    "image",
    "videoLink",
    "stockLeft",
    "sku",
    "barcode",
    "qrCode",
    "rating",
    "reviews",
    "purchasedCount",
    "shippingInfo",
    "metadata",
  ];

  const changed = [];

  for (const field of fieldsToCompare) {
    const oldVal = oldProduct[field];
    const newVal = newProduct[field];
    if (String(oldVal ?? "") !== String(newVal ?? "")) {
      changed.push({
        field,
        old: oldVal,
        new: newVal,
      });
    }
  }

  // Compare nested objects
  if (oldProduct.tax && newProduct.tax) {
    for (const tf of ["gstPercent", "hsnCode", "amount"]) {
      if (String(oldProduct.tax[tf] ?? "") !== String(newProduct.tax[tf] ?? "")) {
        changed.push({
          field: `tax.${tf}`,
          old: oldProduct.tax[tf],
          new: newProduct.tax[tf],
        });
      }
    }
  }

  if (oldProduct.seo && newProduct.seo) {
    for (const sf of ["slug", "metaTitle", "metaDescription"]) {
      if (String(oldProduct.seo[sf] ?? "") !== String(newProduct.seo[sf] ?? "")) {
        changed.push({
          field: `seo.${sf}`,
          old: oldProduct.seo[sf],
          new: newProduct.seo[sf],
        });
      }
    }
    const oldKw = (oldProduct.seo.keywords || []).join(", ");
    const newKw = (newProduct.seo.keywords || []).join(", ");
    if (oldKw !== newKw) {
      changed.push({ field: "seo.keywords", old: oldKw, new: newKw });
    }
    const oldTags = (oldProduct.seo.tags || []).join(", ");
    const newTags = (newProduct.seo.tags || []).join(", ");
    if (oldTags !== newTags) {
      changed.push({ field: "seo.tags", old: oldTags, new: newTags });
    }
  }

  return changed;
}