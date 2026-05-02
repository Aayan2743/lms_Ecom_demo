import React, { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useShop } from "../../ShopContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminCategories = () => {
  const { categories, catalogProducts, addCategory, updateCategory, deleteCategory } = useShop();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const slugify = (s) =>
    String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const reset = () => {
    setEditingId(null);
    setName("");
    setSlug("");
  };

  const openNew = () => {
    reset();
    setOpen(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    const s = (slug.trim() && slug.trim()) || slugify(n);
    if (!n) return;
    if (editingId) updateCategory(editingId, { name: n, slug: s });
    else addCategory({ name: n, slug: s });
    setOpen(false);
    reset();
  };

  const usage = (categoryName) => catalogProducts.filter((p) => p.category === categoryName).length;

  const safeDelete = (cat) => {
    if (usage(cat.name) > 0) {
      window.alert(`Move or delete ${usage(cat.name)} product(s) in “${cat.name}” before removing this category.`);
      return;
    }
    if (window.confirm(`Delete category “${cat.name}”?`)) deleteCategory(cat.id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-stone-900">Categories</h1>
          <p className="text-sm text-stone-500 mt-1">Used for shop filters and product assignment.</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Add category
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm divide-y divide-stone-100">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium text-stone-900">{c.name}</p>
              <p className="text-xs text-stone-500 mt-0.5">/{c.slug} · {usage(c.name)} products</p>
            </div>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="icon" onClick={() => openEdit(c)} aria-label="Edit">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="text-red-600" onClick={() => safeDelete(c)} aria-label="Delete">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="p-12 text-center text-stone-500 text-sm">No categories yet.</p>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg">{editingId ? "Edit category" : "New category"}</h2>
              <button type="button" onClick={() => { setOpen(false); reset(); }} className="p-2 rounded-lg hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>Display name</Label>
                <Input value={name} onChange={(e) => { setName(e.target.value); if (!editingId) setSlug(slugify(e.target.value)); }} required />
              </div>
              <div className="space-y-2">
                <Label>URL slug</Label>
                <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} required />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setOpen(false); reset(); }}>Cancel</Button>
                <Button type="submit" className="flex-1">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
