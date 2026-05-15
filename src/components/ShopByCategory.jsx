import { Link } from "react-router-dom"; 
import { useScrollAnimation } from "@/hooks/useScrollAnimation"; 

const categories = [
  { icon: "🧵", name: "Silk Fabrics", path: "/silk-fabrics", image: "https://i.pinimg.com/736x/56/14/81/561481cdf44e31905ab2760bbd033202.jpg" },
  { icon: "🌿", name: "Cotton Fabrics", path: "/cotton-fabrics", image: "https://i.pinimg.com/1200x/5c/ba/ae/5cbaaec476c9984024ed212a5138b74d.jpg" },
  { icon: "🧶", name: "Linen Fabrics", path: "/linen-fabrics", image: "https://i.pinimg.com/736x/d9/f4/cb/d9f4cb9581dbe49b1c47ce1f223655f8.jpg" },
  { icon: "✨", name: "Organza Fabrics", path: "/organza-fabrics", image: "https://i.pinimg.com/736x/59/11/80/591180632783e4ac10876b05e2b3e3bb.jpg" },
  { icon: "🎀", name: "Georgette Fabrics", path: "/georgette-fabrics", image: "https://i.pinimg.com/736x/62/72/ea/6272ea7225c912087f2c5b1c235a03ea.jpg" },
];

const ShopByCategory = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="categories" className="w-full pt-4 pb-8 md:pt-6 md:pb-10" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        
        <h2 className={`text-2xl md:text-4xl font-heading text-center w-full mb-6 md:mb-10 text-foreground ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          Shop by Fabric Type
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