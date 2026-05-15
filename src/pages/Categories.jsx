import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Heart, Eye, Star, Crown, Gem, Truck, RefreshCw, Scissors, Calendar, Tag } from "lucide-react";

const categoriesData = [
  { 
    name: "Premium Silk Fabrics", 
    desc: "Kanchipuram, Banarasi & Handlooms", 
    link: "/silk-fabrics?category=Silk",
    image: "https://i.pinimg.com/736x/56/14/81/561481cdf44e31905ab2760bbd033202.jpg",
    tag: "Bestseller",
    rating: 4.9,
    items: 245,
    badge: "New Arrivals"
  },
  { 
    name: "Handloom Cotton Fabrics", 
    desc: "Ikat, Kalamkari & Block Prints", 
    link: "/cotton-fabrics?category=Kalamkari",
    image: "https://i.pinimg.com/1200x/5c/ba/ae/5cbaaec476c9984024ed212a5138b74d.jpg",
    tag: "Trending",
    rating: 4.8,
    items: 189,
    badge: "Handcrafted"
  },
  { 
    name: "Premium Linen Fabrics", 
    desc: "Pure Linen & Belgian Linen Blends", 
    link: "/linen-fabrics?category=Linen",
    image: "https://i.pinimg.com/736x/d9/f4/cb/d9f4cb9581dbe49b1c47ce1f223655f8.jpg",
    tag: "Popular",
    rating: 4.7,
    items: 312,
    badge: "Designer"
  },
  { 
    name: "Organza Fabrics", 
    desc: "Sheer, Embroidered & Printed Organza", 
    link: "/organza-fabrics?category=Organza",
    image: "https://i.pinimg.com/736x/59/11/80/591180632783e4ac10876b05e2b3e3bb.jpg",
    tag: "Limited",
    rating: 4.9,
    items: 156,
    badge: "Exclusive"
  },
  { 
    name: "Georgette Fabrics", 
    desc: "Lightweight & flowy georgette fabrics", 
    link: "/georgette-fabrics", 
    image: "https://i.pinimg.com/736x/62/72/ea/6272ea7225c912087f2c5b1c235a03ea.jpg",
    tag: "Custom",
    rating: 5.0,
    items: null,
    badge: "Made to Order"
  }
];

const featuredCollections = [
  { name: "Wedding Fabrics", image: "https://i.pinimg.com/736x/4f/0c/79/4f0c799c67e8be10b14ad150b54f53b4.jpg", count: 128, link: "/silk-fabrics" },
  { name: "Festival Picks", image: "https://i.pinimg.com/1200x/3e/94/bf/3e94bfa75c58740cdae2975e9ff98e81.jpg", count: 96, link: "/cotton-fabrics" },
  { name: "Party Wear Fabrics", image: "https://i.pinimg.com/736x/14/02/1e/14021e3b777b8e3215fc52b3fb5e80cd.jpg", count: 84, link: "/organza-fabrics" },
  { name: "Daily Elegance", image: "https://i.pinimg.com/1200x/c1/70/8c/c1708cb21db4bcc9f47b7d696a3686a6.jpg", count: 156, link: "/cotton-fabrics" },
];

const trendingNow = [
  { name: "Banarasi Silk", image: "https://i.pinimg.com/736x/4f/0c/79/4f0c799c67e8be10b14ad150b54f53b4.jpg", soldOut: false, discount: "15% OFF", link: "/silk-fabrics" },
  { name: "Kalamkari Cotton", image: "https://i.pinimg.com/736x/38/de/80/38de8036daff2e913e5769671989e6ad.jpg", soldOut: false, discount: "20% OFF", link: "/cotton-fabrics" },
  { name: "Organza Fabric", image: "https://i.pinimg.com/736x/59/11/80/591180632783e4ac10876b05e2b3e3bb.jpg", soldOut: true, discount: null, link: "/organza-fabrics" },
  { name: "Block Print Cotton", image: "https://i.pinimg.com/1200x/c1/70/8c/c1708cb21db4bcc9f47b7d696a3686a6.jpg", soldOut: false, discount: "10% OFF", link: "/cotton-fabrics" },
];

const Categories = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

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

      {/* Main Categories */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((cat, idx) => (
            <Link 
              key={idx} 
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

      {/* Featured Collections */}
      <div className="container mx-auto px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">Curated</span>
            <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mt-1">Featured Collections</h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-2 text-primary text-sm font-semibold hover:text-primary/80 transition-colors">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {featuredCollections.map((collection, idx) => (
            <Link key={idx} to={collection.link} className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] aspect-[16/10] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-heading text-xl font-bold">{collection.name}</h3>
                <p className="text-white/60 text-sm">{collection.count}+ fabrics</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Now */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold">Hot Picks</span>
            <h2 className="font-heading text-2xl md:text-3xl text-stone-800 mt-1">Trending Now</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingNow.map((item, idx) => (
            <Link key={idx} to={item.link} className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              {item.soldOut && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-white text-stone-800 text-xs font-bold px-4 py-2 rounded-full">Sold Out</span></div>}
              {item.discount && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">{item.discount}</span>}
              <div className="p-3">
                <h4 className="font-semibold text-stone-800 text-sm">{item.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="container mx-auto px-4 py-10 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Free Shipping", desc: "Above ₹999" },
            { icon: RefreshCw, title: "Easy Returns", desc: "7 Day Policy" },
            { icon: Scissors, title: "Custom Cuts", desc: "As Per Need" },
            { icon: Crown, title: "Premium Quality", desc: "100% Guaranteed" }
          ].map((badge, idx) => (
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