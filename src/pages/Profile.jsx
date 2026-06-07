import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Heart, 
  Package, Clock, Settings, LogOut, ChevronRight, Gift, Percent,
  Shield, CreditCard, ShoppingBag, Star, Award, TrendingUp,
  ArrowRight, Sparkles, Truck, RefreshCw, AlertCircle, CheckCircle,
  Eye, Download, Filter, MoreHorizontal, X, Plus, Minus, Search,
  Home, Briefcase, Trash2, Check, Circle, Upload, LogIn,
  Wallet, History, Smartphone, Globe, Lock, Trash, BadgeCheck,
  Clock3, TrendingDown, IndianRupee, Tag, BarChart3, Activity,
  ChevronDown, SlidersHorizontal, Copy, Info, HelpCircle
} from "lucide-react";
import { useShop } from "../ShopContext.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist, cart, addToCart, removeFromWishlist, toggleWishlist, user, logout, orders: contextOrders } = useShop();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gender: "",
    dob: ""
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [tempAddress, setTempAddress] = useState({
    type: "Home",
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    landmark: ""
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const [settings, setSettings] = useState([
    { id: "email", label: "Email Notifications", desc: "Receive order updates and promotions", enabled: true, icon: Mail },
    { id: "sms", label: "SMS Updates", desc: "Get order updates via text message", enabled: false, icon: Smartphone },
    { id: "2fa", label: "Two-Factor Authentication", desc: "Add an extra layer of security", enabled: false, icon: Shield },
    { id: "newsletter", label: "Newsletter", desc: "Weekly fashion tips and exclusive deals", enabled: true, icon: Globe },
    { id: "order_updates", label: "Order Status Alerts", desc: "Real-time push notifications for orders", enabled: true, icon: Bell },
  ]);

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "Visa", last4: "4521", expiry: "12/26", isDefault: true, brand: "visa" },
    { id: 2, type: "UPI", last4: "9885", expiry: "", isDefault: false, brand: "upi", upiId: "priya@okhdfc" },
  ]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ type: "card", cardNumber: "", name: "", expiry: "", cvv: "", upiId: "" });

  // Recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem("llmShop_recentlyViewed");
    return saved ? JSON.parse(saved) : [];
  });

  // Points history
  const [pointsHistory, setPointsHistory] = useState([
    { id: 1, action: "Purchase - LM-240315", points: 450, date: "15 Mar 2024", type: "earned" },
    { id: 2, action: "Purchase - LM-240228", points: 500, date: "28 Feb 2024", type: "earned" },
    { id: 3, action: "Purchase - LM-240210", points: 1250, date: "10 Feb 2024", type: "earned" },
    { id: 4, action: "Redeemed - 10% OFF coupon", points: -500, date: "05 Feb 2024", type: "redeemed" },
    { id: 5, action: "Purchase - LM-240125", points: 625, date: "25 Jan 2024", type: "earned" },
    { id: 6, action: "Welcome Bonus", points: 125, date: "01 Jan 2024", type: "earned" },
  ]);

  // URL parameter reading
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["overview", "orders", "wishlist", "addresses", "rewards", "settings", "payments"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Sync user data
  useEffect(() => {
    setUserData(user);
    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        gender: user.gender || "",
        dob: user.dob || ""
      });
      if (user.profilePhoto) {
        setProfilePhotoPreview(user.profilePhoto);
      }
    } else {
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      if (rememberedEmail) {
        const demoUser = {
          name: "Priya Sharma",
          email: rememberedEmail,
          phone: "+91 98852 22227",
          address: "123, Fashion Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          gender: "Female",
          dob: "1995-08-15",
          memberSince: "2023-06-10"
        };
        setUserData(demoUser);
      }
    }
  }, [user]);

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        setProfilePhotoPreview(photoData);
        const updatedUser = { ...userData, profilePhoto: photoData };
        localStorage.setItem("lms_api_user", JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setIsUploading(false);
        setSuccessMsg("Profile photo updated!");
        setTimeout(() => setSuccessMsg(""), 3000);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setErrorMsg("Image must be under 5MB");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhotoPreview(null);
    const updatedUser = { ...userData, profilePhoto: null };
    localStorage.setItem("lms_api_user", JSON.stringify(updatedUser));
    setUserData(updatedUser);
    setSuccessMsg("Photo removed");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editForm.name.length < 3) {
      setErrorMsg("Name must be at least 3 characters");
      return;
    }
    const updatedUser = { ...userData, ...editForm };
    localStorage.setItem("lms_api_user", JSON.stringify(updatedUser));
    setUserData(updatedUser);
    setIsEditing(false);
    setSuccessMsg("Profile updated!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("rememberedEmail");
    navigate("/");
  };

  const [orders, setOrders] = useState([
    { id: "LM-240315", date: "15 Mar 2024", status: "Delivered", items: "Banarasi Silk Saree", quantity: 1, amount: 8999, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/red-organza-saree-with-florals-and-cutdana-border-sg297625-2.jpg?v=1748335622", paymentMethod: "Credit Card", tracking: "TRK987654321", deliveredDate: "20 Mar 2024" },
    { id: "LM-240228", date: "28 Feb 2024", status: "Processing", items: "Designer Kurta Set", quantity: 2, amount: 9998, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/sg187123_1.jpg?v=1744183756", paymentMethod: "UPI", tracking: "TRK123456789", deliveredDate: null },
    { id: "LM-240210", date: "10 Feb 2024", status: "Delivered", items: "Wedding Lehenga", quantity: 1, amount: 24999, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/gold_toned_tissue_saree-sg157605_14.jpg?v=1755163097", paymentMethod: "Debit Card", tracking: "TRK456789123", deliveredDate: "16 Feb 2024" },
    { id: "LM-240125", date: "25 Jan 2024", status: "Shipped", items: "Silk Organza Saree", quantity: 1, amount: 12499, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/light_blue_crushed_tissue_saree-sg286746-9_8.jpg?v=1747484543", paymentMethod: "Net Banking", tracking: "TRK789123456", deliveredDate: null },
    { id: "LM-240102", date: "02 Jan 2024", status: "Cancelled", items: "Cotton Kurta Set", quantity: 1, amount: 3499, image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/sg187123_1.jpg?v=1744183756", paymentMethod: "COD", tracking: null, deliveredDate: null },
  ]);

  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, type: "Home", name: "Priya Sharma", address: "123, Fashion Street, Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400001", phone: "+91 98852 22227", landmark: "Near Bandra Station", isDefault: true },
    { id: 2, type: "Office", name: "Priya Sharma", address: "456, Corporate Park, BKC", city: "Mumbai", state: "Maharashtra", pincode: "400051", phone: "+91 98852 22227", landmark: "Opposite Trident Hotel", isDefault: false },
  ]);

  const handleAddAddress = () => {
    if (!tempAddress.name || !tempAddress.address || !tempAddress.city || !tempAddress.pincode || !tempAddress.phone) {
      setErrorMsg("Please fill all required fields");
      return;
    }
    const newId = Math.max(...savedAddresses.map(a => a.id), 0) + 1;
    const newAddress = { ...tempAddress, id: newId, isDefault: savedAddresses.length === 0 };
    setSavedAddresses([...savedAddresses, newAddress]);
    setShowAddressModal(false);
    setTempAddress({ type: "Home", name: "", address: "", city: "", state: "", pincode: "", phone: "", landmark: "" });
    setSuccessMsg("Address added!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleUpdateAddress = () => {
    if (!tempAddress.name || !tempAddress.address || !tempAddress.city || !tempAddress.pincode || !tempAddress.phone) {
      setErrorMsg("Please fill all required fields");
      return;
    }
    setSavedAddresses(savedAddresses.map(addr => 
      addr.id === editingAddress.id ? { ...tempAddress, id: addr.id, isDefault: addr.isDefault } : addr
    ));
    setShowAddressModal(false);
    setEditingAddress(null);
    setTempAddress({ type: "Home", name: "", address: "", city: "", state: "", pincode: "", phone: "", landmark: "" });
    setSuccessMsg("Address updated!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter(addr => addr.id !== id));
    setSuccessMsg("Address deleted!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const setDefaultAddress = (id) => {
    setSavedAddresses(savedAddresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
    setSuccessMsg("Default address updated!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleReorder = (order) => {
    const product = {
      id: order.id,
      name: order.items,
      price: order.amount / order.quantity,
      image: order.image,
      qty: order.quantity
    };
    addToCart(product);
    setSuccessMsg("Added to cart!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleTrackOrder = (orderId) => navigate(`/track-order?order=${orderId}`);
  const handleDownloadInvoice = (orderId) => {
    setSuccessMsg(`Invoice for ${orderId} downloading...`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  // Payment methods handlers
  const handleAddPayment = () => {
    if (newPayment.type === "card" && (!newPayment.cardNumber || !newPayment.name || !newPayment.expiry)) {
      setErrorMsg("Please fill all card details");
      return;
    }
    if (newPayment.type === "upi" && !newPayment.upiId) {
      setErrorMsg("Please enter UPI ID");
      return;
    }
    const newId = Math.max(...paymentMethods.map(p => p.id), 0) + 1;
    const method = newPayment.type === "card" 
      ? { id: newId, type: "Card", last4: newPayment.cardNumber.slice(-4), expiry: newPayment.expiry, isDefault: false, brand: "card" }
      : { id: newId, type: "UPI", last4: "", expiry: "", isDefault: false, brand: "upi", upiId: newPayment.upiId };
    setPaymentMethods([...paymentMethods, method]);
    setShowPaymentModal(false);
    setNewPayment({ type: "card", cardNumber: "", name: "", expiry: "", cvv: "", upiId: "" });
    setSuccessMsg("Payment method added!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
    setSuccessMsg("Payment method removed!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const setDefaultPayment = (id) => {
    setPaymentMethods(paymentMethods.map(p => ({ ...p, isDefault: p.id === id })));
    setSuccessMsg("Default payment method updated!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Filter orders
  const statusFilters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.items.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "All" || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Compute stats
  const totalSpent = orders.filter(o => o.status !== "Cancelled").reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "Delivered").length;
  const totalPoints = pointsHistory.reduce((sum, p) => sum + p.points, 0);
  const memberSince = userData?.memberSince || "2023-06-10";

  const menuItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package, count: totalOrders },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlist.length },
    { id: "addresses", label: "Addresses", icon: MapPin, count: savedAddresses.length },
    { id: "payments", label: "Payment Methods", icon: CreditCard, count: paymentMethods.length },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Bell icon component (inline since not imported above)
  const Bell = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  );

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-stone-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-stone-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      
      {/* Simple Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-1 text-xs text-stone-400">
          <Link to="/" className="hover:text-stone-600 transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600">My Account</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        
        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* LEFT SIDEBAR - Profile Card + Menu */}
          <div className="md:w-72 flex-shrink-0">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-stone-100 p-5 mb-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center shadow-md overflow-hidden">
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-heading font-bold text-white">
                        {userData.name?.charAt(0)?.toUpperCase() || "P"}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleCameraClick}
                    className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md hover:bg-stone-50 transition-all border border-stone-200"
                  >
                    {isUploading ? (
                      <div className="w-2.5 h-2.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-3 h-3 text-stone-500" />
                    )}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleProfilePhotoChange} accept="image/*" className="hidden" />
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-stone-800 truncate">{userData.name}</h2>
                  <p className="text-xs text-stone-500 truncate">{userData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">Gold Member</span>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-[10px] text-stone-400 hover:text-primary transition"
                    >
                      <Edit3 className="w-2.5 h-2.5 inline" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[10px] text-stone-400">
                <Calendar className="w-3 h-3" />
                <span>Member since {new Date(memberSince).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>

            {/* Stats Mini Cards */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white rounded-lg border border-stone-100 p-2.5 text-center">
                <ShoppingBag className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                <p className="text-sm font-bold text-stone-800">{totalOrders}</p>
                <p className="text-[9px] text-stone-400">Orders</p>
              </div>
              <div className="bg-white rounded-lg border border-stone-100 p-2.5 text-center">
                <Heart className="w-3.5 h-3.5 text-rose-400 mx-auto mb-1" />
                <p className="text-sm font-bold text-stone-800">{wishlist.length}</p>
                <p className="text-[9px] text-stone-400">Wishlist</p>
              </div>
              <div className="bg-white rounded-lg border border-stone-100 p-2.5 text-center">
                <Gift className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
                <p className="text-sm font-bold text-stone-800">{totalPoints.toLocaleString()}</p>
                <p className="text-[9px] text-stone-400">Points</p>
              </div>
              <div className="bg-white rounded-lg border border-stone-100 p-2.5 text-center">
                <IndianRupee className="w-3.5 h-3.5 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-bold text-stone-800">₹{(totalSpent/1000).toFixed(1)}k</p>
                <p className="text-[9px] text-stone-400">Spent</p>
              </div>
            </div>

            {/* Vertical Menu */}
            <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                    activeTab === item.id 
                      ? 'bg-primary/5 border-l-2 border-l-primary' 
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-primary' : 'text-stone-500'}`} />
                    <span className={`text-sm ${activeTab === item.id ? 'text-primary font-medium' : 'text-stone-700'}`}>
                      {item.label}
                    </span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-xs text-stone-400">{item.count}</span>
                  )}
                </button>
              ))}
              
              {/* Sign Out Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 border-t border-stone-100 text-red-500 hover:bg-red-50 transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 bg-white rounded-xl border border-stone-100 p-5">
            
            {/* Edit Profile Form */}
            {isEditing && (
              <div className="mb-5 pb-4 border-b border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-stone-800">Edit Profile</h3>
                  {profilePhotoPreview && (
                    <button onClick={handleRemovePhoto} className="text-xs text-red-500 hover:underline">Remove Photo</button>
                  )}
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Gender</label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={editForm.dob}
                        onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">City</label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="border border-stone-300 text-stone-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-stone-50 transition">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Success/Error Messages */}
            {successMsg && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2.5 mb-4">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <p className="text-green-600 text-xs">{successMsg}</p>
              </div>
            )}
            {errorMsg && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-2.5 mb-4">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <p className="text-red-600 text-xs">{errorMsg}</p>
              </div>
            )}

            {/* ==================== OVERVIEW TAB ==================== */}
            {activeTab === "overview" && (
              <div>
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <button onClick={() => setActiveTab("orders")} className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition">
                    <Package className="w-3 h-3" /> My Orders
                  </button>
                  <button onClick={() => setActiveTab("wishlist")} className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-rose-100 transition">
                    <Heart className="w-3 h-3" /> Wishlist ({wishlist.length})
                  </button>
                  <button onClick={() => setActiveTab("addresses")} className="flex items-center gap-1.5 bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-stone-200 transition">
                    <MapPin className="w-3 h-3" /> Addresses
                  </button>
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-stone-200 transition">
                    <Edit3 className="w-3 h-3" /> Edit Profile
                  </button>
                </div>

                {/* Account Information */}
                <h3 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Account Information
                </h3>
                <div className="bg-stone-50 rounded-lg p-4 mb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    <div className="flex justify-between sm:flex-col sm:gap-0.5">
                      <span className="text-stone-500 text-xs">Full Name</span>
                      <span className="text-stone-800 font-medium">{userData.name}</span>
                    </div>
                    <div className="flex justify-between sm:flex-col sm:gap-0.5">
                      <span className="text-stone-500 text-xs">Email</span>
                      <span className="text-stone-600">{userData.email}</span>
                    </div>
                    {userData.phone && (
                      <div className="flex justify-between sm:flex-col sm:gap-0.5">
                        <span className="text-stone-500 text-xs">Phone</span>
                        <span className="text-stone-600">{userData.phone}</span>
                      </div>
                    )}
                    {userData.gender && (
                      <div className="flex justify-between sm:flex-col sm:gap-0.5">
                        <span className="text-stone-500 text-xs">Gender</span>
                        <span className="text-stone-600">{userData.gender}</span>
                      </div>
                    )}
                    {userData.dob && (
                      <div className="flex justify-between sm:flex-col sm:gap-0.5">
                        <span className="text-stone-500 text-xs">Date of Birth</span>
                        <span className="text-stone-600">{new Date(userData.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    )}
                    {userData.city && (
                      <div className="flex justify-between sm:flex-col sm:gap-0.5">
                        <span className="text-stone-500 text-xs">Location</span>
                        <span className="text-stone-600">{userData.city}{userData.state ? `, ${userData.state}` : ''}</span>
                      </div>
                    )}
                    <div className="flex justify-between sm:flex-col sm:gap-0.5">
                      <span className="text-stone-500 text-xs">Member Since</span>
                      <span className="text-stone-600">{new Date(memberSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                
                {/* Shopping Stats */}
                <h3 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Shopping Stats
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-3 text-center border border-primary/10">
                    <IndianRupee className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold text-stone-800">₹{totalSpent.toLocaleString()}</p>
                    <p className="text-[10px] text-stone-500">Total Spent</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center border border-green-100">
                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-stone-800">{completedOrders}</p>
                    <p className="text-[10px] text-stone-500">Completed</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 text-center border border-amber-100">
                    <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-stone-800">12</p>
                    <p className="text-[10px] text-stone-500">Reviews</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center border border-purple-100">
                    <Award className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-stone-800">Gold</p>
                    <p className="text-[10px] text-stone-500">Tier</p>
                  </div>
                </div>

                {/* Recent Orders Summary */}
                <h3 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-primary" /> Recent Orders
                </h3>
                <div className="space-y-2 mb-5">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={order.image} alt={order.items} className="w-10 h-12 rounded object-cover" />
                        <div>
                          <p className="text-xs font-medium text-stone-800 line-clamp-1">{order.items}</p>
                          <p className="text-[10px] text-stone-400">{order.id} • {order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          order.status === "Delivered" ? "bg-green-100 text-green-600" : 
                          order.status === "Processing" ? "bg-amber-100 text-amber-600" : 
                          order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                          "bg-blue-100 text-blue-600"
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-xs font-bold text-stone-700 mt-0.5">₹{order.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setActiveTab("orders")} className="w-full text-center text-xs text-primary hover:underline py-1">
                    View All Orders →
                  </button>
                </div>

                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" /> Recently Viewed
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {recentlyViewed.slice(0, 6).map((item, idx) => (
                        <Link key={idx} to={`/product/${item.id}`} className="flex-shrink-0 w-24 group">
                          <div className="w-24 h-28 rounded-lg overflow-hidden bg-stone-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          </div>
                          <p className="text-[10px] text-stone-600 mt-1 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] font-bold text-stone-800">₹{item.price?.toLocaleString()}</p>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ==================== ORDERS TAB ==================== */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-sm font-semibold text-stone-800">All Orders ({filteredOrders.length})</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-primary w-44"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Filter Pills */}
                <div className="flex gap-1.5 mb-4 flex-wrap">
                  {statusFilters.map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`text-xs px-3 py-1 rounded-full transition font-medium ${
                        orderStatusFilter === status
                          ? 'bg-primary text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {status}
                      {status !== "All" && (
                        <span className="ml-1 opacity-70">({orders.filter(o => o.status === status).length})</span>
                      )}
                    </button>
                  ))}
                </div>
                
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-stone-500 text-sm">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="border border-stone-100 rounded-lg p-3 hover:border-stone-200 transition">
                        <div className="flex gap-3">
                          <img src={order.image} alt={order.items} className="w-16 h-20 rounded-lg object-cover" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-2 flex-wrap">
                              <div>
                                <p className="text-sm font-medium text-stone-800">{order.items}</p>
                                <p className="text-xs text-stone-400 mt-0.5">{order.id} • {order.date}</p>
                                <p className="text-xs font-bold text-primary mt-1">Qty: {order.quantity} • ₹{order.amount.toLocaleString()}</p>
                              </div>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                order.status === "Delivered" ? "bg-green-100 text-green-600" : 
                                order.status === "Processing" ? "bg-amber-100 text-amber-600" : 
                                order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                                "bg-blue-100 text-blue-600"
                              }`}>
                                {order.status}
                              </span>
                            </div>

                            {/* Order Progress Bar */}
                            {order.status !== "Cancelled" && (
                              <div className="mt-2 mb-2">
                                <div className="flex items-center gap-1">
                                  {["Confirmed", "Processing", "Shipped", "Delivered"].map((step, idx) => {
                                    const stepIdx = ["Confirmed", "Processing", "Shipped", "Delivered"].indexOf(order.status);
                                    const isCompleted = idx <= stepIdx;
                                    const isCurrent = idx === stepIdx;
                                    return (
                                      <React.Fragment key={step}>
                                        <div className="flex items-center gap-0.5">
                                          <div className={`w-2 h-2 rounded-full ${
                                            isCompleted ? (isCurrent ? 'bg-primary ring-2 ring-primary/30' : 'bg-primary') : 'bg-stone-200'
                                          }`}></div>
                                          <span className={`text-[8px] ${isCompleted ? 'text-primary font-medium' : 'text-stone-400'}`}>
                                            {step}
                                          </span>
                                        </div>
                                        {idx < 3 && (
                                          <div className={`flex-1 h-0.5 rounded ${idx < stepIdx ? 'bg-primary' : 'bg-stone-200'}`}></div>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Order Meta */}
                            <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-1">
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-2.5 h-2.5" /> {order.paymentMethod}
                              </span>
                              {order.tracking && (
                                <span className="flex items-center gap-1">
                                  <Truck className="w-2.5 h-2.5" /> {order.tracking}
                                </span>
                              )}
                              {order.deliveredDate && (
                                <span className="flex items-center gap-1 text-green-500">
                                  <CheckCircle className="w-2.5 h-2.5" /> Delivered {order.deliveredDate}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-3 mt-2">
                              {order.status !== "Cancelled" && (
                                <button onClick={() => handleTrackOrder(order.id)} className="text-xs text-primary hover:underline">Track Order</button>
                              )}
                              <button onClick={() => handleDownloadInvoice(order.id)} className="text-xs text-stone-500 hover:text-primary flex items-center gap-1">
                                <Download className="w-3 h-3" /> Invoice
                              </button>
                              {order.status === "Delivered" && (
                                <button onClick={() => handleReorder(order)} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition">
                                  Buy Again
                                </button>
                              )}
                              {order.status === "Processing" && (
                                <button className="text-xs text-red-400 hover:text-red-600 transition">Cancel</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== WISHLIST TAB ==================== */}
            {activeTab === "wishlist" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-stone-800">Saved Items ({wishlist.length})</h3>
                  {wishlist.length > 0 && (
                    <button className="text-xs text-stone-400 hover:text-primary transition flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3" /> Sort
                    </button>
                  )}
                </div>
                {wishlist.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-stone-500 text-sm mb-2">Your wishlist is empty</p>
                    <Link to="/sarees" className="text-sm text-primary hover:underline">Browse Collection</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wishlist.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 border border-stone-100 rounded-lg hover:border-stone-200 transition group">
                        <Link to={`/product/${item.id}`} className="flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-16 h-20 rounded-lg object-cover" />
                        </Link>
                        <div className="flex-1">
                          <Link to={`/product/${item.id}`}>
                            <h4 className="text-sm font-medium text-stone-800 hover:text-primary transition">{item.name}</h4>
                          </Link>
                          {item.category && <p className="text-[10px] text-stone-400 mt-0.5">{item.category}</p>}
                          <p className="text-sm font-bold text-primary mt-1">₹{item.price?.toLocaleString()}</p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-[10px] text-stone-400 line-through">₹{item.originalPrice?.toLocaleString()}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => { addToCart(item); setSuccessMsg("Added to cart!"); setTimeout(() => setSuccessMsg(""), 2000); }}
                              className="text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary/90 transition"
                            >
                              Add to Cart
                            </button>
                            <button 
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-xs text-stone-400 hover:text-red-500 transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== ADDRESSES TAB ==================== */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-stone-800">Saved Addresses ({savedAddresses.length})</h3>
                  <button 
                    onClick={() => { setEditingAddress(null); setTempAddress({ type: "Home", name: userData?.name || "", address: "", city: "", state: "", pincode: "", phone: userData?.phone || "", landmark: "" }); setShowAddressModal(true); }}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className={`p-3 border rounded-lg relative ${addr.isDefault ? 'border-primary/30 bg-primary/5' : 'border-stone-100 hover:border-stone-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {addr.type === "Home" ? <Home className="w-3.5 h-3.5 text-primary" /> : <Briefcase className="w-3.5 h-3.5 text-primary" />}
                          <span className="text-xs font-medium text-stone-600">{addr.type}</span>
                          {addr.isDefault && <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Default</span>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingAddress(addr); setTempAddress(addr); setShowAddressModal(true); }} className="p-1 hover:bg-stone-100 rounded">
                            <Edit3 className="w-3 h-3 text-stone-400" />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-1 hover:bg-stone-100 rounded">
                            <Trash2 className="w-3 h-3 text-stone-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-stone-800">{addr.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{addr.address}</p>
                      {addr.landmark && <p className="text-xs text-stone-400">Landmark: {addr.landmark}</p>}
                      <p className="text-xs text-stone-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{addr.phone}</p>
                      {!addr.isDefault && (
                        <button onClick={() => setDefaultAddress(addr.id)} className="text-xs text-primary mt-2 hover:underline">
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== PAYMENT METHODS TAB ==================== */}
            {activeTab === "payments" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-stone-800">Payment Methods ({paymentMethods.length})</h3>
                  <button 
                    onClick={() => { setNewPayment({ type: "card", cardNumber: "", name: "", expiry: "", cvv: "", upiId: "" }); setShowPaymentModal(true); }}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add New
                  </button>
                </div>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-stone-500 text-sm">No saved payment methods</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((pm) => (
                      <div key={pm.id} className={`p-4 border rounded-lg flex items-center justify-between ${pm.isDefault ? 'border-primary/30 bg-primary/5' : 'border-stone-100'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            pm.brand === 'visa' ? 'bg-blue-100' : 
                            pm.brand === 'upi' ? 'bg-green-100' : 'bg-stone-100'
                          }`}>
                            <CreditCard className={`w-5 h-5 ${
                              pm.brand === 'visa' ? 'text-blue-600' : 
                              pm.brand === 'upi' ? 'text-green-600' : 'text-stone-600'
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-stone-800">
                              {pm.type} {pm.last4 ? `****${pm.last4}` : ''}
                            </p>
                            <p className="text-xs text-stone-400">
                              {pm.upiId ? pm.upiId : `Expires ${pm.expiry}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {pm.isDefault && <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Default</span>}
                          {!pm.isDefault && (
                            <button onClick={() => setDefaultPayment(pm.id)} className="text-[10px] text-primary hover:underline">Set Default</button>
                          )}
                          <button onClick={() => handleDeletePayment(pm.id)} className="p-1 hover:bg-stone-100 rounded">
                            <Trash2 className="w-3 h-3 text-stone-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Security Note */}
                <div className="mt-4 p-3 bg-stone-50 rounded-lg flex items-start gap-2">
                  <Shield className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-stone-500">Your payment information is encrypted and stored securely. We never share your card details with anyone.</p>
                </div>
              </div>
            )}

            {/* ==================== REWARDS TAB ==================== */}
            {activeTab === "rewards" && (
              <div>
                {/* Points Summary */}
                <div className="bg-gradient-to-r from-primary/10 to-amber-50 rounded-xl p-5 mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Gold Tier</span>
                      </div>
                      <p className="text-3xl font-bold text-stone-800">{totalPoints.toLocaleString()}</p>
                      <p className="text-xs text-stone-500">Reward Points</p>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">65%</span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1">to Platinum</p>
                    </div>
                  </div>
                  {/* Tier Progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-stone-400 mb-1">
                      <span>Gold</span>
                      <span>Platinum (5,000 pts)</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Redeemable Rewards */}
                <h4 className="text-sm font-semibold text-stone-800 mb-3">Redeem Rewards</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { title: "10% OFF", desc: "On next purchase", points: "500 points", icon: Percent, color: "bg-blue-50 text-blue-600" },
                    { title: "Free Shipping", desc: "Above ₹999", points: "200 points", icon: Truck, color: "bg-green-50 text-green-600" },
                    { title: "₹500 Voucher", desc: "Min ₹2,500", points: "1000 points", icon: Tag, color: "bg-purple-50 text-purple-600" },
                  ].map((reward, idx) => (
                    <div key={idx} className="bg-stone-50 rounded-lg p-3 text-center border border-stone-100 hover:border-primary/30 transition cursor-pointer">
                      <div className={`w-8 h-8 rounded-full ${reward.color} flex items-center justify-center mx-auto mb-2`}>
                        <reward.icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-stone-800">{reward.title}</h4>
                      <p className="text-xs text-stone-500 mt-1">{reward.desc}</p>
                      <p className="text-xs text-primary mt-2 font-medium">{reward.points}</p>
                      <button className="mt-2 text-[10px] bg-primary text-white px-3 py-1 rounded-full hover:bg-primary/90 transition">
                        Redeem
                      </button>
                    </div>
                  ))}
                </div>

                {/* Points History */}
                <h4 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" /> Points History
                </h4>
                <div className="space-y-2">
                  {pointsHistory.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${entry.type === 'earned' ? 'bg-green-500' : 'bg-red-400'}`}></div>
                        <div>
                          <p className="text-xs font-medium text-stone-700">{entry.action}</p>
                          <p className="text-[10px] text-stone-400">{entry.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${entry.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {entry.points > 0 ? '+' : ''}{entry.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== SETTINGS TAB ==================== */}
            {activeTab === "settings" && (
              <div>
                {/* Notification Settings */}
                <h3 className="text-sm font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" /> Notification Preferences
                </h3>
                <div className="space-y-3 mb-6">
                  {settings.map((setting, idx) => (
                    <div key={setting.id} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
                      <div className="flex items-start gap-3">
                        <setting.icon className="w-4 h-4 text-stone-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-stone-800">{setting.label}</p>
                          <p className="text-xs text-stone-500 mt-0.5">{setting.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const updated = [...settings];
                          updated[idx].enabled = !updated[idx].enabled;
                          setSettings(updated);
                          setSuccessMsg(`${setting.label} ${!setting.enabled ? 'enabled' : 'disabled'}`);
                          setTimeout(() => setSuccessMsg(""), 2000);
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                          setting.enabled ? 'bg-primary' : 'bg-stone-300'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${
                          setting.enabled ? 'left-5' : 'left-0.5'
                        }`}></span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Security Section */}
                <h3 className="text-sm font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" /> Security
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lock className="w-4 h-4 text-stone-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-stone-800">Change Password</p>
                        <p className="text-xs text-stone-500">Update your account password</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline flex-shrink-0">Change</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-4 h-4 text-stone-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-stone-800">Connected Devices</p>
                        <p className="text-xs text-stone-500">Manage devices logged into your account</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline flex-shrink-0">Manage</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Activity className="w-4 h-4 text-stone-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-stone-800">Login Activity</p>
                        <p className="text-xs text-stone-500">View your recent login history</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline flex-shrink-0">View</button>
                  </div>
                </div>

                {/* Preferences */}
                <h3 className="text-sm font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" /> Preferences
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Globe className="w-4 h-4 text-stone-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-stone-800">Language</p>
                        <p className="text-xs text-stone-500">English (India)</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline flex-shrink-0">Change</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <IndianRupee className="w-4 h-4 text-stone-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-stone-800">Currency</p>
                        <p className="text-xs text-stone-500">INR (₹)</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline flex-shrink-0">Change</button>
                  </div>
                </div>

                {/* Danger Zone */}
                <h3 className="text-sm font-semibold text-red-500 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Danger Zone
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-start gap-3">
                      <Trash2 className="w-4 h-4 text-red-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-600">Delete Account</p>
                        <p className="text-xs text-red-400">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <button className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex-shrink-0">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[100]" onClick={() => { setShowAddressModal(false); setEditingAddress(null); }}></div>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-base font-semibold text-stone-800">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h3>
                <button onClick={() => { setShowAddressModal(false); setEditingAddress(null); }} className="p-1 hover:bg-stone-100 rounded-full transition">
                  <X className="w-4 h-4 text-stone-400" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Address Type</label>
                  <div className="flex gap-2">
                    {["Home", "Office", "Other"].map(type => (
                      <button 
                        key={type}
                        onClick={() => setTempAddress({ ...tempAddress, type })}
                        className={`px-3 py-1.5 text-sm border rounded-lg transition ${
                          tempAddress.type === type 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'border-stone-200 text-stone-600 hover:border-primary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    value={tempAddress.name}
                    onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                    placeholder="Full name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Phone *</label>
                  <input 
                    type="tel" 
                    value={tempAddress.phone}
                    onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                    placeholder="Phone number" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Address *</label>
                  <textarea 
                    value={tempAddress.address}
                    onChange={(e) => setTempAddress({ ...tempAddress, address: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                    rows="2" 
                    placeholder="House/Flat No., Street, Area"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Landmark (Optional)</label>
                  <input 
                    type="text" 
                    value={tempAddress.landmark}
                    onChange={(e) => setTempAddress({ ...tempAddress, landmark: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                    placeholder="Nearby landmark" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">City *</label>
                    <input 
                      type="text" 
                      value={tempAddress.city}
                      onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                      placeholder="City" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Pincode *</label>
                    <input 
                      type="text" 
                      value={tempAddress.pincode}
                      onChange={(e) => setTempAddress({ ...tempAddress, pincode: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                      placeholder="Pincode" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">State</label>
                  <input 
                    type="text" 
                    value={tempAddress.state}
                    onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                    placeholder="State" 
                  />
                </div>
              </div>
              <div className="p-4 border-t border-stone-100 flex gap-2 sticky bottom-0 bg-white">
                <button onClick={() => { setShowAddressModal(false); setEditingAddress(null); }} className="flex-1 border border-stone-200 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition">
                  Cancel
                </button>
                <button onClick={editingAddress ? handleUpdateAddress : handleAddAddress} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                  {editingAddress ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[100]" onClick={() => setShowPaymentModal(false)}></div>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <h3 className="text-base font-semibold text-stone-800">Add Payment Method</h3>
                <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-stone-100 rounded-full transition">
                  <X className="w-4 h-4 text-stone-400" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Payment Type</label>
                  <div className="flex gap-2">
                    {[{ value: "card", label: "Credit/Debit Card" }, { value: "upi", label: "UPI" }].map(opt => (
                      <button 
                        key={opt.value}
                        onClick={() => setNewPayment({ ...newPayment, type: opt.value })}
                        className={`px-3 py-1.5 text-sm border rounded-lg transition ${
                          newPayment.type === opt.value 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'border-stone-200 text-stone-600 hover:border-primary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {newPayment.type === "card" ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Card Number</label>
                      <input 
                        type="text" 
                        value={newPayment.cardNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                        placeholder="1234 5678 9012 3456" 
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Cardholder Name</label>
                      <input 
                        type="text" 
                        value={newPayment.name}
                        onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                        placeholder="Name on card" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">Expiry</label>
                        <input 
                          type="text" 
                          value={newPayment.expiry}
                          onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                          placeholder="MM/YY" 
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">CVV</label>
                        <input 
                          type="password" 
                          value={newPayment.cvv}
                          onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                          placeholder="***" 
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">UPI ID</label>
                    <input 
                      type="text" 
                      value={newPayment.upiId}
                      onChange={(e) => setNewPayment({ ...newPayment, upiId: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                      placeholder="username@okhdfc" 
                    />
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-stone-100 flex gap-2">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 border border-stone-200 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition">
                  Cancel
                </button>
                <button onClick={handleAddPayment} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                  Add Method
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}} />
    </div>
  );
};

export default Profile;