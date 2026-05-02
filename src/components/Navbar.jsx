import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, ShoppingCart, Menu, X, Phone, Mail, ChevronDown, Trash2, Check, Truck, MapPin, Package, Shield, LogOut, CreditCard } from "lucide-react"; 
import { useShop } from "../ShopContext.jsx"; 

// 🔥 NAVLINKS ARRAY WITH CORRECT PATHS USING URL PARAMETERS
const navLinks = [
  { 
    label: "Sarees", path: "/sarees", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "Shop by Fabric", links:[ 
          { name: "Silk Sarees", category: "Silk", path: "/sarees", badge: "Premium" }, 
          { name: "Cotton Sarees", category: "Cotton", path: "/sarees" }, 
          { name: "Organza Sarees", category: "Organza", path: "/sarees", badge: "Trending" }, 
          { name: "Georgette Sarees", category: "Georgette", path: "/sarees" }, 
          { name: "Chiffon Sarees", category: "Chiffon", path: "/sarees" }, 
          { name: "Tissue Sarees", category: "Tissue", path: "/sarees", badge: "New" } 
        ] },
        { title: "Shop by Occasion", links:[ 
          { name: "Bridal Collection", category: "Wedding", path: "/sarees", badge: "🔥 Hot" }, 
          { name: "Party Wear", category: "Party", path: "/sarees" }, 
          { name: "Festival Special", category: "Festival", path: "/sarees" }, 
          { name: "Casual Wear", category: "Casual", path: "/sarees" }, 
          { name: "Office Wear", category: "Office", path: "/sarees" }, 
          { name: "Reception", category: "Reception", path: "/sarees" } 
        ] },
        { title: "Featured", links:[ 
          { name: "New Arrivals", category: "New Arrival", path: "/sarees", badge: "✨ New" }, 
          { name: "Bestsellers", category: "Bestseller", path: "/sarees", badge: "🏆 Best" }, 
          { name: "Trending Now", category: "Trending", path: "/sarees", badge: "📈 Trending" }, 
          { name: "Limited Edition", category: "Limited", path: "/sarees", badge: "⏰ Limited" }, 
          { name: "Under ₹999", category: "under-999", path: "/sarees", badge: "💰 Deal" } 
        ] }
      ],
      featuredImage: { url: "https://in.kalkifashion.com/cdn/shop/files/embroidered-saree-menu.jpg?v=5239106531695380492", title: "Premium Silk Collection", subtitle: "Starting at ₹4,999", link: "/sarees" }
    }
  },
  { 
    label: "Products", path: "/shop", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "Women's Wear", links:[ 
          { name: "Sarees", category: "Sarees", path: "/sarees" }, 
          { name: "Kurtas", category: "Kurtas", path: "/kurtas", badge: "Bestseller" }, 
          { name: "Dupattas", category: "Dupattas", path: "/dupattas" }, 
          { name: "Lehengas", path: "/lehengas", badge: "Premium" }, 
          { name: "Salwar Suits", path: "/salwar-suits" }, 
          { name: "Gowns", path: "/gowns" } 
        ] },
        { title: "Men's Wear", links:[ 
          { name: "Kurtas", category: "Kurtas", path: "/kurtas" }, 
          { name: "Sherwanis", path: "/men/sherwanis", badge: "Wedding" }, 
          { name: "Ethnic Sets", path: "/men/ethnic-sets" }, 
          { name: "Jodhpuri", path: "/men/jodhpuri" } 
        ] },
        { title: "Accessories", links:[ 
          { name: "Jewelry", path: "/jewelry" }, 
          { name: "Bags", path: "/bags" }, 
          { name: "Footwear", path: "/footwear" }, 
          { name: "Stoles", path: "/stoles" } 
        ] }
      ],
      featuredImage: { url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=400&fit=crop", title: "New Collection 2026", subtitle: "Shop Now", link: "/new-arrivals" }
    }
  },
  { 
    label: "Categories", path: "/categories", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "Ethnic Wear", links:[ 
          { name: "Sarees", category: "Sarees", path: "/sarees" }, 
          { name: "Kurtas & Kurtis", category: "Kurtas", path: "/kurtas" }, 
          { name: "Lehengas", path: "/lehengas" }, 
          { name: "Salwar Kameez", path: "/salwar-kameez" }, 
          { name: "Anarkali", path: "/anarkali" } 
        ] },
        { title: "Fabrics", links:[ 
          { name: "Silk Fabric", category: "Silk", path: "/fabrics", badge: "Premium" }, 
          { name: "Cotton Fabric", category: "Cotton", path: "/fabrics" }, 
          { name: "Chiffon", category: "Chiffon", path: "/fabrics" }, 
          { name: "Georgette", category: "Georgette", path: "/fabrics" }, 
          { name: "Organza", category: "Organza", path: "/fabrics" } 
        ] },
        { title: "Occasion", links:[ 
          { name: "Wedding", path: "/occasion/wedding" }, 
          { name: "Festival", path: "/occasion/festival" }, 
          { name: "Party", path: "/occasion/party" }, 
          { name: "Casual", path: "/occasion/casual" } 
        ] }
      ],
      featuredImage: { url: "https://in.kalkifashion.com/cdn/shop/files/250x350-desk-indo-fusion-styles-18-02-26_80a71954-4c84-4afa-bf4d-c8cefa4582bf.jpg?v=1772871706&width=235", title: "Festive Collection", subtitle: "Up to 40% OFF", link: "/festive-collection" }
    }
  },
  { 
    label: "Featured", path: "/featured", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "Curated Collections", links:[ 
          { name: "Editor's Pick", path: "/featured/editors-pick", badge: "⭐ Top" }, 
          { name: "Bestsellers", path: "/featured/bestsellers" }, 
          { name: "Trending Now", path: "/featured/trending", badge: "🔥 Hot" }, 
          { name: "New Arrivals", path: "/featured/new", badge: "✨ New" }, 
          { name: "Coming Soon", path: "/featured/coming-soon" } 
        ] },
        { title: "Designer Collections", links:[ 
          { name: "Premium Silk", path: "/collections/premium-silk" }, 
          { name: "Bridal Edit", path: "/collections/bridal", badge: "👰 Bridal" }, 
          { name: "Festive Special", path: "/collections/festive" }, 
          { name: "Summer Collection", path: "/collections/summer" } 
        ] },
        { title: "Offers", links:[ 
          { name: "Clearance Sale", path: "/sale/clearance", badge: "🔥 50% OFF" }, 
          { name: "Buy 1 Get 1", path: "/offers/bogo", badge: "🎁 BOGO" }, 
          { name: "Combo Offers", path: "/offers/combo" }, 
          { name: "First Order 30% OFF", path: "/offers/first-order", badge: "🆕 New User" } 
        ] }
      ],
      featuredImage: { url: "https://in.kalkifashion.com/cdn/shop/files/250x350-desk-exclusive-collections-23-03-26.jpg?v=1774257770&width=235", title: "Limited Time Offer", subtitle: "Flat 30% OFF", link: "/offers" }
    }
  },
  { 
    label: "Reviews", path: "/reviews", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "Customer Stories", links:[ 
          { name: "Photo Reviews", path: "/reviews/photos" }, 
          { name: "Video Testimonials", path: "/reviews/videos" }, 
          { name: "Top Rated", path: "/reviews/top-rated", badge: "⭐ 4.8+" }, 
          { name: "Recent Reviews", path: "/reviews/recent" } 
        ] },
        { title: "Shop by Rating", links:[ 
          { name: "5 Star Products", path: "/reviews/5-star" }, 
          { name: "4 Star & Above", path: "/reviews/4-star" }, 
          { name: "Most Reviewed", path: "/reviews/most-reviewed" } 
        ] },
        { title: "Community", links:[ 
          { name: "Style Stories", path: "/community/stories" }, 
          { name: "Lookbook", path: "/community/lookbook" }, 
          { name: "Share Your Style", path: "/community/share", badge: "📸 Share" } 
        ] }
      ],
      featuredImage: { url: "https://in.kalkifashion.com/cdn/shop/files/250x350-desk-salwar-kameez-18-02-26.jpg?v=1771497859&width=235", title: "Customer Favorites", subtitle: "See what's trending", link: "/reviews/favorites" }
    }
  },
  { 
    label: "Gallery", path: "/gallery", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "Collections", links:[ 
          { name: "Bridal Gallery", path: "/gallery/bridal" }, 
          { name: "Festive Looks", path: "/gallery/festive" }, 
          { name: "Casual Styles", path: "/gallery/casual" }, 
          { name: "Celebrity Looks", path: "/gallery/celebrity", badge: "🌟 Trending" } 
        ] },
        { title: "Behind the Scenes", links:[ 
          { name: "Craftsmanship", path: "/gallery/craft" }, 
          { name: "Fabric Making", path: "/gallery/fabric" }, 
          { name: "Design Process", path: "/gallery/design" } 
        ] },
        { title: "Social", links:[ 
          { name: "Instagram Feed", path: "/gallery/instagram" }, 
          { name: "Customer Looks", path: "/gallery/customers", badge: "#LMStyle" }, 
          { name: "Video Gallery", path: "/gallery/videos" } 
        ] }
      ],
      featuredImage: { url: "https://in.kalkifashion.com/cdn/shop/files/bridal-saree-menu.jpg?v=3865592706081764068", title: "Visual Stories", subtitle: "Explore our gallery", link: "/gallery/stories" }
    }
  }
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const [placeholder, setPlaceholder] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigate = useNavigate();
  // ✅ STEP 2: Get user and logout from context
  const { cart, wishlist, removeFromCart, updateQuantity, user, logout } = useShop();
  
  // ✅ STEP 3: Remove isLoggedIn state - use user directly

  const allProducts = ["Saree", "Silk Saree", "Banarasi Saree", "Kanjeevaram Saree", "Organza Saree", "Lehenga", "Kurta", "Dupatta", "Blouse", "Jewellery", "Party Wear"];
  const searchPhrases = ["What's trending for Mehendi?", "Search for Banarasi Sarees...", "Latest Bridal Lehengas...", "Designer Kurtas for Men..."];

  // ✅ Function to handle dropdown link click - navigates with URL parameter
  const handleDropdownClick = (item, linkPath) => {
    if (item.category) {
      navigate(`${linkPath}?category=${encodeURIComponent(item.category)}`);
    } else {
      navigate(linkPath);
    }
    setActiveDropdown(null);
  };

  useEffect(() => {
    const currentPhrase = searchPhrases[typingIndex];
    let timer;

    if (searchOpen) {
      if (isDeleting) {
        timer = setTimeout(() => {
          setPlaceholder(currentPhrase.substring(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        }, 50);
      } else {
        timer = setTimeout(() => {
          setPlaceholder(currentPhrase.substring(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, 100);
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        timer = setTimeout(() => setIsDeleting(true), 1500); 
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTypingIndex((prev) => (prev + 1) % searchPhrases.length);
      }
    }
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typingIndex, searchOpen]);

  // ✅ STEP 1: REMOVE old useEffect that reads localStorage - not needed anymore

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setSuggestions([]);
    } else {
      const filtered = allProducts.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [searchTerm]);

  const handleSearchSubmit = (term) => {
    if (!term.trim()) return;
    const lowerTerm = term.toLowerCase();
    setSearchOpen(false);
    setSearchTerm(""); 

    if (lowerTerm.includes("saree")) navigate("/sarees");
    else if (lowerTerm.includes("kurta")) navigate("/kurtas");
    else if (lowerTerm.includes("dupatta")) navigate("/dupattas");
    else if (lowerTerm.includes("lehenga")) navigate("/lehengas");
    else navigate(`/shop`); 
  };

  const handleUserIconClick = () => {
    if (user) {
      setShowUserMenu(false);
      navigate("/profile");
    } else {
      navigate("/account");
    }
  };

  // ✅ STEP 5: Updated logout function using context logout
  const handleLogout = () => {
    logout(); // ✅ context logout
    setShowUserMenu(false);
    navigate("/");
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const freeShippingThreshold = 999;
  const amountToFreeShipping = freeShippingThreshold - subtotal;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const trendingSearches = ["Kanjeevaram Silk", "Designer Kurtas", "Bridal Lehenga", "Organza Saree"];

  return (
    <>
      <header className={`w-full z-40 transition-all duration-300 ${scrolled ? "fixed top-0 shadow-xl" : "relative"}`}>
        
        {!scrolled && (
          <div className="bg-primary text-white">
            <div className="container flex justify-between items-center py-2 px-4">
              <div className="flex items-center gap-6">
                <a href="mailto:hello@llmshop.com" className="flex items-center gap-1.5 text-xs hover:text-orange-100 transition-colors">
                  <Mail className="w-3 h-3" /> hello@llmshop.com
                </a>
                <a href="tel:+919885222227" className="hidden sm:flex items-center gap-1.5 text-xs hover:text-orange-100 transition-colors">
                  <Phone className="w-3 h-3" /> +91 98852 22227
                </a>
              </div>
              <div className="hidden md:flex items-center gap-6 text-xs">
                <Link to="/track-order" className="flex items-center gap-1.5 hover:text-orange-100 transition-colors">Track Order</Link>
                <Link to="/store-locator" className="flex items-center gap-1.5 hover:text-orange-100 transition-colors">Store Locator</Link>
              </div>
            </div>
          </div>
        )}

        <nav className="bg-white shadow-sm relative z-50">
          <div className="container flex items-center justify-between h-20">
            
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="LM Shop" className="h-14 object-contain" />
            </Link>

            <ul className="hidden lg:flex items-center h-full">
              {navLinks.map((link) => (
                <li key={link.label} className="h-full flex items-center" onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)} onMouseLeave={() => setActiveDropdown(null)}>
                  <Link to={link.path} className="flex items-center gap-1 px-4 text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200 uppercase tracking-wide">
                    {link.label} {link.hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180 text-primary' : ''}`} />}
                  </Link>

                  {link.hasDropdown && activeDropdown === link.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-5xl bg-white shadow-2xl border border-gray-100 rounded-b-xl overflow-hidden z-50 mt-0 origin-top animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-6">
                        <div className="flex gap-6">
                          <div className="flex-1 grid grid-cols-3 gap-6">
                            {link.dropdownContent?.columns.map((column, idx) => (
                              <div key={idx}>
                                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">{column.title}</h4>
                                <ul className="space-y-2">
                                  {column.links.map((item) => (
                                    <li key={item.name}>
                                      <button 
                                        onClick={() => handleDropdownClick(item, item.path)}
                                        className="text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center gap-2 w-full text-left cursor-pointer"
                                      >
                                        {item.name}
                                        {item.badge && (
                                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                            item.badge.includes('New') || item.badge.includes('✨') ? 'bg-green-100 text-green-700' :
                                            item.badge.includes('Hot') || item.badge.includes('🔥') ? 'bg-red-100 text-red-700' :
                                            item.badge.includes('Trending') || item.badge.includes('📈') ? 'bg-blue-100 text-blue-700' :
                                            item.badge.includes('Premium') || item.badge.includes('⭐') ? 'bg-purple-100 text-purple-700' :
                                            item.badge.includes('OFF') || item.badge.includes('💰') ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-700'
                                          }`}>
                                            {item.badge}
                                          </span>
                                        )}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          {link.dropdownContent?.featuredImage && (
                            <div className="w-56 flex-shrink-0">
                              <Link to={link.dropdownContent.featuredImage.link} className="block group" onClick={() => setActiveDropdown(null)}>
                                <div className="relative rounded-lg overflow-hidden">
                                  <img src={link.dropdownContent.featuredImage.url} alt={link.dropdownContent.featuredImage.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                                    <p className="text-white/80 text-xs mb-1">{link.dropdownContent.featuredImage.subtitle}</p>
                                    <p className="text-white font-bold text-base">{link.dropdownContent.featuredImage.title}</p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-6 py-2.5 border-t border-gray-100 flex items-center justify-between">
                        <Link to={link.path} className="text-xs font-semibold text-primary hover:text-orange-600 transition-colors flex items-center gap-1" onClick={() => setActiveDropdown(null)}>
                          View All {link.label} →
                        </Link>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Premium Quality Assured
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200">
                <Search className="w-5 h-5" />
              </button>
              
              {/* ✅ STEP 3: Use 'user' instead of 'isLoggedIn' */}
              <div 
                className="relative hidden sm:flex" 
                onMouseEnter={() => user && setShowUserMenu(true)} 
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button 
                  onClick={handleUserIconClick} 
                  className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  {user && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>}
                </button>

                {/* ✅ STEP 3: Use 'user' instead of 'isLoggedIn' */}
                {user && showUserMenu && (
                  <div className="absolute right-0 top-full pt-2 w-56 z-[100]">
                    <div className="bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-100 py-3 rounded-sm animate-in fade-in zoom-in-95 duration-200">
                      {/* ✅ STEP 4: Use user?.name */}
                      <p className="px-5 mb-3 text-[15px] font-medium text-gray-800 tracking-wide">
                        Welcome {user?.name?.split(' ')[0] || "User"}!
                      </p>
                      <div className="flex flex-col">
                        <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-5 py-2.5 text-[15px] text-gray-800 hover:text-primary transition-colors">
                          <User className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} /> Account Details
                        </Link>
                        <Link to="/profile?tab=orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-5 py-2.5 text-[15px] text-gray-800 hover:text-primary transition-colors">
                          <CreditCard className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} /> Order History
                        </Link>
                        <Link to="/profile?tab=wishlist" onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-5 py-2.5 text-[15px] text-gray-800 hover:text-primary transition-colors">
                          <Heart className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} /> Wishlist
                        </Link>
                      </div>
                      <button onClick={handleLogout} className="mt-2 px-5 py-2 text-[15px] text-gray-800 hover:text-primary w-full text-left transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/profile?tab=wishlist" className="hidden sm:flex p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shadow-md">{wishlist.length}</span>}
              </Link>
              
              <button onClick={() => { if(user) setIsCartOpen(true); else navigate("/account"); }} className="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-all duration-200 relative">
                <ShoppingCart className="w-5 h-5" /> 
                {cart.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shadow-md">{totalItems}</span>}
              </button>
              
              <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[80]" onClick={() => setSearchOpen(false)} />
          <div className="fixed top-0 left-0 right-0 bg-white z-[90] shadow-xl transform transition-transform duration-300">
            <div className="container py-4"> 
              <div className="max-w-2xl mx-auto">
                <div className="relative flex items-center border-b-2 border-primary pb-2">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearchSubmit(searchTerm);
                    }}
                    className="w-full text-base text-gray-800 focus:outline-none bg-transparent"
                    autoFocus
                  />
                  <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-2">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                
                {suggestions.length > 0 && (
                  <div className="bg-white mt-1 shadow-lg border border-gray-100 rounded-b-md overflow-hidden absolute max-w-2xl w-full left-0 right-0 mx-auto z-[95]">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                        onClick={() => handleSearchSubmit(item)}
                      >
                        <Search className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-700 text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Trending:</p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button key={term} onClick={() => handleSearchSubmit(term)} className="px-3 py-1 bg-gray-50 hover:bg-orange-50 hover:text-primary text-xs text-gray-600 rounded-sm transition-colors border border-gray-100">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CART DRAWER */}
      {isCartOpen && <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setIsCartOpen(false)} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg">Shopping Bag ({cart.length})</h2>
          <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Your bag is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold line-clamp-2">{item.name}</h4>
                  <p className="text-primary font-bold mt-1">₹{(item.price || 0).toLocaleString("en-IN")}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button onClick={() => updateQuantity && updateQuantity(item.id, (item.qty || 1) - 1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                      <span className="px-3 py-1 text-xs">{item.qty || 1}</span>
                      <button onClick={() => updateQuantity && updateQuantity(item.id, (item.qty || 1) + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span> <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <button onClick={() => { setIsCartOpen(false); navigate("/checkout"); }} className="w-full bg-primary text-white py-3 font-bold rounded-full hover:bg-primary/90 transition">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[40]" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white z-[50] shadow-xl overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <img src="/logo.png" alt="LM Shop" className="h-8" />
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.path} className="block py-3 text-gray-700 border-b border-gray-100" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t">
                {user ? (
                  <>
                    <p className="text-sm font-semibold mb-2">Welcome, {user?.name?.split(' ')[0]}</p>
                    <Link to="/profile" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>My Profile</Link>
                    <Link to="/profile?tab=orders" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Order History</Link>
                    <Link to="/profile?tab=wishlist" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                    <button onClick={handleLogout} className="block py-2 text-red-500 w-full text-left">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/account" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Sign In / Register</Link>
                    <Link to="/profile?tab=wishlist" className="block py-2 text-gray-600" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}} />
    </>
  );
};
  
export default Navbar;