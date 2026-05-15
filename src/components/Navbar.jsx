import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, ShoppingCart, Menu, X, Phone, Mail, ChevronDown, Trash2, Check, Truck, MapPin, Package, Shield, LogOut, CreditCard } from "lucide-react"; 
import { useShop } from "../ShopContext.jsx"; 

// 🔥 NAVLINKS ARRAY - FABRIC STORE
const navLinks = [
  { 
    label: "Silk Fabrics", path: "/silk-fabrics", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "Shop by Type", links:[ 
          { name: "Kanchipuram Silk", category: "Silk", path: "/silk-fabrics", badge: "Premium" }, 
          { name: "Banarasi Silk", category: "Banarasi Silk", path: "/silk-fabrics" }, 
          { name: "Raw Silk", category: "Raw Silk", path: "/silk-fabrics", badge: "Trending" }, 
          { name: "Tussar Silk", category: "Tussar Silk", path: "/silk-fabrics" }, 
          { name: "Mysore Silk", category: "Mysore Silk", path: "/silk-fabrics" }, 
          { name: "Dola Silk", category: "Dola Silk", path: "/silk-fabrics", badge: "New" } 
        ] },
        { title: "Shop by Use", links:[ 
          { name: "Bridal Silk", category: "Wedding", path: "/silk-fabrics", badge: "🔥 Hot" }, 
          { name: "Party Wear Silk", category: "Party", path: "/silk-fabrics" }, 
          { name: "Festival Silk", category: "Festival", path: "/silk-fabrics" }, 
          { name: "Saree Blouse Silk", category: "Blouse", path: "/silk-fabrics" }, 
          { name: "Lehenga Silk", category: "Lehenga", path: "/silk-fabrics" }, 
          { name: "Dress Silk", category: "Dress", path: "/silk-fabrics" } 
        ] },
        { title: "Featured", links:[ 
          { name: "New Arrivals", category: "New Arrival", path: "/silk-fabrics", badge: "✨ New" }, 
          { name: "Bestsellers", category: "Bestseller", path: "/silk-fabrics", badge: "🏆 Best" }, 
          { name: "Trending Now", category: "Trending", path: "/silk-fabrics", badge: "📈 Trending" }, 
          { name: "Limited Edition", category: "Limited", path: "/silk-fabrics", badge: "⏰ Limited" }, 
          { name: "Under ₹999", category: "under-999", path: "/silk-fabrics", badge: "💰 Deal" } 
        ] }
      ],
      featuredImage: { url: "https://i.pinimg.com/736x/56/14/81/561481cdf44e31905ab2760bbd033202.jpg", title: "Premium Silk Collection", subtitle: "Starting at ₹599/meter", link: "/silk-fabrics" }
    }
  },
  { 
    label: "Fabrics", path: "/shop", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "Natural Fabrics", links:[ 
          { name: "Cotton Fabrics", category: "Cotton Fabrics", path: "/cotton-fabrics" }, 
          { name: "Linen Fabrics", category: "Linen Fabrics", path: "/linen-fabrics", badge: "Bestseller" }, 
          { name: "Silk Fabrics", category: "Silk Fabrics", path: "/silk-fabrics" }, 
          { name: "Wool Fabrics", path: "/wool-fabrics", badge: "Premium" }, 
          { name: "Jute Fabrics", path: "/jute-fabrics" }, 
          { name: "Hemp Fabrics", path: "/hemp-fabrics" } 
        ] },
        { title: "Synthetic Fabrics", links:[ 
          { name: "Georgette", category: "Georgette Fabrics", path: "/georgette-fabrics" }, 
          { name: "Chiffon", category: "Chiffon Fabrics", path: "/chiffon-fabrics", badge: "Trending" }, 
          { name: "Organza", category: "Organza Fabrics", path: "/organza-fabrics" }, 
          { name: "Crepe", category: "Crepe Fabrics", path: "/crepe-fabrics" } 
        ] },
        { title: "Special Fabrics", links:[ 
          { name: "Velvet Fabrics", path: "/velvet-fabrics" }, 
          { name: "Net Fabrics", path: "/net-fabrics" }, 
          { name: "Satin Fabrics", path: "/satin-fabrics" }, 
          { name: "Denim Fabrics", path: "/denim-fabrics" } 
        ] }
      ],
      featuredImage: { url: "https://i.pinimg.com/736x/c0/ff/35/c0ff355a86cc81c4382a00c33e9379d4.jpg", title: "New Collection 2026", subtitle: "Shop Now", link: "/new-arrivals" }
    }
  },
  { 
    label: "Categories", path: "/categories", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "By Fabric Type", links:[ 
          { name: "Silk Fabrics", category: "Silk Fabrics", path: "/silk-fabrics" }, 
          { name: "Cotton Fabrics", category: "Cotton Fabrics", path: "/cotton-fabrics" }, 
          { name: "Linen Fabrics", category: "Linen Fabrics", path: "/linen-fabrics" }, 
          { name: "Georgette Fabrics", category: "Georgette Fabrics", path: "/georgette-fabrics" }, 
          { name: "Organza Fabrics", category: "Organza Fabrics", path: "/organza-fabrics" } 
        ] },
        { title: "By Print/Work", links:[ 
          { name: "Block Print", category: "Block Print", path: "/cotton-fabrics", badge: "Premium" }, 
          { name: "Kalamkari", category: "Kalamkari", path: "/cotton-fabrics" }, 
          { name: "Ikat", category: "Ikat", path: "/cotton-fabrics" }, 
          { name: "Chikankari", category: "Chikankari", path: "/cotton-fabrics" }, 
          { name: "Phulkari", category: "Phulkari", path: "/cotton-fabrics" } 
        ] },
        { title: "By Occasion", links:[ 
          { name: "Wedding Fabrics", path: "/occasion/wedding" }, 
          { name: "Festival Fabrics", path: "/occasion/festival" }, 
          { name: "Party Wear Fabrics", path: "/occasion/party" }, 
          { name: "Casual Fabrics", path: "/occasion/casual" } 
        ] }
      ],
      featuredImage: { url: "https://i.pinimg.com/1200x/5c/ba/ae/5cbaaec476c9984024ed212a5138b74d.jpg", title: "Handloom Collection", subtitle: "Up to 40% OFF", link: "/cotton-fabrics" }
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
        { title: "Designer Fabrics", links:[ 
          { name: "Premium Silk", path: "/collections/premium-silk" }, 
          { name: "Bridal Fabrics", path: "/collections/bridal", badge: "👰 Bridal" }, 
          { name: "Festive Special", path: "/collections/festive" }, 
          { name: "Summer Collection", path: "/collections/summer" } 
        ] },
        { title: "Offers", links:[ 
          { name: "Clearance Sale", path: "/sale/clearance", badge: "🔥 50% OFF" }, 
          { name: "Buy 2 Get 1", path: "/offers/bogo", badge: "🎁 B2G1" }, 
          { name: "Combo Offers", path: "/offers/combo" }, 
          { name: "First Order 30% OFF", path: "/offers/first-order", badge: "🆕 New User" } 
        ] }
      ],
      featuredImage: { url: "https://i.pinimg.com/736x/38/de/80/38de8036daff2e913e5769671989e6ad.jpg", title: "Limited Time Offer", subtitle: "Flat 30% OFF", link: "/offers" }
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
          { name: "Fabric Stories", path: "/community/stories" }, 
          { name: "Lookbook", path: "/community/lookbook" }, 
          { name: "Share Your Creation", path: "/community/share", badge: "📸 Share" } 
        ] }
      ],
      featuredImage: { url: "https://i.pinimg.com/1200x/c1/70/8c/c1708cb21db4bcc9f47b7d696a3686a6.jpg", title: "Customer Favorites", subtitle: "See what's trending", link: "/reviews/favorites" }
    }
  },
  { 
    label: "Gallery", path: "/gallery", hasDropdown: true,
    dropdownContent: {
      columns:[
        { title: "Collections", links:[ 
          { name: "Silk Gallery", path: "/gallery/silk" }, 
          { name: "Cotton Gallery", path: "/gallery/cotton" }, 
          { name: "Linen Gallery", path: "/gallery/linen" }, 
          { name: "Designer Fabrics", path: "/gallery/designer", badge: "🌟 Trending" } 
        ] },
        { title: "Behind the Scenes", links:[ 
          { name: "Weaving Process", path: "/gallery/weaving" }, 
          { name: "Fabric Making", path: "/gallery/fabric" }, 
          { name: "Design Process", path: "/gallery/design" } 
        ] },
        { title: "Social", links:[ 
          { name: "Instagram Feed", path: "/gallery/instagram" }, 
          { name: "Customer Creations", path: "/gallery/customers", badge: "#FabricForever" }, 
          { name: "Video Gallery", path: "/gallery/videos" } 
        ] }
      ],
      featuredImage: { url: "https://i.pinimg.com/1200x/3e/94/bf/3e94bfa75c58740cdae2975e9ff98e81.jpg", title: "Visual Stories", subtitle: "Explore our gallery", link: "/gallery/stories" }
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
  const { cart, wishlist, removeFromCart, updateQuantity, user, logout } = useShop();

  const allProducts = ["Silk Fabric", "Cotton Fabric", "Linen Fabric", "Georgette", "Organza", "Chiffon", "Velvet", "Crepe", "Kalamkari", "Block Print", "Ikat"];
  const searchPhrases = ["Search for Silk Fabrics...", "Find Cotton Handlooms...", "Latest Linen Collection...", "Premium Organza Fabrics..."];

  // ✅ Function to handle dropdown link click - navigates with URL parameter
  const handleDropdownClick = (item, linkPath) => {
    if (item.category) {
      navigate(`${linkPath}?category=${encodeURIComponent(item.category)}`);
    } else {
      navigate(linkPath);
    }
    setActiveDropdown(null);
  };

  // ✅ Typing animation for search placeholder
  useEffect(() => {
    const currentPhrase = searchPhrases[typingIndex];
    let timeout;
    
    if (!isDeleting && charIndex <= currentPhrase.length) {
      timeout = setTimeout(() => {
        setPlaceholder(currentPhrase.substring(0, charIndex));
        setCharIndex(prev => prev + 1);
      }, 80);
    } else if (isDeleting && charIndex >= 0) {
      timeout = setTimeout(() => {
        setPlaceholder(currentPhrase.substring(0, charIndex));
        setCharIndex(prev => prev - 1);
      }, 40);
    } else if (charIndex > currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (charIndex < 0) {
      setIsDeleting(false);
      setTypingIndex((prev) => (prev + 1) % searchPhrases.length);
      setCharIndex(0);
    }
    
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, typingIndex]);

  // ✅ Search suggestions
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = allProducts.filter(p => 
        p.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  // ✅ Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-trigger') && !e.target.closest('.dropdown-content')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/shop?search=${encodeURIComponent(suggestion)}`);
    setSearchOpen(false);
    setSearchTerm("");
    setSuggestions([]);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:flex bg-foreground text-primary-foreground/70 text-xs py-2 px-4 justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +91 98852 22227</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> hello@fabricforever.in</span>
        </div>
        <div className="flex items-center gap-4">
          <span>🚚 Free Shipping on orders above ₹999</span>
          <span className="border-l border-primary-foreground/20 pl-4">✨ Premium Quality Fabrics</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 bg-card border-b transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xl md:text-2xl font-heading font-bold text-foreground tracking-tight">
                Fabric<span className="text-primary">Forever</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <div 
                  key={link.label}
                  className="relative dropdown-trigger"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.path}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-muted/50"
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                  </Link>

                  {/* Dropdown */}
                  {link.hasDropdown && activeDropdown === link.label && (
                    <div 
                      className="dropdown-content absolute top-full left-0 mt-1 bg-card border rounded-xl shadow-2xl p-6 min-w-[700px] z-50 animate-fade-up"
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="flex gap-8">
                        <div className="flex-1 grid grid-cols-3 gap-6">
                          {link.dropdownContent.columns.map((col) => (
                            <div key={col.title}>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{col.title}</h4>
                              <ul className="space-y-2">
                                {col.links.map((item) => (
                                  <li key={item.name}>
                                    <button
                                      onClick={() => handleDropdownClick(item, link.path)}
                                      className="text-sm text-foreground/70 hover:text-primary transition-colors flex items-center gap-2 w-full text-left"
                                    >
                                      {item.name}
                                      {item.badge && (
                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">{item.badge}</span>
                                      )}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        {link.dropdownContent.featuredImage && (
                          <Link 
                            to={link.dropdownContent.featuredImage.link}
                            className="w-[200px] flex-shrink-0 relative rounded-lg overflow-hidden group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <img 
                              src={link.dropdownContent.featuredImage.url} 
                              alt={link.dropdownContent.featuredImage.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4">
                              <p className="text-white text-sm font-semibold">{link.dropdownContent.featuredImage.title}</p>
                              <p className="text-white/70 text-xs">{link.dropdownContent.featuredImage.subtitle}</p>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-full hover:bg-muted"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-full hover:bg-muted relative">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* User */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-full hover:bg-muted"
                >
                  <User className="w-5 h-5" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-xl shadow-xl p-2 z-50 animate-fade-up">
                    {user ? (
                      <>
                        <div className="px-3 py-2 border-b mb-1">
                          <p className="text-sm font-semibold">{user.name || "User"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg" onClick={() => setShowUserMenu(false)}>
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link to="/order-history" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg" onClick={() => setShowUserMenu(false)}>
                          <Package className="w-4 h-4" /> Orders
                        </Link>
                        <button 
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg w-full text-left text-destructive"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/signin" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg" onClick={() => setShowUserMenu(false)}>
                          Sign In
                        </Link>
                        <Link to="/register" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg" onClick={() => setShowUserMenu(false)}>
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 text-foreground/70 hover:text-primary transition-colors rounded-full hover:bg-muted relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t bg-card animate-fade-up">
            <div className="container mx-auto px-4 py-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={placeholder || "Search fabrics..."}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                {searchTerm && (
                  <button 
                    type="button"
                    onClick={() => { setSearchTerm(""); setSuggestions([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </form>
              {suggestions.length > 0 && (
                <div className="mt-2 bg-card border rounded-lg shadow-lg p-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-card animate-fade-up max-h-[70vh] overflow-y-auto">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    to={link.path}
                    className="flex items-center justify-between py-3 px-2 text-sm font-medium text-foreground/80 hover:text-primary border-b border-border/50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <Link to="/signin" className="block py-2 px-2 text-sm text-foreground/70 hover:text-primary" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="block py-2 px-2 text-sm text-foreground/70 hover:text-primary" onClick={() => setMobileOpen(false)}>Register</Link>
              </div>
            </div>
          </div>
        )}

        {/* Cart Sidebar */}
        {isCartOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)} />
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-2xl animate-slide-right">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-heading text-lg font-semibold">Shopping Cart ({cartCount})</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex flex-col h-[calc(100%-130px)] overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm">Add some beautiful fabrics!</p>
                    <Link to="/shop" onClick={() => setIsCartOpen(false)} className="mt-4 text-primary text-sm font-semibold hover:underline">
                      Browse Fabrics →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => updateQuantity(item.id, (item.qty || 1) - 1)} className="p-0.5 hover:bg-muted rounded">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium">{item.qty || 1}</span>
                            <button onClick={() => updateQuantity(item.id, (item.qty || 1) + 1)} className="p-0.5 hover:bg-muted rounded">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-semibold">₹{(item.price * (item.qty || 1)).toLocaleString()}</span>
                            <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
                  <Link 
                    to="/cart" 
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full bg-primary text-primary-foreground text-center py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                  >
                    View Cart & Checkout
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;