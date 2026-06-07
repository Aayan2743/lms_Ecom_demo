import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Plus, Trash2, X, ChevronDown, ChevronRight, Layers,
  FolderTree, Upload, RefreshCw, Pencil, Check, GripVertical,
  Search, AlertTriangle, CheckCircle2, XCircle, Info,
  ImageIcon, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../../api";

/* ─── TOAST ──────────────────────────────────────────────────────────── */
const Toast = ({ toasts, dismiss }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur text-sm max-w-sm border animate-[slideUp_0.3s_ease-out] ${
          t.type === "success" ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-200" :
          t.type === "error" ? "bg-red-900/90 border-red-500/40 text-red-200" :
          "bg-stone-800/90 border-white/10 text-stone-200"
        }`}
      >
        {t.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> :
         t.type === "error" ? <XCircle className="w-4 h-4 shrink-0" /> :
         <Info className="w-4 h-4 shrink-0" />}
        <span className="flex-1">{t.message}</span>
        <button onClick={() => dismiss(t.id)} className="opacity-50 hover:opacity-100 shrink-0"><X className="w-3.5 h-3.5" /></button>
      </div>
    ))}
  </div>
);

/* ─── CONFIRM DIALOG ─────────────────────────────────────────────────── */
const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-stone-900 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full p-6 animate-[scaleIn_0.2s_ease-out]">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-stone-400 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 border-white/10 text-stone-400 hover:bg-white/10 hover:text-white">Cancel</Button>
          <Button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700">Delete</Button>
        </div>
      </div>
    </div>
  );
};

/* ─── SKELETON ───────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white/5 rounded-2xl border border-white/5 p-5 flex items-center gap-4">
        <div className="w-5 h-5 bg-white/10 rounded" />
        <div className="w-11 h-11 bg-white/10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/10 rounded w-1/5" />
        </div>
        <div className="flex gap-1">
          <div className="w-8 h-8 bg-white/10 rounded-lg" />
          <div className="w-8 h-8 bg-white/10 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

/* ─── HELPERS ────────────────────────────────────────────────────────── */
const slugify = (s) =>
  String(s || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const normalizeCat = (c) => ({
  ...c,
  image: Array.isArray(c.image) ? c.image[0] ?? null : c.image ?? null,
});

const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `http://127.0.0.1:8001/${path.replace(/^\/+/, "")}`;
};

const buildTree = (flat) => {
  if (!Array.isArray(flat)) return [];
  const roots = flat.filter((c) => c.parent_id == null).map(normalizeCat);
  const subs = flat.filter((c) => c.parent_id != null).map(normalizeCat);
  const parentMap = new Map(roots.map((r) => [r.id, { ...r, children: [] }]));
  subs.forEach((s) => {
    const p = parentMap.get(s.parent_id);
    if (p) p.children.push(s);
    else parentMap.set(s.id, { ...s, children: [] });
  });
  return Array.from(parentMap.values());
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [parentId, setParentId] = useState("");
  const [desc, setDesc] = useState("");
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const nameRef = useRef(null);

  // expand
  const [expanded, setExpanded] = useState({});
  const [expandAll, setExpandAll] = useState(true);

  // search
  const [search, setSearch] = useState("");

  // toast
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);
  const toast = (msg, type = "info") => {
    const id = ++tid.current;
    setToasts((p) => [...p, { id, message: msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };

  // confirm
  const [confirm, setConfirm] = useState({ open: false, title: "", message: "", onConfirm: null });

  /* ─── FETCH ─────────────────────────────────────────────────── */
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/categories");
      const payload = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
      setCategories(buildTree(Array.isArray(payload) ? payload : []));
    } catch (err) {
      setError(err.response?.data?.message || "Could not load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // focus name when form opens
  useEffect(() => {
    if (formOpen && nameRef.current) setTimeout(() => nameRef.current?.focus(), 100);
  }, [formOpen]);

  /* ─── RESET ─────────────────────────────────────────────────── */
  const resetForm = () => {
    setName(""); setSlug(""); setImage(null); setImagePreview(null);
    setParentId(""); setDesc(""); setEditId(null);
  };

  const openNew = () => {
    resetForm();
    setFormOpen(true);
  };

  /* ─── IMAGE ─────────────────────────────────────────────────── */
  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage(f);
    setImagePreview(URL.createObjectURL(f));
  };

  /* ─── EDIT ──────────────────────────────────────────────────── */
  const editCategory = (cat) => {
    setEditId(cat.id);
    setName(cat.name || "");
    setSlug(cat.slug || slugify(cat.name || ""));
    setParentId(cat.parent_id || "");
    setDesc(cat.desc || cat.description || "");
    setImage(null);
    setImagePreview(cat.image || null);
    setFormOpen(true);
  };

  /* ─── SUBMIT ────────────────────────────────────────────────── */
  const submitCategory = async (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", n);
      fd.append("desc", desc.trim());
      if (parentId) fd.append("parent_id", parentId);
      if (image) fd.append("image", image);

      if (editId) {
        await api.post(`/categories/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast("Category updated", "success");
      } else {
        await api.post("/categories", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast(parentId ? "Subcategory added" : "Category created", "success");
      }
      await fetchCategories();
      resetForm();
      setFormOpen(false);
    } catch (err) {
      toast(err.response?.data?.message || "Save failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── DELETE ────────────────────────────────────────────────── */
  const promptDelete = (cat) => {
    const kids = cat.children || [];
    setConfirm({
      open: true,
      title: `Delete "${cat.name}"?`,
      message: kids.length ? `This will also delete ${kids.length} subcategories. This cannot be undone.` : "This cannot be undone.",
      onConfirm: () => doDelete(cat),
    });
  };

  const doDelete = async (cat) => {
    try {
      for (const s of (cat.children || [])) {
        await api.delete(`/categories/${s.id}`).catch(() => {});
      }
      await api.delete(`/categories/${cat.id}`);
      toast(`"${cat.name}" deleted`, "success");
      await fetchCategories();
    } catch (err) {
      toast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setConfirm({ open: false, title: "", message: "", onConfirm: null });
    }
  };

  /* ─── FILTER ────────────────────────────────────────────────── */
  const filtered = search.trim()
    ? categories.filter((c) => {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) ||
               (c.slug || "").toLowerCase().includes(q) ||
               (c.children || []).some((s) => s.name.toLowerCase().includes(q));
      })
    : categories;

  const counts = categories.reduce((s, c) => s + (c.children || []).length, 0);

  /* ─── RENDER ────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 pb-12">
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes expandIn { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 1000px; } }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-white tracking-tight">Categories</h1>
          <p className="text-sm text-stone-400 mt-0.5 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary/60" />
              {categories.length} categories
            </span>
            <span className="text-stone-600">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-500/40" />
              {counts} subcategories
            </span>
            {loading && <span className="inline-block w-3 h-3 border-2 border-primary/40 border-t-primary rounded-full animate-spin ml-1" />}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={fetchCategories} disabled={loading} className="border-white/10 text-stone-400 hover:bg-white/10 hover:text-white h-9 w-9" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openNew} className="gap-1.5 h-9">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* ═══ TOOLBAR ═══ */}
      <div className="flex flex-wrap items-center gap-3 bg-white/[0.03] rounded-2xl border border-white/5 p-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories…"
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-stone-600 h-9 text-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => { setExpandAll(!expandAll); setExpanded({}); }}
          className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-300 transition-colors px-2 py-1.5"
        >
          {expandAll ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expandAll ? "Collapse all" : "Expand all"}
        </button>
        {search && <span className="text-xs text-stone-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>}
      </div>

      {/* ═══ ERROR ═══ */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-red-300 text-sm font-medium">Failed to load</p>
              <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchCategories} className="border-red-500/30 text-red-400 hover:bg-red-500/10 shrink-0">Retry</Button>
        </div>
      )}

      {/* ═══ LOADING ═══ */}
      {loading && <Skeleton />}

      {/* ═══ LIST ═══ */}
      {!loading && (
        <div className="space-y-3">
          {filtered.map((cat) => {
            const open = expandAll ? (expanded[cat.id] !== false) : !!expanded[cat.id];
            const children = cat.children || [];
            const match = search && cat.name.toLowerCase().includes(search.toLowerCase());

            return (
              <div key={cat.id} className={`bg-white/5 rounded-2xl border transition-all ${match ? "border-primary/30 ring-1 ring-primary/20" : "border-white/10 hover:border-white/[0.15]"}`}>
                {/* parent row */}
                <div className="flex items-center gap-3 px-5 py-4 group">
                  <button
                    onClick={() => setExpanded((p) => ({ ...p, [cat.id]: !(expandAll ? (p[cat.id] !== false) : !!p[cat.id]) }))}
                    className={`p-0.5 rounded-md hover:bg-white/10 text-stone-500 hover:text-white transition-all ${children.length === 0 ? "invisible" : ""}`}
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
                  </button>
                  {children.length === 0 && <span className="w-5" />}

                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 overflow-hidden border border-white/5">
                    {cat.image ? (
                      <img src={imgUrl(cat.image)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FolderTree className="w-5 h-5 text-primary/70" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-white truncate ${match ? "text-primary" : ""}`}>{cat.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                      {cat.slug && <span className="text-[11px] text-stone-500 font-mono">/{cat.slug}</span>}
                      <span className="text-[11px] text-stone-600">{children.length} sub{children.length !== 1 ? "s" : ""}</span>
                      {cat.desc && <span className="text-[11px] text-stone-600 truncate max-w-[200px] hidden sm:inline">{cat.desc}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!editId && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => { setParentId(String(cat.id)); openNew(); }} className="text-stone-400 hover:text-primary hover:bg-primary/10 gap-1 text-xs h-8" title="Add subcategory">
                        <Plus className="w-3.5 h-3.5" /> Sub
                      </Button>
                    )}
                    <Button type="button" variant="ghost" size="icon" onClick={() => editCategory(cat)} className="text-stone-400 hover:text-white hover:bg-white/10 h-8 w-8" title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => promptDelete(cat)} className="text-stone-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* children */}
                {open && children.length > 0 && (
                  <div className="border-t border-white/5 bg-white/[0.015] divide-y divide-white/5" style={{ animation: "expandIn 0.2s ease-out" }}>
                    {children.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-3 py-3 pl-[calc(3rem+24px)] pr-5 group/sub hover:bg-white/[0.03] transition-colors">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 overflow-hidden border border-white/5">
                          {sub.image ? (
                            <img src={imgUrl(sub.image)} alt="" className="w-full h-full object-cover rounded-md" />
                          ) : (
                            <Layers className="w-3.5 h-3.5 text-stone-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-stone-200 truncate">{sub.name}</p>
                          {sub.slug && <span className="text-[11px] text-stone-600 font-mono">/{sub.slug}</span>}
                        </div>
                        <div className="flex gap-0.5 shrink-0 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                          <Button type="button" variant="ghost" size="icon" onClick={() => editCategory(sub)} className="text-stone-400 hover:text-white hover:bg-white/10 h-7 w-7" title="Edit">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" onClick={() => promptDelete(sub)} className="text-stone-400 hover:text-red-400 hover:bg-red-400/10 h-7 w-7" title="Delete">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {open && children.length === 0 && !search && (
                  <div className="border-t border-white/5 bg-white/[0.015] py-3 px-5 pl-[calc(3rem+24px)] text-xs text-stone-600">
                    No subcategories. Click "+ Sub" to add one.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ EMPTY ═══ */}
      {!loading && !error && categories.length === 0 && (
        <div className="bg-white/5 rounded-2xl border border-white/10 border-dashed p-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <FolderTree className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-lg font-heading text-white mb-2">No categories yet</h3>
          <p className="text-stone-400 text-sm mb-6 max-w-sm mx-auto">Create categories to organize your products. Add subcategories for finer grouping.</p>
          <Button onClick={openNew} className="gap-1.5" size="lg">
            <Plus className="w-4 h-4" /> Create your first category
          </Button>
        </div>
      )}

      {!loading && !error && categories.length > 0 && filtered.length === 0 && (
        <div className="bg-white/5 rounded-2xl border border-white/10 border-dashed p-16 text-center">
          <Search className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <p className="text-stone-400 font-medium">No results for "{search}"</p>
          <p className="text-stone-600 text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {/* ═══ FORM MODAL ═══ */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" style={{ animation: "scaleIn 0.15s ease-out" }}>
          <div className="bg-stone-900 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full p-0 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="font-heading text-lg text-white">
                  {editId ? (parentId ? "Edit Subcategory" : "Edit Category") : (parentId ? "New Subcategory" : "New Category")}
                </h2>
                {parentId && (
                  <p className="text-xs text-stone-500 mt-0.5">
                    Under: <span className="text-stone-300 font-medium">{categories.find((c) => c.id === Number(parentId) || String(c.id) === parentId)?.name || "—"}</span>
                  </p>
                )}
              </div>
              <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitCategory} className="px-6 pb-6 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <Label className="text-stone-300 text-sm font-medium">Name <span className="text-red-400">*</span></Label>
                <Input
                  ref={nameRef}
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (!editId) setSlug(slugify(e.target.value)); }}
                  required
                  placeholder="e.g. Summer Collection"
                  className="bg-white/5 border-white/10 text-white placeholder:text-stone-600 focus:border-primary h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-stone-300 text-sm font-medium">Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="summer-collection"
                  className="bg-white/5 border-white/10 text-white placeholder:text-stone-600 focus:border-primary h-10 font-mono text-sm"
                />
                <p className="text-[11px] text-stone-600">Auto-generated from name. You can edit it.</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-stone-300 text-sm font-medium">Description</Label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Brief description…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-stone-600 focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-stone-300 text-sm font-medium">Parent Category</Label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary focus:outline-none [&>option]:bg-stone-800 [&>option]:text-white"
                >
                  <option value="">None (root category)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-stone-300 text-sm font-medium">Image</Label>
                {imagePreview ? (
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-stone-400">Preview</p>
                      <div className="flex gap-2">
                        <label className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 text-stone-300 rounded-lg px-3 py-1.5 text-xs transition-colors inline-block">
                          Change
                          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                        </label>
                        <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="text-xs text-stone-500 hover:text-red-400 transition-colors">Remove</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer bg-white/5 border border-dashed border-white/10 hover:border-white/20 hover:bg-white/[0.07] rounded-xl p-6 text-center transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-stone-500" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-400 font-medium">Click to upload</p>
                      <p className="text-xs text-stone-600 mt-0.5">SVG, PNG, JPG or WebP</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" className="flex-1 border-white/10 text-stone-400 hover:bg-white/10 hover:text-white h-10" onClick={() => { setFormOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit" className="flex-1 h-10" disabled={submitting || !name.trim()}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </span>
                  ) : editId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast toasts={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
      <ConfirmDialog {...confirm} onCancel={() => setConfirm({ open: false, title: "", message: "", onConfirm: null })} />
    </div>
  );
};

export default AdminCategories;