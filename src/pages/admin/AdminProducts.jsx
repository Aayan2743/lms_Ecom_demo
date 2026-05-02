import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useShop } from "../../ShopContext.jsx";
import { Button } from "@/components/ui/button";

const AdminProducts = () => {
  const { catalogProducts, deleteProduct } = useShop();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-stone-900">Products</h1>
          <p className="text-sm text-stone-500 mt-1">
            Add or edit items on dedicated pages — data stays in this browser&apos;s storage.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/products/new">
            <Plus className="w-4 h-4" /> Add product
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left border-b border-stone-200">
                <th className="py-3 px-4 font-medium text-stone-600">Product</th>
                <th className="py-3 px-4 font-medium text-stone-600">Extras</th>
                <th className="py-3 px-4 font-medium text-stone-600">Category</th>
                <th className="py-3 px-4 font-medium text-stone-600">Price</th>
                <th className="py-3 px-4 font-medium text-stone-600">Stock</th>
                <th className="py-3 px-4 font-medium text-stone-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {catalogProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/80">
                  <td className="py-3 px-4 align-top">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-12 h-14 object-cover rounded-lg bg-stone-100 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-medium text-stone-800 line-clamp-2 max-w-[200px]">{p.name}</span>
                        {p.seo?.slug && (
                          <p className="text-[10px] text-stone-400 truncate max-w-[200px] mt-0.5">/{p.seo.slug}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 align-top text-[10px] text-stone-500 space-y-0.5 max-w-[140px]">
                    {p.variations?.length > 0 && <p>{p.variations.length} variation axis</p>}
                    {p.tax?.gstPercent != null && <p>GST {p.tax.gstPercent}%</p>}
                    {p.affiliate?.enabled && (
                      <p className="text-primary font-medium">{p.affiliate.commissionPercent}% affiliate</p>
                    )}
                    {!p.variations?.length && p.tax?.gstPercent == null && !p.affiliate?.enabled && (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-stone-600">{p.category}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    ₹{p.price?.toLocaleString("en-IN")}
                    {p.oldPrice && p.oldPrice > p.price && (
                      <span className="text-xs text-stone-400 line-through ml-2">₹{p.oldPrice.toLocaleString("en-IN")}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{p.stockLeft}</td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <Button type="button" variant="ghost" size="icon" asChild aria-label="Edit">
                      <Link to={`/admin/products/${p.id}/edit`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => deleteProduct(p.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
