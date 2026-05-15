import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2, Image } from "lucide-react";
import { useShop } from "../../ShopContext.jsx";
import { Button } from "@/components/ui/button";

const AdminProducts = () => {
  const { catalogProducts, deleteProduct } = useShop();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-white">Products</h1>
          <p className="text-sm text-stone-400 mt-1">
            {catalogProducts.length} products listed — add or edit items below.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/products/new">
            <Plus className="w-4 h-4" /> Add product
          </Link>
        </Button>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-left border-b border-white/5">
                <th className="py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider">Product</th>
                <th className="py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider hidden md:table-cell">Extras</th>
                <th className="py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider">Price</th>
                <th className="py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider">Stock</th>
                <th className="py-3 px-4 font-medium text-stone-400 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {catalogProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4 align-top">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt="" className="w-12 h-14 object-cover rounded-lg bg-white/5 shrink-0" />
                      ) : (
                        <div className="w-12 h-14 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <Image className="w-5 h-5 text-stone-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-medium text-stone-200 line-clamp-2 max-w-[200px]">{p.name}</span>
                        {p.seo?.slug && (
                          <p className="text-[10px] text-stone-500 truncate max-w-[200px] mt-0.5">/{p.seo.slug}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 align-top text-[10px] text-stone-500 space-y-0.5 max-w-[140px] hidden md:table-cell">
                    {p.variations?.length > 0 && <p>{p.variations.length} variation axis</p>}
                    {p.tax?.gstPercent != null && <p>GST {p.tax.gstPercent}%</p>}
                    {!p.variations?.length && p.tax?.gstPercent == null && (
                      <span className="text-stone-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-stone-400 text-xs">{p.category}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-stone-200">₹{p.price?.toLocaleString("en-IN")}</span>
                    {p.oldPrice && p.oldPrice > p.price && (
                      <span className="text-xs text-stone-500 line-through ml-2">₹{p.oldPrice.toLocaleString("en-IN")}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${p.stockLeft <= 3 ? "text-red-400" : "text-stone-300"}`}>
                      {p.stockLeft}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <Button type="button" variant="ghost" size="icon" asChild aria-label="Edit" className="text-stone-400 hover:text-white hover:bg-white/10">
                      <Link to={`/admin/products/${p.id}/edit`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-stone-400 hover:text-red-400 hover:bg-red-400/10"
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
        {catalogProducts.length === 0 && (
          <p className="p-12 text-center text-stone-500 text-sm">No products yet. Add your first product to get started.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
