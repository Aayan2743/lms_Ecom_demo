import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ShoppingCart, Heart, Star, Truck, RefreshCcw, Minus, Plus, 
  ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight,
  Zap, Info, ChevronDown, ChevronUp, Droplet, Maximize2, 
  AlertCircle, Shield, WashingMachine, Sun, Thermometer, Share2, Ruler
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
  { id: 101, name: "Royal Kanchipuram Silk Saree", price: 12499, originalPrice: 15999, category: "Sarees", images: [product1, "https://i.pinimg.com/736x/5d/0c/3e/5d0c3eecd96738b38dc3a31d01b04eab.jpg", "https://i.pinimg.com/736x/33/e2/04/33e20454ff3d260337ac462bba1958b3.jpg"], desc: "Experience the elegance of our handwoven Royal Kanchipuram Silk Saree.", rating: 4.8, reviews: 156, stockLeft: 8, colors: ["#8B0000", "#C41E3A", "#FFD700"], fabric: "Pure Silk", occasion: "Wedding" },
  { id: 301, name: "Pastel Embroidered Kurta", price: 2999, originalPrice: 4499, category: "Kurtas", images: [product2, "https://i.pinimg.com/736x/e3/7b/08/e37b08dbad8a6d08a7fdd68172f82101.jpg"], desc: "A beautiful pastel embroidered kurta for everyday comfort.", rating: 4.6, reviews: 89, stockLeft: 12, colors: ["#FFF5EE", "#FFE4E1", "#E6E6FA"], fabric: "Cotton Silk", occasion: "Casual" },
  { id: 401, name: "Indigo Block Print Dupatta", price: 1899, originalPrice: 2499, category: "Dupattas", images: [product3], desc: "Authentic hand-block printed indigo dupatta.", rating: 4.7, reviews: 67, stockLeft: 5, colors: ["#1E3A8A", "#2563EB", "#60A5FA"], fabric: "Cotton", occasion: "Casual" },
  { id: 201, name: "Banarasi Silk Fabric", price: 3499, originalPrice: 4999, category: "Fabrics", images: [product4], desc: "Premium Banarasi Silk Fabric.", rating: 4.9, reviews: 234, stockLeft: 15, colors: ["#FF1493", "#FFD700"], fabric: "Banarasi Silk", occasion: "Custom" },
  { id: 102, name: "Chanderi Pink Silk Saree", price: 8999, originalPrice: 11999, category: "Sarees", images: [product5], desc: "Trending Pink Saree.", rating: 4.7, reviews: 92, stockLeft: 6, colors: ["#FF69B4", "#FFB6C1"], fabric: "Chanderi Silk", occasion: "Festival" },
  { id: 302, name: "Olive Linen Kurta Set", price: 3799, originalPrice: 5299, category: "Kurtas", images: [product7], desc: "Premium olive green linen kurta set.", rating: 4.8, reviews: 145, stockLeft: 4, colors: ["#556B2F", "#6B8E23"], fabric: "Linen", occasion: "Party" },
  { id: 202, name: "Kalamkari Print Cotton Fabric", price: 999, originalPrice: 1499, category: "Fabrics", images: [product8], desc: "Beautiful Kalamkari print.", rating: 4.8, reviews: 56, stockLeft: 10, colors: ["#2F4F4F", "#8B4513"], fabric: "Cotton", occasion: "Traditional" },
  { id: 402, name: "Banarasi Zari Dupatta", price: 4500, originalPrice: 6000, category: "Dupattas", images: ["https://i.pinimg.com/736x/59/11/80/591180632783e4ac10876b05e2b3e3bb.jpg"], desc: "Heritage Banarasi Zari Dupatta.", rating: 4.9, reviews: 123, stockLeft: 2, colors: ["#C41E3A", "#FFD700"], fabric: "Silk", occasion: "Bridal" },
];

const FALLBACK_SIMILAR = [
  { id: 9101, name: "Red Organza Saree With Florals", price: 7995, category: "Sarees", image: "https://i.pinimg.com/736x/38/6e/b0/386eb08698d75f248022e0951a996dba.jpg" },
  { id: 9102, name: "Yellow Designer Saree", price: 6599, category: "Sarees", image: "https://i.pinimg.com/736x/c5/5d/d7/c55dd77f221bd429b9e46437d082580e.jpg" },
];

/** Map shop catalog rows to ProductDetail shape (images, originalPrice, desc). */
const normalizeCatalogRow = (p) => ({
  ...p,
  originalPrice: p.originalPrice ?? p.oldPrice ?? p.price,
  images: p.images ?? (p.image ? [p.image] : []),
  desc:
    p.desc ||
    `${p.name} — Handpicked premium piece from LM Showroom. Authentic craftsmanship and curated quality.`,
  fabric: p.fabric || "Various",
  occasion: p.occasion || "Festive",
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

const SizeGuide = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead><tr className="border-b border-stone-200"><th className="text-left py-2 px-3 font-semibold text-stone-700">Size</th><th className="text-left py-2 px-3 font-semibold text-stone-700">Bust (in)</th><th className="text-left py-2 px-3 font-semibold text-stone-700">Waist (in)</th><th className="text-left py-2 px-3 font-semibold text-stone-700">Hip (in)</th></tr></thead>
      <tbody>{['XS','S','M','L','XL','XXL'].map((size,idx)=>(<tr key={size} className="border-b border-stone-100"><td className="py-2 px-3 font-medium text-stone-600">{size}</td><td className="py-2 px-3 text-stone-500">{['32','34','36','38','40','42'][idx]}</td><td className="py-2 px-3 text-stone-500">{['26','28','30','32','34','36'][idx]}</td><td className="py-2 px-3 text-stone-500">{['34','36','38','40','42','44'][idx]}</td></tr>))}</tbody>
    </table>
  </div>
);

const FabricCare = () => (
  <div className="grid grid-cols-2 gap-3">
    {[{icon:WashingMachine,text:"Dry Clean Only"},{icon:Sun,text:"No Direct Sunlight"},{icon:Thermometer,text:"Cool Iron Only"},{icon:Droplet,text:"No Bleach"}].map((item,idx)=>(<div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg"><item.icon className="w-4 h-4 text-primary" /><span className="text-xs text-stone-600">{item.text}</span></div>))}
  </div>
);

const ProductDetails = ({ product }) => (
  <div className="space-y-3">
    {[{label:"Fabric",value:product.fabric},{label:"Occasion",value:product.occasion},{label:"Weave Type",value:"Handwoven"},{label:"Blouse Piece",value:"Included (0.8 mtr)"},{label:"Wash Care",value:"Dry Clean Only"}].map((item,idx)=>(<div key={idx} className="flex justify-between items-center pb-2 border-b border-stone-100"><span className="text-sm text-stone-500">{item.label}</span><span className="text-sm font-medium text-stone-800">{item.value}</span></div>))}
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
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
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
    const sizeAxis = vers.find((v) => /\bsize\b/i.test(String(v.dimension || v.name)));
    if (sizeAxis?.options?.[0]) setSelectedSize(String(sizeAxis.options[0]));
    else setSelectedSize("M");
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

  const sizeAxis = product.variations?.find((v) => /\bsize\b/i.test(String(v.dimension || v.name)));
  const sizeOptions =
    sizeAxis?.options?.length > 0
      ? sizeAxis.options.map(String)
      : ["XS", "S", "M", "L", "XL", "XXL"];

  const otherVariationAxes =
    product.variations?.filter((v) => !/\bsize\b/i.test(String(v.dimension || v.name))) || [];

  const handleAddToCart = (productToAdd) => { 
    const item = productToAdd || product;
    addToCart({
      ...item,
      qty: quantity,
      size: selectedSize,
      selectedColor,
      variationChoices: variantSelection,
    }); 
    setAddedToCart(true); 
    setShowToast(`${item.name} added to cart!`); 
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
              {product.affiliate?.enabled && (
                <p className="text-xs text-stone-500 mt-1.5">
                  Affiliate: up to{' '}
                  <span className="font-semibold text-stone-700">{product.affiliate.commissionPercent}%</span>
                  commission
                  {product.affiliate.network ? ` (${product.affiliate.network})` : ''}.
                </p>
              )}
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

            <div className="mb-6"><div className="flex items-center justify-between mb-3"><p className="text-sm font-medium text-stone-700">Size</p><button type="button" className="text-xs text-primary hover:underline flex items-center gap-1"><Maximize2 className="w-3 h-3"/>Size Guide</button></div><div className={`grid gap-2 ${sizeOptions.length > 7 ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-6'}`}>{sizeOptions.map((size)=>{ const siz = String(size); return(<button key={siz} type="button" onClick={()=>setSelectedSize(siz)} className={`py-2.5 border font-medium text-sm transition-all ${selectedSize===siz?'border-primary bg-primary/5 text-primary':'border-stone-200 text-stone-600 hover:border-primary/50'}`}>{siz}</button>); })}</div></div>

            <div className="mb-6"><p className="text-sm font-medium text-stone-700 mb-3">Quantity</p><div className="flex items-center border border-stone-200 w-32 bg-white"><button onClick={()=>setQuantity(Math.max(1,quantity-1))} className="p-3"><Minus className="w-4 h-4"/></button><input type="text" value={quantity} readOnly className="w-full text-center font-medium text-stone-800 bg-transparent outline-none"/><button onClick={()=>setQuantity(quantity+1)} className="p-3"><Plus className="w-4 h-4"/></button></div></div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={() => handleAddToCart()} className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${addedToCart?'bg-green-500 text-white':'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}>{addedToCart?<><CheckCircle2 className="w-5 h-5"/>Added</>:<><ShoppingCart className="w-5 h-5"/>Add to Cart</>}</button>
              <button onClick={handleBuyNow} className="flex-1 bg-stone-800 text-white py-4 font-bold text-sm uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2"><Zap className="w-5 h-5"/>Buy Now</button>
            </div>

            <div className="border border-stone-200 overflow-hidden bg-white">
              <ExpandableSection title="Product Details" icon={Info} defaultOpen={true}><p className="text-sm text-stone-600 mb-4">{product.desc}</p><ProductDetails product={product}/></ExpandableSection>
              <ExpandableSection title="Size Guide" icon={Ruler}><SizeGuide/></ExpandableSection>
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
                  <button onClick={() => { addToCart({...p, qty: 1, size: 'M'}); setShowToast(`${p.name} added!`); setTimeout(()=>setShowToast(null),2000); }} className="w-full border border-black text-xs py-2 mt-2 hover:bg-black hover:text-white transition">ADD TO CART</button>
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