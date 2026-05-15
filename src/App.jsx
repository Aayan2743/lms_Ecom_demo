import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"; 
import { ShopProvider } from "./ShopContext.jsx";

// --> HEADER, FOOTER AUR COMPONENTS IMPORT <--
import Navbar from "./components/Navbar.jsx"; 
import Footer from "./components/Footer.jsx"; 

// 🔥 YAHAN IMPORT PATH THEEK KIYA HAI (Kyunki file bahar hai)
import ProtectedRoute from "./ProtectedRoute.jsx"; 

// --> YAHAN AAPKA NAYA VIDEO POPUP IMPORT KIYA HAI <--
import VideoPopup from "./pages/VideoPopup.jsx"; 
import FloatingVideoWidget from "./FloatingVideoWidget.jsx"; 

// --> PAGES IMPORT <--
import Index from "./pages/Index.jsx";
import Shop from "./pages/Shop.jsx";
import FabricCategoryPage from "./pages/FabricCategoryPage.jsx";
import Categories from "./pages/Categories.jsx";
import Featured from "./pages/Featured.jsx";
import Reviews from "./pages/Reviews.jsx";
import Gallery from "./pages/Gallery.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Register from "./pages/Register.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import Faq from "./pages/Faq.jsx";
import Checkout from "./pages/Checkout.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import AdminProtectedRoute from "./AdminProtectedRoute.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminProductEditor from "./pages/admin/AdminProductEditor.jsx";
import AdminBulkEditor from "./pages/admin/AdminBulkEditor.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";

const StorefrontShell = ({ children }) => {
  const location = useLocation();
  const hide = location.pathname.startsWith("/admin");
  return (
    <div className="flex flex-col min-h-screen relative">
      {!hide && <Navbar />}
      <div className="flex-grow">{children}</div>
      {!hide && <Footer />}
      {!hide && <VideoPopup />}
      {!hide && <FloatingVideoWidget />}
    </div>
  );
};

const App = () => {
  return (
    <ShopProvider>
      <BrowserRouter>
        <StorefrontShell>
          <main className="flex-grow">
            <Routes>
              {/* 🟢 PUBLIC PAGES (Bina login ke koi bhi dekh sakta hai) */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/products" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/featured" element={<Featured />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/silk-fabrics" element={<FabricCategoryPage categoryKey="silk-fabrics" />} />
              <Route path="/cotton-fabrics" element={<FabricCategoryPage categoryKey="cotton-fabrics" />} />
              <Route path="/linen-fabrics" element={<FabricCategoryPage categoryKey="linen-fabrics" />} />
              <Route path="/georgette-fabrics" element={<FabricCategoryPage categoryKey="georgette-fabrics" />} />
              <Route path="/organza-fabrics" element={<FabricCategoryPage categoryKey="organza-fabrics" />} />
              <Route path="/chiffon-fabrics" element={<FabricCategoryPage categoryKey="chiffon-fabrics" />} />
              <Route path="/velvet-fabrics" element={<FabricCategoryPage categoryKey="velvet-fabrics" />} />
              <Route path="/crepe-fabrics" element={<FabricCategoryPage categoryKey="crepe-fabrics" />} />
              {/* Legacy redirects */}
              <Route path="/sarees" element={<FabricCategoryPage categoryKey="silk-fabrics" />} />
              <Route path="/fabrics" element={<FabricCategoryPage categoryKey="cotton-fabrics" />} />
              <Route path="/kurtas" element={<FabricCategoryPage categoryKey="linen-fabrics" />} />
              <Route path="/dupattas" element={<FabricCategoryPage categoryKey="organza-fabrics" />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/account" element={<SignIn />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/register" element={<Register />} />
              <Route path="/faq" element={<Faq />} />
              
              {/* 🔴 PROTECTED PAGES (Sirf login ke baad hi dikhenge) */}
              <Route 
                path="/wishlist" 
                element={<ProtectedRoute><Wishlist /></ProtectedRoute>} 
              />
              <Route 
                path="/track-order" 
                element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} 
              />
              <Route 
                path="/profile" 
                element={<ProtectedRoute><Profile /></ProtectedRoute>} 
              />
              <Route 
                path="/checkout" 
                element={<ProtectedRoute><Checkout /></ProtectedRoute>} 
              />
              
              {/* 🔥 ORDER HISTORY - Redirects to Profile with tab parameter */}
              <Route 
                path="/orders" 
                element={<ProtectedRoute><Profile /></ProtectedRoute>} 
              />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products/new" element={<AdminProductEditor />} />
                <Route path="products/:id/edit" element={<AdminProductEditor />} />
                <Route path="products/bulk" element={<AdminBulkEditor />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
              
              {/* ⚠️ 404 PAGE - MUST BE LAST */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </StorefrontShell>
      </BrowserRouter>
    </ShopProvider>
  );
};

export default App;