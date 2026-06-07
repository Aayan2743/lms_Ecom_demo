import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Crown, Truck, RefreshCw, Scissors, Loader2, AlertCircle } from "lucide-react";
import api from "../api.js";

const Categories = () => {
  const [parentCategories, setParentCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  // ─── Fetch categories from backend ──────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        const res = await api.get("/categories");
        const body = res.data;

        if (!body.status || !Array.isArray(body.data)) {
          if (!cancelled) setError("Unexpected API response");
          return;
        }

        const all = body.data;

        // Split into parent categories (parent_id = 0 or null) and subcategories
        const parents = all
          .filter((c) => !c.parent_id)
          .map((c) => ({
            id: c.id,
            name: c.name,
            desc: c.desc || "",
            link: `/shop?category=${encodeURIComponent(c.name)}`,
            image: Array.isArray(c.image) && c.image[0]
              ? c.image[0]
              : "https://i.pinimg.com/736x/56/14/81/561481cdf44e31905ab2760bbd033202.jpg",
            tag: "Explore",
            rating: 4.8,
            items: null,
            badge: null,
          }));

        const subs = all
          .filter((c) => c.parent_id)
          .map((c) => ({
            id: c.id,
            parent_id: c.parent_id,
            name: c.name,
            desc: c.desc || "",
            link: `/shop?subcategory=${encodeURIComponent(c.name)}`,
            image: Array.isArray(c.image) && c.image[0]
              ? c.image[0]
              : "https://i.pinimg.com/1200x/3e/94/bf/3e94bfa75c58740cdae2975e9ff98e81.jpg",
          }));

        if (!cancelled) {
          setParentCategories(parents);
          setSubCategories(subs);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load categories";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  // ─── Trust badges (static) ──────────────────────────────────────
  const trustBadges = [
    { icon: Truck, title: "Free Shipping", desc: "Above ₹999" },
    { icon: RefreshCw, title: "Easy Returns", desc: "7 Day Policy" },
    { icon: Scissors, title: "Custom Cuts", desc: "As Per Need" },
    { icon: Crown, title: "Premium Quality", desc: "100% Guaranteed" },
  ];

  // ─── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-stone-500 text-sm">Loading categories…</p>
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-heading text-stone-800 mb-2">Failed to Load</h2>
          <p className="text-stone-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Empty state ────────────────────────────────────────────────
  if (parentCategories.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 to-white">
        {/* Hero */}
        <div className="relative bg-stone-900 text-white py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">Explore</span>
            <h1 className="font-heading text-3xl md:text-5xl mt-3 mb-4">Fabric Categories</h1>
            <p className="text-stone-400 max-w-2xl mx-auto text-sm md:text-base">No categories available yet. Check back soon.</p>
          </div>
        </div>
        {/* Trust Badges */}
        <div className="container mx-auto px-4 py-10 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 text-center shadow-md border border-stone-100 hover:shadow-lg transition-all">
                <badge.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-stone-800 text-sm">{badge.title}</h4>
                <p className="text-xs text-stone-500 mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 to-white">
      
      {/* Hero */}
      <div className="relative bg-stone-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">Explore</span>
          <h1 className="font-heading text-3xl md:text-5xl mt-3 mb-4">Fabric Categories</h1>
          <p className="text-stone-400 max-w-2xl mx-auto text-sm md:text-base">Discover our extensive collection of premium fabrics. From luxurious silks to breathable cottons, find the perfect fabric for every occasion.</p>
        </div>
      </div>

      {/* Main Categories (from API: parent_id = 0) */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parentCategories.map((cat, idx) => (
            <Link 
              key={cat.id} 
              to={cat.link} 
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-bold px-3 py-1 rounded-full">{cat.tag}</span>
                {cat.badge && <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{cat.badge}</span>}
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl text-stone-800 mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-stone-500 text-sm mb-3">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-semibold text-stone-700">{cat.rating}</span>
                    {cat.items && <span className="text-xs text-stone-400">({cat.items} items)</span>}
                  </div>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Explore <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Subcategories (from API: parent_id > 0) */}
      {subCategories.length > 0 && (
        <div className="container mx-auto px-4 pt-10 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">Curated</span>
              <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mt-1">Subcategories</h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-2 text-primary text-sm font-semibold hover:text-primary/80 transition-colors">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            {subCategories.map((sub) => (
              <Link key={sub.id} to={sub.link} className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] aspect-[16/10] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <img src={sub.image} alt={sub.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-heading text-xl font-bold">{sub.name}</h3>
                  <p className="text-white/60 text-sm">{sub.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="container mx-auto px-4 py-10 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 text-center shadow-md border border-stone-100 hover:shadow-lg transition-all">
              <badge.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-stone-800 text-sm">{badge.title}</h4>
              <p className="text-xs text-stone-500 mt-1">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}} />
    </div>
  );
};

export default Categories;