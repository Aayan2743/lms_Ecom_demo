import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
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
  const isNew = id === "new";
  const navigate = useNavigate();
  const { catalogProducts, categories, addProduct, updateProduct } = useShop();
  const [form, setForm] = useState(emptyFormBase);

  const categoryNames = categories.length ? categories.map((c) => c.name) : ["Sarees", "Kurtas", "Dupattas", "Fabrics"];

  useEffect(() => {
    const first = (categories.length ? categories.map((c) => c.name) : ["Sarees", "Kurtas", "Dupattas", "Fabrics"])[0] || "Sarees";
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

  const submit = (e) => {
    e.preventDefault();

    const colors = form.colorsCsv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const colorHexes = colors.length ? colors : ["#78350f"];

    const variations = form.variationRows
      .filter((r) => r.dimension.trim())
      .map((r) => ({
        dimension: r.dimension.trim(),
        options: r.optionsCsv
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }));

    const slug = form.seoSlug.trim() || slugify(form.name);
    const seo = {
      slug,
      metaTitle: form.seoMetaTitle.trim() || form.name.trim(),
      metaDescription: form.seoMetaDescription.trim(),
      keywords: form.seoKeywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", "),
    };

    const tax = {
      gstPercent: Math.min(28, Math.max(0, Number(form.taxGstPercent) || 0)),
      hsnCode: form.taxHsnCode.trim(),
      priceTaxInclusive: !!form.priceTaxInclusive,
    };

    const affiliate = {
      enabled: !!form.affiliateEnabled,
      commissionPercent: Math.min(100, Math.max(0, Number(form.affiliateCommissionPercent) || 0)),
      network: form.affiliateNetwork.trim(),
      campaignId: form.affiliateCampaignId.trim(),
      referralParam: form.affiliateReferralParam.trim(),
    };

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : Number(form.price),
      category: form.category,
      fabric: form.fabric.trim(),
      stockLeft: Math.max(0, Number(form.stockLeft) || 0),
      badge: form.badge.trim() || undefined,
      image: form.image.trim(),
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      colors: colorHexes,
      variations: variations.length ? variations : undefined,
      seo,
      tax,
      affiliate,
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
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex flex-wrap items-start gap-4">
        <Button type="button" variant="outline" size="icon" asChild className="shrink-0">
          <Link to="/admin/products" aria-label="Back to products">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl text-stone-900">{isNew ? "Add product" : "Edit product"}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {isNew ? "Create a new catalogue item." : `ID ${form.id} · changes save to this browser.`}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-10 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 md:p-8">
        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-stone-900 mb-2 block w-full pb-2 border-b border-stone-100">
            Core
          </legend>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onBlur={() => {
                if (!form.seoSlug.trim() && form.name.trim()) inferSlugFromName();
              }}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input type="number" min={0} step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Compare at (₹)</Label>
              <Input type="number" min={0} step="1" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categoryNames.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Fabric</Label>
              <Input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input type="number" min={0} value={form.stockLeft} onChange={(e) => setForm({ ...form, stockLeft: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. New" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required placeholder="https://…" />
          </div>
          <div className="space-y-2">
            <Label>Swatch hex colours (comma)</Label>
            <Input
              value={form.colorsCsv}
              onChange={(e) => setForm({ ...form, colorsCsv: e.target.value })}
              placeholder="#8B4513, #D4AF37, #1E293B"
            />
            <p className="text-xs text-stone-500">Used on the storefront colour picker.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <Input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Reviews count</Label>
              <Input type="number" min={0} value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-stone-900 mb-2 flex items-center justify-between w-full pb-2 border-b border-stone-100 gap-4">
            <span>Variations</span>
            <Button type="button" variant="outline" size="sm" className="gap-1 shrink-0" onClick={addVariationRow}>
              <Plus className="w-3.5 h-3.5" /> Add axis
            </Button>
          </legend>
          <p className="text-xs text-stone-500 -mt-1">
            Define option dimensions (e.g. <strong>Size</strong> → <span className="font-mono">S, M, L, XL</span>). Axes whose
            name contains &quot;Size&quot; drive the PDP size picker.
          </p>
          <div className="space-y-3">
            {form.variationRows.map((row, idx) => (
              <div key={row.id} className="flex flex-wrap gap-3 items-start p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                <GripVertical className="w-4 h-4 text-stone-300 mt-2.5 shrink-0 hidden sm:block" aria-hidden />
                <div className="flex-1 min-w-[140px] space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-stone-500">Axis name</Label>
                  <Input
                    placeholder="e.g. Size, Dupatta, Stitching"
                    value={row.dimension}
                    onChange={(e) => setVariationRow(row.id, { dimension: e.target.value })}
                  />
                </div>
                <div className="flex-[2] min-w-[200px] space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-stone-500">Options (comma-separated)</Label>
                  <Input
                    placeholder="XS, S, M, L, XL or Maroon, Gold"
                    value={row.optionsCsv}
                    onChange={(e) => setVariationRow(row.id, { optionsCsv: e.target.value })}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-stone-400 hover:text-red-600 shrink-0 mt-7"
                  onClick={() => removeVariationRow(row.id)}
                  aria-label={`Remove variation ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-stone-900 mb-2 flex items-center justify-between w-full pb-2 border-b border-stone-100 gap-2">
            <span>SEO</span>
            <Button type="button" variant="ghost" size="sm" className="text-xs shrink-0" onClick={inferSlugFromName}>
              Slug from name
            </Button>
          </legend>
          <div className="space-y-2">
            <Label>URL slug</Label>
            <Input value={form.seoSlug} onChange={(e) => setForm({ ...form, seoSlug: e.target.value })} placeholder="handloom-maroon-saree" />
          </div>
          <div className="space-y-2">
            <Label>Meta title</Label>
            <Input
              value={form.seoMetaTitle}
              onChange={(e) => setForm({ ...form, seoMetaTitle: e.target.value })}
              placeholder="Defaults to product name if empty"
            />
          </div>
          <div className="space-y-2">
            <Label>Meta description</Label>
            <Textarea
              value={form.seoMetaDescription}
              onChange={(e) => setForm({ ...form, seoMetaDescription: e.target.value })}
              rows={3}
              placeholder="Search snippet — roughly 140–160 characters works well."
            />
          </div>
          <div className="space-y-2">
            <Label>Keywords (comma)</Label>
            <Input
              value={form.seoKeywords}
              onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
              placeholder="silk saree, kanchipuram, wedding wear"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-stone-900 mb-2 block w-full pb-2 border-b border-stone-100">
            Tax
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GST %</Label>
              <Input type="number" min={0} max={28} step="0.01" value={form.taxGstPercent} onChange={(e) => setForm({ ...form, taxGstPercent: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>HSN code</Label>
              <Input value={form.taxHsnCode} onChange={(e) => setForm({ ...form, taxHsnCode: e.target.value })} placeholder="e.g. 5407" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.priceTaxInclusive}
              onChange={(e) => setForm({ ...form, priceTaxInclusive: e.target.checked })}
              className="rounded border-stone-300"
            />
            Shelf price includes GST (tax-inclusive)
          </label>
        </fieldset>

        <fieldset className="space-y-4 border-none p-0 m-0">
          <legend className="font-heading text-base text-stone-900 mb-2 block w-full pb-2 border-b border-stone-100">
            Affiliate marketing
          </legend>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.affiliateEnabled}
              onChange={(e) => setForm({ ...form, affiliateEnabled: e.target.checked })}
              className="rounded border-stone-300"
            />
            Enable affiliate commissioning for this product
          </label>
          <div className={`grid gap-4 sm:grid-cols-2 transition-opacity ${form.affiliateEnabled ? "" : "opacity-40 pointer-events-none"}`}>
            <div className="space-y-2">
              <Label>Commission %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={form.affiliateCommissionPercent}
                onChange={(e) => setForm({ ...form, affiliateCommissionPercent: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Network / programme</Label>
              <Input
                value={form.affiliateNetwork}
                onChange={(e) => setForm({ ...form, affiliateNetwork: e.target.value })}
                placeholder="Impact, CJ, Partnerize, …"
              />
            </div>
            <div className="space-y-2">
              <Label>Campaign ID</Label>
              <Input value={form.affiliateCampaignId} onChange={(e) => setForm({ ...form, affiliateCampaignId: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Referral query / suffix</Label>
              <Input
                value={form.affiliateReferralParam}
                onChange={(e) => setForm({ ...form, affiliateReferralParam: e.target.value })}
                placeholder="?ref=partner&utm_medium=affiliate"
              />
            </div>
          </div>
        </fieldset>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-stone-100">
          <Button type="button" variant="outline" className="flex-1" asChild>
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

export default AdminProductEditor;
