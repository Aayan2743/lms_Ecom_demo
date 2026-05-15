export const slugify = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const newRowId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `vr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** Each colour variation: name, hex, per‑metre price, optional image */
export const VAR_ROW = () => ({
  id: newRowId(),
  colorName: "",
  colorHex: "#78350f",
  pricePerMeter: "",
  image: "",
});

export const emptyVariationRows = () => [VAR_ROW()];

export const emptyFormBase = () => ({
  id: null,
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  discountPercent: "",
  category: "Silk Fabrics",
  subcategory: "",
  fabric: "Silk",
  stockLeft: "",
  badge: "",
  image: "",
  imagePreview: "",
  videoLink: "",
  rating: "4.5",
  reviews: "0",
  purchasedCount: "0",
  sku: "",
  barcode: "",
  qrCode: "",
  variationRows: emptyVariationRows(),
  // SEO
  seoSlug: "",
  seoMetaTitle: "",
  seoMetaDescription: "",
  seoKeywords: [],
  seoTags: [],
  // Tax
  taxGstPercent: "5",
  taxHsnCode: "",
  taxAmount: "",
  priceTaxInclusive: true,
});

export const productIntoForm = (p, categoryDefault) => {
  const seo = p.seo || {};
  const tax = p.tax || {};

  // Colour variations → form rows
  let vars;
  if (Array.isArray(p.variations) && p.variations.length) {
    vars = p.variations.map((v) => ({
      id: newRowId(),
      colorName: v.colorName || v.name || "",
      colorHex: v.colorHex || v.hex || "#78350f",
      pricePerMeter: v.pricePerMeter != null ? String(v.pricePerMeter) : "",
      image: v.image || "",
    }));
  } else if (Array.isArray(p.colors) && p.colors.length) {
    // Legacy: flat colors array → convert to variation rows
    vars = p.colors.map((hex) => ({
      id: newRowId(),
      colorName: "",
      colorHex: hex,
      pricePerMeter: "",
      image: "",
    }));
  } else {
    vars = emptyVariationRows();
  }

  // Compute discount % from price / oldPrice if not stored explicitly
  const discount =
    p.discountPercent != null
      ? String(p.discountPercent)
      : p.price && p.oldPrice && p.oldPrice > p.price
        ? String(Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100))
        : "";

  // Keywords: handle string or array
  let kwArr = [];
  if (Array.isArray(seo.keywords)) kwArr = seo.keywords;
  else if (typeof seo.keywords === "string" && seo.keywords.trim()) kwArr = seo.keywords.split(",").map((s) => s.trim()).filter(Boolean);
  else if (Array.isArray(seo.keywordList)) kwArr = seo.keywordList;

  // Tags: handle string or array
  let tagArr = [];
  if (Array.isArray(seo.tags)) tagArr = seo.tags;
  else if (typeof seo.tags === "string" && seo.tags.trim()) tagArr = seo.tags.split(",").map((s) => s.trim()).filter(Boolean);

  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    price: String(p.price),
    oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
    discountPercent: discount,
    category: p.category || categoryDefault,
    subcategory: p.subcategory || "",
    fabric: p.fabric || "Cotton",
    stockLeft: String(p.stockLeft ?? 0),
    badge: p.badge || "",
    image: p.image || "",
    imagePreview: p.image || "",
    videoLink: p.videoLink || "",
    rating: String(p.rating ?? 4.5),
    reviews: String(p.reviews ?? 0),
    purchasedCount: String(p.purchasedCount ?? 0),
    sku: p.sku || "",
    barcode: p.barcode || "",
    qrCode: p.qrCode || "",
    variationRows: vars,
    // SEO
    seoSlug: seo.slug || slugify(p.name),
    seoMetaTitle: seo.metaTitle || "",
    seoMetaDescription: seo.metaDescription || "",
    seoKeywords: kwArr,
    seoTags: tagArr,
    // Tax
    taxGstPercent: String(tax.gstPercent ?? 5),
    taxHsnCode: tax.hsnCode || "",
    taxAmount: tax.taxAmount != null ? String(tax.taxAmount) : "",
    priceTaxInclusive: tax.priceTaxInclusive !== false,
  };
};
