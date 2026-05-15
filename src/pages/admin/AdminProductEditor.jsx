import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, GripVertical, Upload, X, RefreshCw } from "lucide-react";
import { useShop } from "../../ShopContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  emptyFormBase,
  productIntoForm,
  slugify,
  VAR_ROW,
  emptyVariationRows,
} from "./productFormHelpers.js";

const AdminProductEditor = () => {
  const { id } = useParams();
  const location = useLocation();
  const isNew = location.pathname.endsWith("/new");
  const navigate = useNavigate();
  const { catalogProducts, categories, addProduct, updateProduct } = useShop();
  const [form, setForm] = useState(emptyFormBase);
  const fileInputRef = useRef(null);

  const categoryNames = categories.length ? categories.map((c) => c.name) : ["Silk Fabrics", "Cotton Fabrics", "Linen Fabrics", "Georgette Fabrics", "Organza Fabrics", "Chiffon Fabrics", "Velvet Fabrics", "Crepe Fabrics"];

  const subcategoryOptions = (() => {
    const cat = categories.find((c) => c.name === form.category);
    return cat && cat.children ? cat.children.map((s) => s.name) : [];
  })();

  useEffect(() => {
    const first = (categories.length ? categories.map((c) => c.name) : ["Silk Fabrics", "Cotton Fabrics", "Linen Fabrics", "Georgette Fabrics", "Organza Fabrics", "Chiffon Fabrics", "Velvet Fabrics", "Crepe Fabrics"])[0] || "Silk Fabrics";
    if (isNew) {
      const f = emptyFormBase();
      f.category = first;
      setForm(f);
      return;
    }
    const numId = Number(id);
    const product = catalogProducts.find((p) => p.id === numId || String(p.id) === String(id));
    if (!product) {
      navigate("/admin/products", { replace: true });
      return;
    }
    setForm(productIntoForm(product, first));
  }, [id, isNew, catalogProducts, categories, navigate]);

  // Auto-compute discount % when price or oldPrice changes
  const computeDiscount = (price, oldPrice) => {
    const p = Number(price);
    const o = Number(oldPrice);
    if (p && o && o > p) return String(Math.round(((o - p) / o) * 100));
    return "";
  };

  const setField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "price" || key === "oldPrice") {
        next.discountPercent = computeDiscount(
          key === "price" ? value : prev.price,
          key === "oldPrice" ? value : prev.oldPrice
        );
      }
      return next;
    });
  };

  const setVariationRow = (rid, patch) => {
    setForm((prev) => ({
      ...prev,
      variationRows: prev.variationRows.map((r) => (r.id === rid ? { ...r, ...patch } : r)),
    }));
  };

  const addVariationRow = () => {
    setForm((prev) => ({ ...prev, variationRows: [...prev.variationRows, VAR_ROW()] }));
  };

  const removeVariationRow = (rid) => {
    setForm((prev) => ({
      ...prev,
      variationRows:
        prev.variationRows.length <= 1 ? emptyVariationRows() : prev.variationRows.filter((r) => r.id !== rid),
    }));
  };

  const inferSlugFromName = () => {
    if (!form.name.trim()) return;
    setForm((prev) => ({ ...prev, seoSlug: slugify(prev.name) }));
  };

  // ── SKU auto-generate ──
  const generateSku = () => {
    const cat = form.category || "GEN";
    const catCode = cat.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
    const ts = Date.now().toString(36).toUpperCase().slice(-4);
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
    setField("sku", `FAB-${catCode}-${ts}${rand}`);
  };

  // ── Image upload ──
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // ── Tag helpers ──
  const addTag = (field, value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setForm((prev) => {
      const existing = prev[field] || [];
      if (existing.includes(trimmed)) return prev;
      return { ...prev, [field]: [...existing, trimmed] };
    });
  };

  const removeTag = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    // Colour variations
    const variations = form.variationRows
      .filter((r) => r.colorName.trim())
      .map((r) => ({
        colorName: r.colorName.trim(),
        colorHex: r.colorHex.trim() || "#78350f",
        pricePerMeter: r.pricePerMeter ? Number(r.pricePerMeter) : undefined,
        image: r.image.trim() || undefined,
      }));

    // Derive flat colors array for storefront compatibility
    const colors = variations.length
      ? variations.map((v) => v.colorHex)
      : ["#78350f"];

    const slug = form.seoSlug.trim() || slugify(form.name);
    const seo = {
      slug,
      metaTitle: form.seoMetaTitle.trim() || form.name.trim(),
      metaDescription: form.seoMetaDescription.trim(),
      keywords: (form.seoKeywords || []).join(", "),
      tags: form.seoTags || [],
    };

    const tax = {
      gstPercent: Math.min(28, Math.max(0, Number(form.taxGstPercent) || 0)),
      hsnCode: form.taxHsnCode.trim(),
      taxAmount: form.taxAmount ? Number(form.taxAmount) : undefined,
      priceTaxInclusive: !!form.priceTaxInclusive,
    };

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : Number(form.price),
      discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined,
      category: form.category,
      subcategory: form.subcategory.trim() || undefined,
      fabric: form.fabric.trim(),
      stockLeft: Math.max(0, Number(form.stockLeft) || 0),
      badge: form.badge.trim() || undefined,
      image: form.image.trim(),
      videoLink: form.videoLink.trim() || undefined,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      purchasedCount: Math.max(0, Number(form.purchasedCount) || 0),
      sku: form.sku.trim() || undefined,
      barcode: form.barcode.trim() || undefined,
      qrCode: form.qrCode.trim() || undefined,
      colors,
      variations: variations.length ? variations : undefined,
      seo,
      tax,
    };

    if (!payload.name || !payload.image || Number.isNaN(payload.price)) return;
    if (isNew) {
      addProduct(payload);
    } else {
      updateProduct(form.id, payload);
    }
    navigate("/admin/products", { replace: true });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-wrap items-start gap-4">
        <Button type="button" variant="outline" size="icon" asChild className="shrink-0 border-white/10 text-stone-400 hover:bg-white/10 hover:text-white">
          <Link to="/admin/products" aria-label="Back to products">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl text-white">{isNew ? "Add product" : "Edit product"}</h1>
          <p className="text-sm text-stone-400 mt-1">
            {isNew ? "Create a new catalogue item." : `ID ${form.id} · changes save to this browser.`}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-10 bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
        {/* ── Core ── */}
        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-white mb-2 block w-full pb-2 border-b border-white/10">
            Core
          </legend>
          <div className="space-y-2">
            <Label className="text-stone-300">Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => {
                if (!form.seoSlug.trim() && form.name.trim()) inferSlugFromName();
              }}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-stone-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-stone-300">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              placeholder="Rich product description…"
              className="bg-white/5 border-white/10 text-white placeholder:text-stone-600"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-stone-300">Price per meter (₹)</Label>
              <Input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Compare at (₹)</Label>
              <Input type="number" min={0} step="0.01" value={form.oldPrice} onChange={(e) => setField("oldPrice", e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Discount %</Label>
              <Input type="number" min={0} max={99} step="1" value={form.discountPercent} onChange={(e) => setField("discountPercent", e.target.value)} placeholder="Auto" className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
              <p className="text-xs text-stone-500">Auto-calculated from price & compare-at. Override if needed.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-stone-300">Category</Label>
              <select
                className="w-full h-10 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                {categoryNames.map((c) => (
                  <option key={c} value={c} className="bg-stone-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Subcategory</Label>
              <select
                className="w-full h-10 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                value={form.subcategory}
                onChange={(e) => setField("subcategory", e.target.value)}
              >
                <option value="" className="bg-stone-900 text-stone-500">— None —</option>
                {subcategoryOptions.map((s) => (
                  <option key={s} value={s} className="bg-stone-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Fabric</Label>
              <Input value={form.fabric} onChange={(e) => setField("fabric", e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-stone-300">Stock</Label>
              <Input type="number" min={0} value={form.stockLeft} onChange={(e) => setField("stockLeft", e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Badge</Label>
              <select
                className="w-full h-10 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                value={form.badge}
                onChange={(e) => setField("badge", e.target.value)}
              >
                <option value="" className="bg-stone-900 text-stone-500">— None —</option>
                <option value="Bestseller" className="bg-stone-900 text-white">Bestseller</option>
                <option value="Trending" className="bg-stone-900 text-white">Trending</option>
                <option value="New Arrival" className="bg-stone-900 text-white">New Arrival</option>
                <option value="Premium" className="bg-stone-900 text-white">Premium</option>
                <option value="Exclusive" className="bg-stone-900 text-white">Exclusive</option>
                <option value="Value Pick" className="bg-stone-900 text-white">Value Pick</option>
                <option value="Artisanal" className="bg-stone-900 text-white">Artisanal</option>
                <option value="Heritage" className="bg-stone-900 text-white">Heritage</option>
                <option value="Limited Edition" className="bg-stone-900 text-white">Limited Edition</option>
                <option value="Sale" className="bg-stone-900 text-white">Sale</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Purchased count</Label>
              <Input type="number" min={0} value={form.purchasedCount} onChange={(e) => setField("purchasedCount", e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-stone-300">Product Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {form.imagePreview ? (
                <div className="relative group rounded-xl overflow-hidden border border-white/10">
                  <img src={form.imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { fileInputRef.current?.click(); }}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" /> Change image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-stone-500 hover:border-white/30 hover:text-stone-300 transition-colors"
                >
                  <Upload className="w-8 h-8" />
                  <span className="text-sm">Click to upload product image</span>
                </button>
              )}
              <Input
                value={form.image}
                onChange={(e) => setField("image", e.target.value)}
                placeholder="Or paste image URL…"
                className="bg-white/5 border-white/10 text-white placeholder:text-stone-600 mt-2"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Video link</Label>
              <Input value={form.videoLink} onChange={(e) => setField("videoLink", e.target.value)} placeholder="https://youtube.com/… or .mp4 URL" className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-stone-300">Rating</Label>
              <Input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setField("rating", e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Reviews count</Label>
              <Input type="number" min={0} value={form.reviews} onChange={(e) => setField("reviews", e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
          </div>
        </fieldset>

        {/* ── Inventory & Codes ── */}
        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-white mb-2 block w-full pb-2 border-b border-white/10">
            Inventory & Codes
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-stone-300">SKU</Label>
              <div className="flex gap-2">
                <Input value={form.sku} onChange={(e) => setField("sku", e.target.value)} placeholder="e.g. FAB-SIL-001" className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
                <Button type="button" variant="outline" size="icon" onClick={generateSku} title="Auto-generate SKU" className="shrink-0 border-white/10 text-stone-400 hover:bg-white/10 hover:text-white">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Barcode</Label>
              <Input value={form.barcode} onChange={(e) => setField("barcode", e.target.value)} placeholder="e.g. 8901234567890" className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">QR code data / URL</Label>
              <Input value={form.qrCode} onChange={(e) => setField("qrCode", e.target.value)} placeholder="https://… or text" className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
          </div>
        </fieldset>

        {/* ── Colour Variations (per‑metre pricing) ── */}
        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-white mb-2 flex items-center justify-between w-full pb-2 border-b border-white/10 gap-4">
            <span>Colour Variations (per‑metre price)</span>
            <Button type="button" variant="outline" size="sm" className="gap-1 shrink-0 border-white/10 text-stone-400 hover:bg-white/10 hover:text-white" onClick={addVariationRow}>
              <Plus className="w-3.5 h-3.5" /> Add colour
            </Button>
          </legend>
          <p className="text-xs text-stone-500 -mt-1">
            Each colour can have its own per‑metre price and optional image. Leave price empty to use the base price above.
          </p>
          <div className="space-y-3">
            {form.variationRows.map((row, idx) => (
              <div key={row.id} className="flex flex-wrap gap-3 items-start p-4 rounded-xl border border-white/10 bg-white/5">
                <GripVertical className="w-4 h-4 text-stone-600 mt-2.5 shrink-0 hidden sm:block" aria-hidden />
                <div className="flex-1 min-w-[120px] space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-stone-500">Colour name</Label>
                  <Input
                    placeholder="e.g. Maroon, Gold"
                    value={row.colorName}
                    onChange={(e) => setVariationRow(row.id, { colorName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-stone-600"
                  />
                </div>
                <div className="w-[90px] space-y-2 shrink-0">
                  <Label className="text-xs uppercase tracking-wide text-stone-500">Hex</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={row.colorHex}
                      onChange={(e) => setVariationRow(row.id, { colorHex: e.target.value })}
                      className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer p-0"
                    />
                    <Input
                      value={row.colorHex}
                      onChange={(e) => setVariationRow(row.id, { colorHex: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-stone-600 text-xs w-[70px]"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[120px] space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-stone-500">Per‑metre price (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Base price"
                    value={row.pricePerMeter}
                    onChange={(e) => setVariationRow(row.id, { pricePerMeter: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-stone-600"
                  />
                </div>
                <div className="flex-[2] min-w-[180px] space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-stone-500">Image URL (optional)</Label>
                  <Input
                    placeholder="https://…"
                    value={row.image}
                    onChange={(e) => setVariationRow(row.id, { image: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-stone-600"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-stone-500 hover:text-red-400 shrink-0 mt-7"
                  onClick={() => removeVariationRow(row.id)}
                  aria-label={`Remove colour ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </fieldset>

        {/* ── SEO ── */}
        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-white mb-2 flex items-center justify-between w-full pb-2 border-b border-white/10 gap-2">
            <span>SEO</span>
            <Button type="button" variant="ghost" size="sm" className="text-xs shrink-0 text-stone-400 hover:text-white" onClick={inferSlugFromName}>
              Slug from name
            </Button>
          </legend>
          <div className="space-y-2">
            <Label className="text-stone-300">URL slug</Label>
            <Input value={form.seoSlug} onChange={(e) => setField("seoSlug", e.target.value)} placeholder="handloom-maroon-saree" className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
          </div>
          <div className="space-y-2">
            <Label className="text-stone-300">Meta title</Label>
            <Input
              value={form.seoMetaTitle}
              onChange={(e) => setField("seoMetaTitle", e.target.value)}
              placeholder="Defaults to product name if empty"
              className="bg-white/5 border-white/10 text-white placeholder:text-stone-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-stone-300">Meta description</Label>
            <Textarea
              value={form.seoMetaDescription}
              onChange={(e) => setField("seoMetaDescription", e.target.value)}
              rows={3}
              placeholder="Search snippet — roughly 140–160 characters works well."
              className="bg-white/5 border-white/10 text-white placeholder:text-stone-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-stone-300">Keywords</Label>
            <TagInput
              tags={form.seoKeywords || []}
              onAdd={(v) => addTag("seoKeywords", v)}
              onRemove={(i) => removeTag("seoKeywords", i)}
              placeholder="Type keyword and press Enter…"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-stone-300">SEO Tags</Label>
            <TagInput
              tags={form.seoTags || []}
              onAdd={(v) => addTag("seoTags", v)}
              onRemove={(i) => removeTag("seoTags", i)}
              placeholder="Type tag and press Enter…"
            />
          </div>
        </fieldset>

        {/* ── Tax ── */}
        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-white mb-2 block w-full pb-2 border-b border-white/10">
            Tax
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-stone-300">GST %</Label>
              <Input type="number" min={0} max={28} step="0.01" value={form.taxGstPercent} onChange={(e) => setField("taxGstPercent", e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">HSN code</Label>
              <Input value={form.taxHsnCode} onChange={(e) => setField("taxHsnCode", e.target.value)} placeholder="e.g. 5407" className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-stone-300">Tax amount (₹)</Label>
              <Input type="number" min={0} step="0.01" value={form.taxAmount} onChange={(e) => setField("taxAmount", e.target.value)} placeholder="Auto if empty" className="bg-white/5 border-white/10 text-white placeholder:text-stone-600" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.priceTaxInclusive}
              onChange={(e) => setField("priceTaxInclusive", e.target.checked)}
              className="rounded border-white/20 bg-white/5"
            />
            Shelf price includes GST (tax-inclusive)
          </label>
        </fieldset>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="outline" className="flex-1 border-white/10 text-stone-400 hover:bg-white/10 hover:text-white" asChild>
            <Link to="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" className="flex-1">
            {isNew ? "Create product" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

/* ── Tag Input Component ── */
const TagInput = ({ tags, onAdd, onRemove, placeholder }) => {
  const [text, setText] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (text.trim()) {
        onAdd(text.trim());
        setText("");
      }
    } else if (e.key === "Backspace" && !text && tags.length > 0) {
      onRemove(tags.length - 1);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 items-center min-h-[42px] px-3 py-2 rounded-md border border-white/10 bg-white/5 cursor-text"
      onClick={() => document.getElementById("tag-input-field")?.focus()}
    >
      {tags.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/20 text-primary-foreground text-xs font-medium border border-primary/30">
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(i); }}
            className="hover:text-white/80 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        id="tag-input-field"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white text-sm placeholder:text-stone-600"
      />
    </div>
  );
};

export default AdminProductEditor;
