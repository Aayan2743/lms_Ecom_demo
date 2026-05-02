import { Link } from "react-router-dom"; 
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import categorySarees from "@/assets/category-sarees.jpg";
import categoryFabrics from "@/assets/category-fabrics.jpg";
import categoryKurtas from "@/assets/category-kurtas.jpg";

const items = [
  { img: categorySarees, label: "Silk Sarees", sub: "Handwoven Collection", path: "/sarees", filterCategory: "Silk" },
  { img: categoryFabrics, label: "Block Print Fabrics", sub: "Artisan Crafted", path: "/fabrics", filterCategory: "Block Print" },
  { img: categoryKurtas, label: "Cotton Kurtas", sub: "Everyday Comfort", path: "/kurtas", filterCategory: "Cotton" },
];

const BestOfSeason = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="best-of-season" className="pt-6 pb-2 md:pt-8 md:pb-4 scroll-mt-20" ref={ref}>
      <div className="container">
        <h2 className={`text-3xl md:text-4xl font-heading text-center mb-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          Best of the Season
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <Link 
              to={item.path} 
              state={{ category: item.filterCategory }} 
              key={item.label} 
              className={`group relative overflow-hidden rounded-lg cursor-pointer block ${isVisible ? `animate-fade-up stagger-${i + 1}` : "opacity-0"}`}
            >
              <img 
                src={item.img} 
                alt={item.label} 
                loading="lazy" 
                width={640} 
                height={640} 
                className="w-full h-72 md:h-80 object-cover object-top transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-primary-foreground/70 text-xs uppercase tracking-widest">{item.sub}</p>
                <h3 className="text-primary-foreground text-xl font-heading font-semibold">{item.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestOfSeason;