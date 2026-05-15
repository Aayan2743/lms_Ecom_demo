import { ShoppingCart, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom"; 
import { useShop } from "../ShopContext.jsx"; 

const products = [
  { id: 1001, img: "https://i.pinimg.com/736x/56/14/81/561481cdf44e31905ab2760bbd033202.jpg", name: "Pure Kanchipuram Silk Fabric", price: 2499, originalPrice: 3499, tag: "Bestseller", category: "Silk Fabrics" },
  { id: 2001, img: "https://i.pinimg.com/1200x/5c/ba/ae/5cbaaec476c9984024ed212a5138b74d.jpg", name: "Handloom Cotton Fabric", price: 899, originalPrice: 1299, tag: "New", category: "Cotton Fabrics" },
  { id: 2003, img: "https://i.pinimg.com/736x/38/de/80/38de8036daff2e913e5769671989e6ad.jpg", name: "Kalamkari Print Cotton Fabric", price: 999, originalPrice: 1499, tag: null, category: "Cotton Fabrics" },
  { id: 1002, img: "https://i.pinimg.com/736x/4f/0c/79/4f0c799c67e8be10b14ad150b54f53b4.jpg", name: "Banarasi Silk Brocade Fabric", price: 3499, originalPrice: 4999, tag: "Premium", category: "Silk Fabrics" },
  { id: 3001, img: "https://i.pinimg.com/736x/d9/f4/cb/d9f4cb9581dbe49b1c47ce1f223655f8.jpg", name: "Premium Linen Fabric", price: 1599, originalPrice: 2199, tag: "Trending", category: "Linen Fabrics" },
  { id: 2002, img: "https://i.pinimg.com/1200x/b3/46/dc/b346dca6fb0cbcd99a4589c162621ef3.jpg", name: "Ikat Handwoven Cotton Fabric", price: 1299, originalPrice: 1799, tag: null, category: "Cotton Fabrics" },
  { id: 5001, img: "https://i.pinimg.com/736x/59/11/80/591180632783e4ac10876b05e2b3e3bb.jpg", name: "Organza Fabric", price: 1199, originalPrice: 1699, tag: "New", category: "Organza Fabrics" },
  { id: 2004, img: "https://i.pinimg.com/1200x/c1/70/8c/c1708cb21db4bcc9f47b7d696a3686a6.jpg", name: "Indigo Block Print Fabric", price: 850, originalPrice: 1200, tag: null, category: "Cotton Fabrics" },
];

const ProductCard = ({ product, index, isVisible }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.img, category: product.category });
    alert(`${product.name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    toggleWishlist({ id: product.id, name: product.name, price: product.price, image: product.img, category: product.category });
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      className={`block group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${isVisible ? `animate-fade-up stagger-${(index % 5) + 1}` : "opacity-0"}`}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.img} 
          alt={product.name} 
          loading="lazy" 
          width={512} 
          height={640} 
          className="w-full h-56 md:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500 pointer-events-none" />

        {product.tag && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 md:px-3 py-1 rounded-full pointer-events-none">
            {product.tag}
          </span>
        )}

        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card hover:scale-110 z-10"
        >
          <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${isWishlisted ? "fill-destructive text-destructive" : "text-foreground"}`} />
        </button>

        <button 
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 bg-primary text-primary-foreground py-2 md:py-2.5 rounded-lg font-medium text-xs md:text-sm flex items-center justify-center gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary/90 active:scale-[0.98] z-10"
        >
          <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Add to Cart
        </button>
      </div>

      <div className="p-3 md:p-4">
        <h3 className="font-body text-xs md:text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300 cursor-pointer">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 md:gap-2 mt-1.5">
          <span className="text-base md:text-lg font-heading font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
          <span className="text-xs md:text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
          <span className="text-[10px] md:text-xs font-semibold text-primary">{discount}% OFF</span>
        </div>
      </div>
    </Link>
  );
};

const ProductGrid = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="products" className="pt-10 pb-6 md:pt-16 md:pb-10 scroll-mt-20" ref={ref}>
      <div className="container">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <p className="text-primary text-xs uppercase tracking-[0.3em] font-semibold mb-1">New Collection</p>
            <h2 className={`text-2xl md:text-4xl font-heading text-foreground ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
              Trending Fabrics
            </h2>
          </div>
          <Link 
            to="/shop" 
            className={`text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;