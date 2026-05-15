import React, { useState } from "react";
import { Pencil, Plus, Trash2, X, Tag, ChevronDown, ChevronRight, Layers, FolderTree } from "lucide-react";
import { useShop } from "../../ShopContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminCategories = () => {
  const { categories, catalogProducts, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } = useShop();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingSubId, setEditingSubId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [expanded, setExpanded] = useState({});

  const slugify = (s) =>
    String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const reset = () => {
    setEditingId(null);
    setEditingSubId(null);
    setParentId(null);
    setName("");
    setSlug("");
  };

  const openNewCategory = () => {
    reset();
    setOpen(true);
  };

  const openNewSubcategory = (catId) => {
    reset();
    setParentId(catId);
    setOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingId(cat.id);
    setParentId(null);
    setName(cat.name);
    setSlug(cat.slug);
    setOpen(true);
  };

  const openEditSubcategory = (catId, sub) => {
    setEditingSubId(sub.id);
    setParentId(catId);
    setName(sub.name);
    setSlug(sub.slug);
    setOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    const s = (slug.trim() && slug.trim()) || slugify(n);
    if (!n) return;

    if (editingSubId && parentId) {
      updateSubcategory(parentId, editingSubId, { name: n, slug: s });
    } else if (parentId && !editingId) {
      addSubcategory(parentId, { name: n, slug: s });
    } else if (editingId) {
      updateCategory(editingId, { name: n, slug: s });
    } else {
      addCategory({ name: n, slug: s });
    }
    setOpen(false);
    reset();
  };

  const toggleExpand = (catId) => {
    setExpanded((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const usage = (categoryName) => catalogProducts.filter((p) => p.category === categoryName).length;

  const subUsage = (subName) => catalogProducts.filter((p) => p.subcategory === subName).length;

  const safeDeleteCategory = (cat) => {
    const totalUsage = usage(cat.name) + (cat.children || []).reduce((sum, s) => sum + subUsage(s.name), 0);
    if (totalUsage > 0) {
      window.alert(`Move or delete ${totalUsage} product(s) in "${cat.name}" before removing this category.`);
      return;
    }
    if (window.confirm(`Delete category "${cat.name}" and all its subcategories?`)) deleteCategory(cat.id);
  };

  const safeDeleteSubcategory = (catId, sub) => {
    if (subUsage(sub.name) > 0) {
      window.alert(`Move or delete ${subUsage(sub.name)} product(s) in "${sub.name}" before removing.`);
      return;
    }
    if (window.confirm(`Delete subcategory "${sub.name}"?`)) deleteSubcategory(catId, sub.id);
  };

  const getDialogTitle = () => {
    if (editingSubId) return "Edit subcategory";
    if (parentId && !editingId) return "New subcategory";
    if (editingId) return "Edit category";
    return "New category";
  };

  const getDialogSubtitle = () => {
    if (parentId) {
      const parent = categories.find((c) => c.id === parentId);
      return parent ? `Under: ${parent.name}` : "";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-white">Categories & Subcategories</h1>
          <p className="text-sm text-stone-400 mt-1">
            {categories.length} categories · {categories.reduce((sum, c) => sum + (c.children || []).length, 0)} subcategories
          </p>
        </div>
        <Button onClick={openNewCategory} className="gap-2">
          <Plus className="w-4 h-4" /> Add category
        </Button>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/5">
        {categories.map((cat) => {
          const isExpanded = expanded[cat.id] !== false; // default expanded
          const children = cat.children || [];
          return (
            <div key={cat.id}>
              {/* Parent Category Row */}
              <div className="flex items-center justify-between gap-4 p-5 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => toggleExpand(cat.id)}
                    className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors shrink-0"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <FolderTree className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{cat.name}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      /{cat.slug} · {usage(cat.name)} products · {children.length} subcategories
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openNewSubcategory(cat.id)}
                    className="text-stone-400 hover:text-primary hover:bg-primary/10 gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Sub
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => openEditCategory(cat)} aria-label="Edit" className="text-stone-400 hover:text-white hover:bg-white/10">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="text-stone-400 hover:text-red-400 hover:bg-red-400/10" onClick={() => safeDeleteCategory(cat)} aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Subcategories */}
              {isExpanded && children.length > 0 && (
                <div className="border-t border-white/5 bg-white/[0.02]">
                  {children.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between gap-4 py-3 px-5 pl-16 hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4 text-stone-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-stone-200">{sub.name}</p>
                          <p className="text-xs text-stone-500 mt-0.5">/{sub.slug} · {subUsage(sub.name)} products</p>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button type="button" variant="ghost" size="icon" onClick={() => openEditSubcategory(cat.id, sub)} aria-label="Edit" className="text-stone-400 hover:text-white hover:bg-white/10">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="text-stone-400 hover:text-red-400 hover:bg-red-400/10" onClick={() => safeDeleteSubcategory(cat.id, sub)} aria-label="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isExpanded && children.length === 0 && (
                <div className="border-t border-white/5 bg-white/[0.02] py-4 px-5 pl-16">
                  <p className="text-xs text-stone-600">No subcategories yet. Click "+ Sub" to add one.</p>
                </div>
              )}
            </div>
          );
        })}
        {categories.length === 0 && (
          <p className="p-12 text-center text-stone-500 text-sm">No categories yet. Add your first category to get started.</p>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-stone-900 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-lg text-white">{getDialogTitle()}</h2>
                {getDialogSubtitle() && <p className="text-xs text-stone-500 mt-0.5">{getDialogSubtitle()}</p>}
              </div>
              <button type="button" onClick={() => { setOpen(false); reset(); }} className="p-2 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-stone-300">Display name</Label>
                <Input
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (!editingId && !editingSubId) setSlug(slugify(e.target.value)); }}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-stone-600 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-stone-300">URL slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-stone-600 focus:border-primary"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 border-white/10 text-stone-400 hover:bg-white/10 hover:text-white" onClick={() => { setOpen(false); reset(); }}>Cancel</Button>
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
