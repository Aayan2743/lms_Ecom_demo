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

export const VAR_ROW = () => ({ id: newRowId(), dimension: "", optionsCsv: "" });

export const emptyVariationRows = () => [VAR_ROW()];

export const emptyFormBase = () => ({
  id: null,
  name: "",
  price: "",
  oldPrice: "",
  category: "Sarees",
  fabric: "Cotton",
  stockLeft: "",
  badge: "",
  image: "",
  rating: "4.5",
  reviews: "0",
  colorsCsv: "",
  variationRows: emptyVariationRows(),
  seoSlug: "",
  seoMetaTitle: "",
  seoMetaDescription: "",
  seoKeywords: "",
  taxGstPercent: "5",
  taxHsnCode: "",
  priceTaxInclusive: true,
  affiliateEnabled: false,
  affiliateCommissionPercent: "0",
  affiliateNetwork: "",
  affiliateCampaignId: "",
  affiliateReferralParam: "",
});

export const productIntoForm = (p, categoryDefault) => {
  const seo = p.seo || {};
  const tax = p.tax || {};
  const aff = p.affiliate || {};
  const vars =
    Array.isArray(p.variations) && p.variations.length
      ? p.variations.map((v) => ({
          id: newRowId(),
          dimension: v.dimension || v.name || "",
          optionsCsv: (v.options || []).join(", "),
        }))
      : emptyVariationRows();
  const colorsCsv = (p.colors && p.colors.length ? p.colors : ["#78350f"]).join(", ");

  return {
    id: p.id,
    name: p.name,
    price: String(p.price),
    oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
    category: p.category || categoryDefault,
    fabric: p.fabric || "Cotton",
    stockLeft: String(p.stockLeft ?? 0),
    badge: p.badge || "",
    image: p.image || "",
    rating: String(p.rating ?? 4.5),
    reviews: String(p.reviews ?? 0),
    colorsCsv,
    variationRows: vars,
    seoSlug: seo.slug || slugify(p.name),
    seoMetaTitle: seo.metaTitle || "",
    seoMetaDescription: seo.metaDescription || "",
    seoKeywords: typeof seo.keywords === "string" ? seo.keywords : (seo.keywordList || []).join(", "),
    taxGstPercent: String(tax.gstPercent ?? 5),
    taxHsnCode: tax.hsnCode || "",
    priceTaxInclusive: tax.priceTaxInclusive !== false,
    affiliateEnabled: !!aff.enabled,
    affiliateCommissionPercent: String(aff.commissionPercent ?? 0),
    affiliateNetwork: aff.network || "",
    affiliateCampaignId: aff.campaignId || "",
    affiliateReferralParam: aff.referralParam || "",
  };
};
