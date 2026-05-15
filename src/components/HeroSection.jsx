import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import heroBanner from "@/assets/hero-banner.jpg"; 

const slides = [
  {
    image: "https://i.pinimg.com/736x/56/14/81/561481cdf44e31905ab2760bbd033202.jpg", 
    tag: "New Collection 2026",
    titleLine1: "Premium",
    titleLine2: "Fabrics",
    subtitle: "Discover our handpicked collection of silk, cotton, linen & designer fabrics.",
    link: "/shop",
    btnText: "Shop Now"
  },
  {
    image: "https://i.pinimg.com/1200x/5c/ba/ae/5cbaaec476c9984024ed212a5138b74d.jpg", 
    tag: "Handloom Special",
    titleLine1: "Artisan",
    titleLine2: "Crafted",
    subtitle: "Authentic handwoven fabrics sourced directly from weavers across India.",
    link: "/cotton-fabrics",
    btnText: "Explore Handloom"
  },
  {
    image: "https://i.pinimg.com/736x/c0/ff/35/c0ff355a86cc81c4382a00c33e9379d4.jpg", 
    tag: "Limited Time Offer",
    titleLine1: "Flat 30%",
    titleLine2: "OFF",
    subtitle: "On all silk fabrics this season. Premium quality at unbeatable prices!",
    link: "/silk-fabrics",
    btnText: "Grab Deal"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    startSlider();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startSlider = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); 
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startSlider(); 
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    startSlider(); 
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
      
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={slide.image} 
            alt="Premium fabric collection" 
            className="w-full h-full object-cover" 
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/20 z-0" />

      <div className="absolute inset-0 flex items-center z-10">
        <div className="container pl-16 md:pl-20">
          <div className="max-w-lg animate-fade-up transition-all duration-500">
            <p className="text-primary-foreground/80 text-sm tracking-[0.3em] uppercase mb-3 font-body">
              {slides[currentSlide].tag}
            </p>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-4">
              {slides[currentSlide].titleLine1} <br />
              <span className="text-gold">{slides[currentSlide].titleLine2}</span>
            </h2>
            <p className="text-primary-foreground/70 text-sm md:text-base mb-6 font-body">
              {slides[currentSlide].subtitle}
            </p>
            <Link 
              to={slides[currentSlide].link} 
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-sm text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
            >
              {slides[currentSlide].btnText}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card/40"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card/40"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentSlide(i); startSlider(); }}
            className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === i ? 'bg-primary w-6 md:w-8' : 'bg-primary-foreground/50 hover:bg-primary-foreground/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;