import { ShoppingCart, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom"; 
import { useShop } from "../ShopContext.jsx"; 

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const products = [
  { id: 101, img: product1, name: "Royal Kanchipuram Silk Saree", price: 12499, originalPrice: 15999, tag: "Bestseller", category: "Sarees" },
  { id: 301, img: product2, name: "Pastel Embroidered Kurta", price: 2999, originalPrice: 4499, tag: "New", category: "Kurtas" },
  { id: 401, img: product3, name: "Indigo Block Print Dupatta", price: 1899, originalPrice: 2499, tag: null, category: "Dupattas" },
  { id: 201, img: product4, name: "Banarasi Silk Fabric", price: 3499, originalPrice: 4999, tag: "Premium", category: "Fabrics" },
  { id: 102, img: product5, name: "Chanderi Pink Silk Saree", price: 8999, originalPrice: 11999, tag: "Trending", category: "Sarees" },
  { id: 202, img: product6, name: "Ikat Cotton Fabric", price: 1299, originalPrice: 1799, tag: null, category: "Fabrics" },
  { id: 302, img: product7, name: "Olive Linen Kurta Set", price: 3799, originalPrice: 5299, tag: "New", category: "Kurtas" },
  { id: 203, img: product8, name: "Kalamkari Print Fabric", price: 999, originalPrice: 1499, tag: null, category: "Fabrics" },
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
    <section id="products" className="w-full pt-6 pb-2 md:pt-8 md:pb-2" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        
        <div className={`w-full text-center mx-auto mb-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <p className="text-primary text-xs md:text-sm uppercase tracking-widest font-medium mb-1 block">Curated for You</p>
          <h2 className="text-3xl md:text-4xl font-heading inline-block">Our Popular Products</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} isVisible={isVisible} />
          ))}
        </div>
        
        <div className={`flex justify-center mt-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <Link to="/shop" className="inline-block px-6 py-2.5 md:px-8 md:py-3 border-2 border-primary text-primary text-sm md:text-base font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 active:scale-[0.97]">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;