import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ShoppingCart, Heart, Star, Truck, RefreshCcw, Minus, Plus, 
  ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight,
  Zap, Info, ChevronDown, ChevronUp, Droplet, Maximize2, 
  AlertCircle, Shield, WashingMachine, Sun, Thermometer, Share2
} from "lucide-react";
import { useShop } from "../ShopContext.jsx"; 

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const allProductsDatabase = [
  // ── Silk Fabrics ──
  { id: 1001, name: "Pure Kanchipuram Silk Fabric", price: 2499, originalPrice: 3499, category: "Silk Fabrics", images: [product1, "https://i.pinimg.com/736x/5d/0c/3e/5d0c3eecd96738b38dc3a31d01b04eab.jpg", "https://i.pinimg.com/736x/33/e2/04/33e20454ff3d260337ac462bba1958b3.jpg"], desc: "Experience the luxury of our handwoven Pure Kanchipuram Silk Fabric. Known for its rich texture and vibrant zari borders, this fabric is perfect for wedding lehengas, sarees, and traditional wear. Price per meter.", rating: 4.9, reviews: 156, stockLeft: 5, colors: ["#8B0000", "#C41E3A", "#FFD700"], fabric: "Pure Silk", width: "44 inches", weight: "120 GSM" },
  { id: 1002, name: "Banarasi Silk Brocade Fabric", price: 3499, originalPrice: 4999, category: "Silk Fabrics", images: [product4, "https://i.pinimg.com/736x/4f/0c/79/4f0c799c67e8be10b14ad150b54f53b4.jpg"], desc: "Exquisite Banarasi silk brocade with intricate zari work. Woven by master artisans in Varanasi, this fabric features traditional Mughal-inspired motifs. Ideal for bridal lehengas and festive wear. Price per meter.", rating: 4.7, reviews: 89, stockLeft: 12, colors: ["#FF1493", "#FFD700", "#C0C0C0"], fabric: "Banarasi Silk", width: "44 inches", weight: "180 GSM" },
  { id: 1003, name: "Raw Silk Printed Fabric", price: 2100, originalPrice: 2800, category: "Silk Fabrics", images: [product5, "https://i.pinimg.com/736x/14/02/1e/14021e3b777b8e3215fc52b3fb5e80cd.jpg"], desc: "Premium raw silk fabric with elegant digital prints. The natural slub texture of raw silk combined with contemporary designs makes it perfect for designer blouses, dresses, and fusion wear. Price per meter.", rating: 4.7, reviews: 92, stockLeft: 7, colors: ["#FF69B4", "#FFC0CB"], fabric: "Raw Silk", width: "44 inches", weight: "100 GSM" },
  { id: 1004, name: "Tussar Silk Fabric", price: 1899, originalPrice: 2599, category: "Silk Fabrics", images: [product2, "https://i.pinimg.com/736x/c0/ff/35/c0ff355a86cc81c4382a00c33e9379d4.jpg"], desc: "Naturally textured Tussar silk fabric with a beautiful golden sheen. Also known as Kosa silk, this eco-friendly fabric is lightweight yet durable. Perfect for sarees, kurtas, and ethnic jackets. Price per meter.", rating: 4.6, reviews: 67, stockLeft: 3, colors: ["#F5F5DC", "#FFF8DC", "#FAEBD7"], fabric: "Tussar Silk", width: "44 inches", weight: "90 GSM" },
  // ── Cotton Fabrics ──
  { id: 2001, name: "Handloom Cotton Fabric", price: 899, originalPrice: 1299, category: "Cotton Fabrics", images: [product2, "https://i.pinimg.com/736x/e3/7b/08/e37b08dbad8a6d08a7fdd68172f82101.jpg"], desc: "Soft and breathable handloom cotton fabric woven by skilled artisans. The natural fibers make it perfect for kurtas, shirts, and summer wear. Each meter tells a story of traditional craftsmanship. Price per meter.", rating: 4.8, reviews: 234, stockLeft: 15, colors: ["#1E3A8A", "#DC2626", "#EA580C"], fabric: "Handloom Cotton", width: "46 inches", weight: "90 GSM" },
  { id: 2002, name: "Ikat Handwoven Cotton Fabric", price: 1299, originalPrice: 1799, category: "Cotton Fabrics", images: [product3, "https://i.pinimg.com/1200x/b3/46/dc/b346dca6fb0cbcd99a4589c162621ef3.jpg"], desc: "Authentic Ikat handwoven cotton fabric featuring the distinctive blurred-edge patterns created through the resist-dye technique. Perfect for statement kurtas, dresses, and home decor. Price per meter.", rating: 4.8, reviews: 78, stockLeft: 6, colors: ["#DC2626", "#EA580C", "#CA8A04"], fabric: "Cotton", width: "46 inches", weight: "95 GSM" },
  { id: 2003, name: "Kalamkari Print Cotton Fabric", price: 999, originalPrice: 1499, category: "Cotton Fabrics", images: [product8, "https://i.pinimg.com/736x/38/de/80/38de8036daff2e913e5769671989e6ad.jpg"], desc: "Traditional hand-painted Kalamkari cotton fabric from Andhra Pradesh. Each piece features intricate mythological and nature-inspired artwork created using natural dyes. A true work of art. Price per meter.", rating: 4.8, reviews: 189, stockLeft: 6, colors: ["#2F4F4F", "#8B4513"], fabric: "Kalamkari Cotton", width: "44 inches", weight: "100 GSM" },
  { id: 2004, name: "Indigo Block Print Fabric", price: 850, originalPrice: 1200, category: "Cotton Fabrics", images: [product7, "https://i.pinimg.com/1200x/c1/70/8c/c1708cb21db4bcc9f47b7d696a3686a6.jpg"], desc: "Hand-block printed cotton fabric using natural indigo dyes. The deep blue hues and geometric patterns are created by skilled artisans using carved wooden blocks. Perfect for boho-chic outfits. Price per meter.", rating: 4.6, reviews: 156, stockLeft: 12, colors: ["#1E3A8A", "#FFFFFF"], fabric: "Cotton", width: "44 inches", weight: "85 GSM" },
  { id: 9001, name: "Chanderi Handloom Fabric", price: 1550, originalPrice: 2000, category: "Cotton Fabrics", images: [product1, "https://i.pinimg.com/1200x/92/f6/f0/92f6f021e1a8351e7f3d6be1d8bab38d.jpg"], desc: "Luxurious Chanderi handloom fabric blending cotton and silk for a lightweight, sheer texture with a subtle sheen. Traditional buttis and zari motifs make it ideal for elegant sarees and dupattas. Price per meter.", rating: 4.9, reviews: 78, stockLeft: 4, colors: ["#F5F5DC", "#FFF8DC"], fabric: "Chanderi Cotton", width: "46 inches", weight: "70 GSM" },
  { id: 9002, name: "Phulkari Embroidered Fabric", price: 1800, originalPrice: 2500, category: "Cotton Fabrics", images: [product5, "https://i.pinimg.com/1200x/3e/94/bf/3e94bfa75c58740cdae2975e9ff98e81.jpg"], desc: "Vibrant Phulkari embroidered cotton fabric from Punjab. The colorful silk thread embroidery on handwoven cotton creates stunning floral patterns. Perfect for dupattas, jackets, and statement pieces. Price per meter.", rating: 4.8, reviews: 134, stockLeft: 3, colors: ["#DC2626", "#EA580C"], fabric: "Cotton", width: "46 inches", weight: "110 GSM" },
  { id: 9003, name: "Chikankari Embroidered Fabric", price: 2200, originalPrice: 3200, category: "Cotton Fabrics", images: [product6, "https://i.pinimg.com/1200x/5c/ba/ae/5cbaaec476c9984024ed212a5138b74d.jpg"], desc: "Exquisite Chikankari hand-embroidered fabric from Lucknow. Delicate white-on-white thread work on fine cotton creates an ethereal, timeless elegance. Perfect for kurtas, sarees, and luxury apparel. Price per meter.", rating: 5.0, reviews: 45, stockLeft: 5, colors: ["#FFFFFF", "#FDF5E6"], fabric: "Cotton", width: "44 inches", weight: "95 GSM" },
  // ── Linen Fabrics ──
  { id: 3001, name: "Premium Linen Fabric", price: 1599, originalPrice: 2199, category: "Linen Fabrics", images: [product3, "https://i.pinimg.com/736x/d9/f4/cb/d9f4cb9581dbe49b1c47ce1f223655f8.jpg"], desc: "Premium quality pure linen fabric with a natural texture and beautiful drape. Breathable and moisture-wicking, it's perfect for suits, jackets, and elegant home decor. Price per meter.", rating: 4.9, reviews: 94, stockLeft: 4, colors: ["#556B2F", "#6B8E23", "#808000"], fabric: "Pure Linen", width: "54 inches", weight: "150 GSM" },
  { id: 3002, name: "Belgian Linen Blend Fabric", price: 1899, originalPrice: 2499, category: "Linen Fabrics", images: [product6, "https://i.pinimg.com/736x/25/09/4e/25094edff0359cada153734742efc860.jpg"], desc: "Luxurious Belgian linen blend fabric offering the perfect balance of texture and softness. The superior long-staple fibers ensure minimal wrinkling and maximum durability. Price per meter.", rating: 4.7, reviews: 56, stockLeft: 9, colors: ["#FFF5EE", "#FFE4E1", "#E6E6FA"], fabric: "Linen Blend", width: "54 inches", weight: "160 GSM" },
  // ── Georgette Fabrics ──
  { id: 4001, name: "Georgette Fabric", price: 699, originalPrice: 999, category: "Georgette Fabrics", images: [product7, "https://i.pinimg.com/736x/62/72/ea/6272ea7225c912087f2c5b1c235a03ea.jpg"], desc: "Lightweight and flowy georgette fabric with a beautiful crinkled texture. Its excellent drape makes it a favorite for sarees, gowns, and evening wear. Price per meter.", rating: 4.5, reviews: 45, stockLeft: 20, colors: ["#FF69B4", "#FFB6C1", "#FFC0CB"], fabric: "Georgette", width: "44 inches", weight: "60 GSM" },
  { id: 4002, name: "Printed Georgette Fabric", price: 899, originalPrice: 1299, category: "Georgette Fabrics", images: [product8, "https://i.pinimg.com/1200x/15/5a/31/155a3159151b2b6b4c7d08c37d80a7fa.jpg"], desc: "Beautifully printed georgette fabric featuring vibrant digital designs. The lightweight nature combined with stunning prints makes it ideal for designer sarees, lehengas, and fusion wear. Price per meter.", rating: 4.6, reviews: 67, stockLeft: 14, colors: ["#8B0000", "#A0522D", "#D2691E"], fabric: "Georgette", width: "44 inches", weight: "60 GSM" },
  // ── Organza Fabrics ──
  { id: 5001, name: "Organza Fabric", price: 1199, originalPrice: 1699, category: "Organza Fabrics", images: [product4, "https://i.pinimg.com/736x/59/11/80/591180632783e4ac10876b05e2b3e3bb.jpg"], desc: "Sheer and crisp organza fabric with a luxurious finish. This heritage fabric holds its shape beautifully, making it perfect for overlays, dupattas, and decorative accents. Price per meter.", rating: 4.9, reviews: 123, stockLeft: 2, colors: ["#C41E3A", "#FFD700", "#D4AF37"], fabric: "Organza", width: "44 inches", weight: "40 GSM" },
  { id: 5002, name: "Embroidered Organza Fabric", price: 1599, originalPrice: 2299, category: "Organza Fabrics", images: [product1, "https://i.pinimg.com/1200x/92/f6/f0/92f6f021e1a8351e7f3d6be1d8bab38d.jpg"], desc: "Exquisite embroidered organza fabric featuring delicate thread work on a sheer base. The combination of transparency and intricate embroidery creates a stunning visual effect. Price per meter.", rating: 4.8, reviews: 88, stockLeft: 5, colors: ["#F5F5DC", "#FFF8DC"], fabric: "Organza", width: "44 inches", weight: "45 GSM" },
  // ── Chiffon Fabrics ──
  { id: 6001, name: "Chiffon Fabric", price: 599, originalPrice: 899, category: "Chiffon Fabrics", images: [product5, "https://i.pinimg.com/1200x/3e/94/bf/3e94bfa75c58740cdae2975e9ff98e81.jpg"], desc: "Ultra-lightweight chiffon fabric with a soft, flowing drape. Its ethereal quality makes it a top choice for evening gowns, scarves, and layered outfits. Price per meter.", rating: 4.5, reviews: 134, stockLeft: 18, colors: ["#DC2626", "#EA580C"], fabric: "Chiffon", width: "44 inches", weight: "35 GSM" },
  { id: 6002, name: "Printed Chiffon Fabric", price: 799, originalPrice: 1199, category: "Chiffon Fabrics", images: [product2, "https://i.pinimg.com/1200x/5c/ba/ae/5cbaaec476c9984024ed212a5138b74d.jpg"], desc: "Digitally printed chiffon fabric with vibrant, fade-resistant designs. The lightweight, airy texture combined with stunning prints makes it perfect for summer sarees and dresses. Price per meter.", rating: 4.6, reviews: 45, stockLeft: 11, colors: ["#FFFFFF", "#FDF5E6"], fabric: "Chiffon", width: "44 inches", weight: "35 GSM" },
  // ── Velvet Fabrics ──
  { id: 7001, name: "Velvet Fabric", price: 1299, originalPrice: 1799, category: "Velvet Fabrics", images: [product6, "https://i.pinimg.com/736x/8e/05/35/8e0535a0e8e424c5d1be77fea1235fda.jpg"], desc: "Luxuriously soft velvet fabric with a rich, plush texture and beautiful depth of color. Perfect for winter lehengas, blazers, upholstery, and statement fashion pieces. Price per meter.", rating: 4.8, reviews: 78, stockLeft: 7, colors: ["#8B0000", "#4B0082", "#191970"], fabric: "Velvet", width: "54 inches", weight: "200 GSM" },
  // ── Crepe Fabrics ──
  { id: 8001, name: "Crepe Fabric", price: 699, originalPrice: 999, category: "Crepe Fabrics", images: [product3, "https://i.pinimg.com/736x/11/54/cc/1154ccb6382b1a231ef9d4ba549bcddb.jpg"], desc: "Versatile crepe fabric with a distinctive crinkled texture and excellent drape. Its wrinkle-resistant nature makes it ideal for sarees, dresses, and everyday ethnic wear. Price per meter.", rating: 4.4, reviews: 56, stockLeft: 22, colors: ["#FF1493", "#00CED1", "#FFD700"], fabric: "Crepe", width: "44 inches", weight: "80 GSM" },
];

const FALLBACK_SIMILAR = [
  { id: 9101, name: "Tussar Silk Fabric", price: 899, category: "Silk Fabrics", image: "https://i.pinimg.com/736x/38/6e/b0/386eb08698d75f248022e0951a996dba.jpg" },
  { id: 9102, name: "Ikat Cotton Fabric", price: 549, category: "Cotton Fabrics", image: "https://i.pinimg.com/736x/c5/5d/d7/c55dd77f221bd429b9e46437d082580e.jpg" },
];

/** Map shop catalog rows to ProductDetail shape (images, originalPrice, desc). */
const normalizeCatalogRow = (p) => ({
  ...p,
  originalPrice: p.originalPrice ?? p.oldPrice ?? p.price,
  images: p.images ?? (p.image ? [p.image] : []),
  desc:
    p.desc ||
    `${p.name} — Premium fabric from FabricForever. Authentic craftsmanship and curated quality. Price per meter.`,
  fabric: p.fabric || "Various",
  width: p.width || "44 inches",
  weight: p.weight || "Standard",
});

const ExpandableSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-4 flex items-center justify-between group hover:bg-stone-50/50 transition-all px-4">
        <div className="flex items-center gap-3"><div className="p-1.5 bg-primary/10 rounded-lg"><Icon className="w-4 h-4 text-primary" /></div><span className="font-medium text-stone-800">{title}</span></div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}><div className="px-4 pb-4">{children}</div></div>
    </div>
  );
};

const FabricSpecs = ({ product }) => (
  <div className="space-y-3">
    {[
      { label: "Fabric Width", value: product.width || "44 inches" },
      { label: "Fabric Weight", value: product.weight || "Standard" },
      { label: "Sold By", value: "Per Meter" },
      { label: "Weave Type", value: "Handwoven" },
      { label: "Wash Care", value: "Dry Clean Only" },
    ].map((item, idx) => (
      <div key={idx} className="flex justify-between items-center pb-2 border-b border-stone-100">
        <span className="text-sm text-stone-500">{item.label}</span>
        <span className="text-sm font-medium text-stone-800">{item.value}</span>
      </div>
    ))}
  </div>
);

const FabricCare = () => (
  <div className="grid grid-cols-2 gap-3">
    {[{icon:WashingMachine,text:"Dry Clean Only"},{icon:Sun,text:"No Direct Sunlight"},{icon:Thermometer,text:"Cool Iron Only"},{icon:Droplet,text:"No Bleach"}].map((item,idx)=>(<div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg"><item.icon className="w-4 h-4 text-primary" /><span className="text-xs text-stone-600">{item.text}</span></div>))}
  </div>
);

const ProductDetails = ({ product }) => (
  <div className="space-y-3">
    {[
      { label: "Fabric", value: product.fabric },
      { label: "Width", value: product.width || "44 inches" },
      { label: "Weight", value: product.weight || "Standard" },
      { label: "Weave Type", value: "Handwoven" },
      { label: "Wash Care", value: "Dry Clean Only" },
    ].map((item, idx) => (
      <div key={idx} className="flex justify-between items-center pb-2 border-b border-stone-100">
        <span className="text-sm text-stone-500">{item.label}</span>
        <span className="text-sm font-medium text-stone-800">{item.value}</span>
      </div>
    ))}
  </div>
);

const DeliveryReturns = () => (
  <div className="space-y-4">
    {[{icon:Truck,title:"Free Delivery",desc:"3-5 business days"},{icon:RefreshCcw,title:"Easy Returns",desc:"7 days return policy"},{icon:Shield,title:"100% Authentic",desc:"Certificate included"}].map((item,idx)=>(<div key={idx} className="flex items-start gap-3"><item.icon className="w-4 h-4 text-primary mt-0.5" /><div><p className="text-sm font-medium text-stone-800">{item.title}</p><p className="text-xs text-stone-500">{item.desc}</p></div></div>))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [meters, setMeters] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [variantSelection, setVariantSelection] = useState({});
  const { addToCart, toggleWishlist, wishlist, catalogProducts } = useShop();

  useEffect(() => {
    const legacy = allProductsDatabase.find((item) => item.id.toString() === id);
    const fromCatalog = catalogProducts.find((item) => item.id.toString() === id);
    const raw = fromCatalog ? normalizeCatalogRow(fromCatalog) : legacy || null;
    if (raw) {
      setProduct(raw);
      setSelectedColor(raw.colors?.[0] || null);
      const stored = localStorage.getItem("llmshop_recently_viewed");
      const viewed = stored ? JSON.parse(stored) : [];
      const updated = [raw, ...viewed.filter((p) => p.id !== raw.id)].slice(0, 8);
      localStorage.setItem("llmshop_recently_viewed", JSON.stringify(updated));
    } else {
      setProduct(null);
    }
    window.scrollTo(0, 0);
  }, [id, catalogProducts]);

  useEffect(() => {
    const stored = localStorage.getItem("llmshop_recently_viewed");
    if (stored) setRecentlyViewed(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!product) return;
    const vers = product.variations || [];
    const next = {};
    vers.forEach((v) => {
      const dim = v.dimension || v.name;
      if (dim && v.options?.length) next[dim] = v.options[0];
    });
    setVariantSelection(next);
  }, [product?.id, JSON.stringify(product?.variations || [])]);

  useEffect(() => {
    if (!product?.seo) return undefined;
    const { metaTitle, metaDescription } = product.seo;
    if (!metaTitle && !metaDescription) return undefined;
    const prevTitle = document.title;
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevMetaContent = metaDesc?.getAttribute("content");

    let metaKw = document.querySelector('meta[name="keywords"]');
    const prevKwContent = metaKw?.getAttribute("content");
    const keywords = product.seo.keywords;

    if (metaTitle) document.title = metaTitle;

    if (metaDescription) {
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", metaDescription);
    }

    if (keywords && metaKw) metaKw.setAttribute("content", keywords);
    else if (keywords && !metaKw) {
      metaKw = document.createElement("meta");
      metaKw.setAttribute("name", "keywords");
      metaKw.setAttribute("content", keywords);
      document.head.appendChild(metaKw);
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevMetaContent !== undefined && prevMetaContent !== null)
        metaDesc.setAttribute("content", prevMetaContent);
      if (metaKw && keywords) {
        if (prevKwContent) metaKw.setAttribute("content", prevKwContent);
        else metaKw.removeAttribute("content");
      }
    };
  }, [product?.id, product?.seo?.metaTitle, product?.seo?.metaDescription, product?.seo?.keywords]);

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 gap-4 px-6">
      <p className="font-body text-stone-600 text-center">We could not find this product.</p>
      <Link to="/shop" className="text-primary font-medium hover:underline">Back to shop</Link>
    </div>
  );

  const isInWishlist = wishlist.some(item => item.id === product.id);
  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const similarProducts = (() => {
    const pool = catalogProducts.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    const mapped = pool.length
      ? pool.slice(0, 6).map((p) => ({
          ...p,
          image: p.image || p.images?.[0],
        }))
      : FALLBACK_SIMILAR.filter((p) => p.category === product.category);
    return mapped.length ? mapped : FALLBACK_SIMILAR;
  })();
  const isLowStock = product.stockLeft <= 3;
  const productImages = product.images || [product.image];

  const otherVariationAxes =
    product.variations?.filter((v) => !/\bsize\b/i.test(String(v.dimension || v.name))) || [];

  const handleAddToCart = (productToAdd) => {
    const item = productToAdd || product;
    addToCart({
      ...item,
      qty: meters,
      meters: meters,
      selectedColor,
      variationChoices: variantSelection,
    });
    setAddedToCart(true);
    setShowToast(`${meters}m of ${item.name} added to cart!`);
    setTimeout(()=>{setAddedToCart(false);setShowToast(null);},2000);
  };
  const handleBuyNow = () => { handleAddToCart(); setTimeout(()=>navigate("/checkout"),500); };

  return (
    <div className="w-full min-h-screen bg-stone-50">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]"><div className="bg-stone-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-primary" />{showToast}</div></div>
      )}

      <div className="container mx-auto px-4 max-w-7xl py-4">
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Link to="/" className="hover:text-primary transition">Home</Link><ChevronRight className="w-3 h-3" />
          <Link to={`/${product.category.toLowerCase()}`} className="hover:text-primary transition">{product.category}</Link><ChevronRight className="w-3 h-3" />
          <span className="text-stone-600 truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="relative w-full bg-white overflow-hidden border border-stone-200">
                <div className="relative aspect-[3/4] flex items-center justify-center bg-stone-50">
                  <img src={productImages[selectedImage]} alt={product.name} className="w-full h-full object-contain transition-all duration-500" />
                  {productImages.length > 1 && (<><button onClick={() => setSelectedImage(prev => prev === 0 ? productImages.length - 1 : prev - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-md hover:bg-white transition"><ChevronLeft className="w-5 h-5 text-stone-700" /></button><button onClick={() => setSelectedImage(prev => prev === productImages.length - 1 ? 0 : prev + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 shadow-md hover:bg-white transition"><ChevronRight className="w-5 h-5 text-stone-700" /></button></>)}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {discount > 0 && <span className="bg-stone-800 text-white text-xs font-bold px-3 py-1.5 shadow-lg">{discount}% OFF</span>}
                    {isLowStock && <span className="bg-stone-700 text-white text-xs font-bold px-3 py-1.5 shadow-lg flex items-center gap-1"><Zap className="w-3 h-3 fill-white" />Only {product.stockLeft} left</span>}
                  </div>
                  <button onClick={() => toggleWishlist(product)} className={`absolute top-4 right-4 p-2.5 shadow-md transition-all hover:scale-110 ${isInWishlist ? 'bg-primary text-white' : 'bg-white text-stone-600 hover:bg-white'}`}><Heart className={`w-5 h-5 ${isInWishlist ? 'fill-white' : ''}`} /></button>
                  <div className="absolute bottom-4 right-4 bg-white/90 text-xs font-medium text-stone-600 px-3 py-1.5 rounded-full shadow">{selectedImage + 1} / {productImages.length}</div>
                </div>
              </div>
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {productImages.map((img, idx) => (<button key={idx} onClick={() => setSelectedImage(idx)} className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-primary' : 'border-stone-200 opacity-70 hover:opacity-100'}`}><img src={img} alt="" className="w-full h-full object-cover" /></button>))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <span className="text-xs text-primary font-bold uppercase tracking-wider">Premium Collection</span>
            <h1 className="font-heading text-3xl md:text-4xl text-stone-800 mt-1 mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1"><span className="text-sm font-bold text-stone-800">{product.rating}</span><div className="flex">{[...Array(5)].map((_,i)=>(<Star key={i} className={`w-4 h-4 ${i<Math.floor(product.rating)?'fill-yellow-500 text-yellow-500':'text-stone-300'}`} />))}</div></div>
              <span className="text-xs text-stone-400">({product.reviews} reviews)</span><span className="w-1 h-1 bg-stone-300 rounded-full"></span>
              <span className="text-xs text-stone-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" />In Stock</span>
            </div>
            <div className="mb-6 pb-4 border-b border-stone-200">
              <div className="flex items-end gap-3"><span className="font-heading text-3xl text-stone-800">₹{product.price.toLocaleString('en-IN')}</span>{product.originalPrice>product.price&&<><span className="text-lg text-stone-400 line-through mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</span><span className="text-sm text-primary font-bold bg-primary/10 px-2 py-0.5">Save {discount}%</span></>}</div>
              <p className="text-xs text-stone-400 mt-2">
                {product.tax?.gstPercent != null ? (
                  <>
                    GST {product.tax.gstPercent}% {product.tax.hsnCode ? `· HSN ${product.tax.hsnCode}` : ''} ·{' '}
                    {product.tax.priceTaxInclusive !== false ? 'Price includes GST' : 'GST at checkout'}{' '}
                  </>
                ) : (
                  <>Inclusive of all taxes</>
                )}
                {' · '}Free shipping
              </p>
            </div>

            {product.colors&&(<div className="mb-6"><p className="text-sm font-medium text-stone-700 mb-2">Color:</p><div className="flex flex-wrap gap-3">{product.colors.map((color,idx)=>(<div key={idx} className="relative"><button type="button" onClick={()=>setSelectedColor(color)} className={`w-12 h-12 rounded-full border-2 transition-all relative ${selectedColor===color?'border-primary scale-110':'border-stone-200 hover:scale-105'}`} style={{backgroundColor:color}}>{selectedColor===color&&<CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-primary bg-white rounded-full" />}</button></div>))}</div></div>)}

            {otherVariationAxes.map((axis) => {
              const dim = axis.dimension || axis.name;
              const opts = axis.options || [];
              if (!dim || opts.length === 0) return null;
              return (
                <div key={dim} className="mb-6">
                  <p className="text-sm font-medium text-stone-700 mb-2">{dim}</p>
                  <div className="flex flex-wrap gap-2">
                    {opts.map((opt) => {
                      const s = String(opt);
                      const sel = variantSelection[dim] === opt;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setVariantSelection((prev) => ({ ...prev, [dim]: opt }))}
                          className={`py-2 px-3 border rounded-lg font-medium text-sm transition-all ${sel ? 'border-primary bg-primary/5 text-primary' : 'border-stone-200 text-stone-600 hover:border-primary/50'}`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-stone-700">Meters (mts)</p>
                <span className="text-xs text-stone-400">Price per meter</span>
              </div>
              <div className="flex items-center border border-stone-200 w-40 bg-white">
                <button onClick={() => setMeters(Math.max(1, meters - 1))} className="p-3 hover:bg-stone-100 transition">
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={meters}
                  min="1"
                  max="100"
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1 && val <= 100) setMeters(val);
                  }}
                  className="w-full text-center font-medium text-stone-800 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button onClick={() => setMeters(meters + 1)} className="p-3 hover:bg-stone-100 transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                Total: <span className="font-bold text-stone-800 text-sm">₹{(product.price * meters).toLocaleString('en-IN')}</span> ({meters} {meters === 1 ? 'meter' : 'meters'} × ₹{product.price.toLocaleString('en-IN')}/mtr)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={() => handleAddToCart()} className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${addedToCart?'bg-green-500 text-white':'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}>{addedToCart?<><CheckCircle2 className="w-5 h-5"/>Added</>:<><ShoppingCart className="w-5 h-5"/>Add to Cart</>}</button>
              <button onClick={handleBuyNow} className="flex-1 bg-stone-800 text-white py-4 font-bold text-sm uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2"><Zap className="w-5 h-5"/>Buy Now</button>
            </div>

            <div className="border border-stone-200 overflow-hidden bg-white">
              <ExpandableSection title="Product Details" icon={Info} defaultOpen={true}><p className="text-sm text-stone-600 mb-4">{product.desc}</p><ProductDetails product={product}/></ExpandableSection>
              <ExpandableSection title="Fabric Specifications" icon={Info}><FabricSpecs product={product}/></ExpandableSection>
              <ExpandableSection title="Fabric & Care" icon={Droplet}><FabricCare/></ExpandableSection>
              <ExpandableSection title="Delivery & Returns" icon={Truck}><DeliveryReturns/></ExpandableSection>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200"><button className="flex items-center gap-2 text-sm text-stone-500 hover:text-primary transition"><Share2 className="w-4 h-4"/>Share this product</button></div>
          </div>
        </div>

        {/* SIMILAR PRODUCTS SECTION */}
        <div className="mt-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">Similar Products</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {similarProducts.map((item) => (
              <div key={item.id} className="min-w-[220px] bg-white border border-stone-100">
                <img src={item.image} alt={item.name} className="w-full h-[280px] object-cover" />
                <div className="p-3">
                  <p className="text-sm text-black line-clamp-2">{item.name}</p>
                  <p className="text-sm font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                </div>
                <button onClick={() => handleAddToCart(item)} className="w-full border-t border-stone-100 text-sm py-2.5 hover:bg-black hover:text-white transition font-medium">ADD TO CART • ₹{item.price.toLocaleString()}</button>
              </div>
            ))}
          </div>
        </div>

        {/* RECENTLY VIEWED SECTION */}
        {recentlyViewed.length > 1 && (
          <div className="mt-12 border-t border-stone-200 pt-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-widest">History</span>
                <h3 className="text-xl font-semibold text-black">Recently Viewed</h3>
              </div>
              <button onClick={() => { setRecentlyViewed([]); localStorage.removeItem("llmshop_recently_viewed"); }} className="text-xs text-gray-400 hover:text-red-500">Clear</button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {recentlyViewed.filter(p => p.id !== product.id).slice(0, 6).map((p) => (
                <div key={p.id} className="min-w-[200px] flex-shrink-0">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.images?.[0] || p.image} alt={p.name} className="w-full h-[260px] object-cover" />
                  </Link>
                  <Link to={`/product/${p.id}`}>
                    <p className="text-sm text-black mt-2 line-clamp-2 hover:text-primary transition">{p.name}</p>
                  </Link>
                  <p className="text-sm font-semibold">₹{p.price.toLocaleString()}</p>
                  <button onClick={() => { addToCart({...p, qty: 1, meters: 1}); setShowToast(`${p.name} added!`); setTimeout(()=>setShowToast(null),2000); }} className="w-full border border-black text-xs py-2 mt-2 hover:bg-black hover:text-white transition">ADD TO CART</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}} />
    </div>
  );
};

export default ProductDetail;