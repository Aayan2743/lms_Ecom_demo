import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const FeaturedBanner = () => {
  const { ref, isVisible } = useScrollAnimation();
  const navigate = useNavigate();

  const handleBannerClick = (categoryPath) => {
    navigate(categoryPath);
  };

  const handleShopNowClick = (e, productData) => {
    e.stopPropagation();
    navigate("/cart", { state: { newItem: productData } });
  };

  return (
    <section id="featured" className="pt-6 pb-16 md:pt-6 md:pb-24" ref={ref}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
          
          {/* LEFT BANNER - Silk Fabrics */}
          <div 
            onClick={() => handleBannerClick("/silk-fabrics")} 
            className={`relative overflow-hidden rounded-lg cursor-pointer group ${isVisible ? "animate-slide-left" : "opacity-0"}`}
          >
            <img src="https://i.pinimg.com/736x/4f/0c/79/4f0c799c67e8be10b14ad150b54f53b4.jpg" alt="Premium Silk Fabrics" loading="lazy" width={640} height={800} className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-primary-foreground text-2xl md:text-3xl font-heading font-semibold italic">Luxury Silks</h3>
              <p className="text-primary-foreground/70 text-sm mt-1 mb-4">Premium silk fabrics for every occasion</p>
              
              <button 
                onClick={(e) => handleShopNowClick(e, { id: 1002, name: "Banarasi Silk Brocade Fabric", price: 3499, image: "https://i.pinimg.com/736x/4f/0c/79/4f0c799c67e8be10b14ad150b54f53b4.jpg" })}
                className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground border border-primary-foreground/30 px-6 py-2 rounded-sm text-xs uppercase tracking-wider hover:bg-primary-foreground/30 transition-all z-10 relative"
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* RIGHT BANNER - Cotton Fabrics */}
          <div 
            onClick={() => handleBannerClick("/cotton-fabrics")} 
            className={`relative overflow-hidden rounded-lg cursor-pointer group ${isVisible ? "animate-slide-right" : "opacity-0"}`}
          >
            <img src="https://i.pinimg.com/1200x/c1/70/8c/c1708cb21db4bcc9f47b7d696a3686a6.jpg" alt="Handloom Cotton Fabrics" loading="lazy" width={640} height={512} className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
            <div className="absolute bottom-8 right-8 text-right">
              <p className="text-primary text-xs uppercase tracking-widest mb-1">Exclusive</p>
              <h3 className="text-primary-foreground text-2xl md:text-3xl font-heading font-bold">Handloom Cotton</h3>
              <p className="text-primary-foreground/70 text-sm mt-1 mb-4">Authentic handwoven fabrics from artisans</p>
              
              <button 
                onClick={(e) => handleShopNowClick(e, { id: 2001, name: "Handloom Cotton Fabric", price: 899, image: "https://i.pinimg.com/1200x/c1/70/8c/c1708cb21db4bcc9f47b7d696a3686a6.jpg" })}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-sm text-xs uppercase tracking-wider hover:bg-primary/90 transition-all z-10 relative"
              >
                Shop Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedBanner;