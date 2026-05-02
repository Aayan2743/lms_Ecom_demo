import { Link } from "react-router-dom"; 
import { useScrollAnimation } from "@/hooks/useScrollAnimation"; 

const categories = [
  { icon: "👗", name: "Sarees", path: "/sarees", image: "https://i.pinimg.com/736x/d0/eb/cc/d0ebcc838287f2c5bd84dea65a7b3eeb.jpg" },
  { icon: "🧵", name: "Fabrics", path: "/fabrics", image: "https://i.pinimg.com/736x/c0/ff/35/c0ff355a86cc81c4382a00c33e9379d4.jpg" },
  { icon: "👘", name: "Kurtas", path: "/kurtas", image: "https://i.pinimg.com/736x/11/54/cc/1154ccb6382b1a231ef9d4ba549bcddb.jpg" },
  { icon: "🧣", name: "Dupattas", path: "/dupattas", image: "https://i.pinimg.com/1200x/04/ec/53/04ec53cb56607ca5ec2950951fd88446.jpg" },
  { icon: "✂️", name: "Stitching", path: "/contact", image: "https://i.pinimg.com/1200x/3f/14/b4/3f14b4e94cfac4f5fd836efbc4e1afb3.jpg" }, 
];

const ShopByCategory = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    // 🌟 SPACE FIX: pt-10 ki jagah pt-4 kiya taki upar wale button se gap kam rahe
    <section id="categories" className="w-full pt-4 pb-8 md:pt-6 md:pb-10" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        
        {/* 🌟 ALIGNMENT FIX: text-center w-full lagaya */}
        <h2 className={`text-2xl md:text-4xl font-heading text-center w-full mb-6 md:mb-10 text-foreground ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          Shop by Categories
        </h2>
        
        <div 
          className="flex overflow-x-auto gap-5 md:gap-10 pb-6 snap-x snap-mandatory justify-start md:justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
        >
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {categories.map((cat, i) => (
            <Link
              to={cat.path}
              key={cat.name}
              className={`flex flex-col items-center gap-3 md:gap-4 cursor-pointer group min-w-[90px] md:min-w-[120px] snap-center shrink-0 ${isVisible ? `animate-scale-in stagger-${i + 1}` : "opacity-0"}`}
            >
              {/* 🌟 MOBILE RESPONSIVE IMAGES: w-20 mobile ke liye, w-32 desktop ke liye */}
              <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-[3px] border-transparent group-hover:border-primary transition-all duration-300 shadow-md">
                 <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
              </div>
              <span className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors font-heading tracking-wide text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;