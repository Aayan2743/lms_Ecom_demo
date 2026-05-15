import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  UserCircle,
  LogOut,
  Menu,
  X,
  Store,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Bell,
  Search,
  Settings,
  HelpCircle,
  Zap,
  Table2,
} from "lucide-react";
import { useShop } from "../../ShopContext.jsx";

const nav = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard, badge: null },
  { to: "/admin/products", label: "Products", icon: Package, badge: null },
  { to: "/admin/products/bulk", label: "Bulk Editor", icon: Table2, badge: null },
  { to: "/admin/categories", label: "Categories", icon: FolderTree, badge: null },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, badge: null },
  { to: "/admin/profile", label: "Profile", icon: UserCircle, badge: null },
];

const AdminLayout = () => {
  const { logout, user, catalogProducts, orders, categories } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    return saved === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("admin_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Processing").length;

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
      isActive
        ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
        : "text-stone-400 hover:text-white hover:bg-white/10"
    } ${collapsed ? "justify-center px-2" : ""}`;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path.startsWith("/admin/products/bulk")) return "Bulk Editor";
    if (path.startsWith("/admin/products/new")) return "New Product";
    if (path.startsWith("/admin/products/") && path.split("/").length > 3) return "Edit Product";
    if (path === "/admin/products") return "Products";
    if (path === "/admin/categories") return "Categories";
    if (path === "/admin/orders") return "Orders";
    if (path === "/admin/profile") return "Profile";
    return "Control Panel";
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: "Admin", to: "/admin" }];
    if (path === "/admin") return crumbs;
    if (path.startsWith("/admin/products")) {
      crumbs.push({ label: "Products", to: "/admin/products" });
      if (path.includes("/bulk")) crumbs.push({ label: "Bulk Editor" });
      else if (path.includes("/new")) crumbs.push({ label: "New Product" });
      else if (path.split("/").length > 3) crumbs.push({ label: "Edit Product" });
    } else if (path.startsWith("/admin/categories")) {
      crumbs.push({ label: "Categories" });
    } else if (path.startsWith("/admin/orders")) {
      crumbs.push({ label: "Orders" });
    } else if (path.startsWith("/admin/profile")) {
      crumbs.push({ label: "Profile" });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-screen flex overflow-hidden bg-stone-950 font-body">
      {/* ─── SIDEBAR OVERLAY (mobile) ─── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col bg-stone-900 border-r border-white/5 transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        } ${collapsed && !mobileOpen ? "lg:w-20" : "lg:w-72"}`}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-white/5 flex-shrink-0 ${collapsed && !mobileOpen ? "p-4 justify-center" : "p-5 justify-between"}`}>
          <div className={`flex items-center gap-3 ${collapsed && !mobileOpen ? "justify-center" : ""}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <p className="font-heading text-base text-white leading-tight">FabricForever</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-[0.15em]">Admin Panel</p>
              </div>
            )}
          </div>
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-stone-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin ${collapsed && !mobileOpen ? "px-2" : ""}`}>
          {nav.map(({ to, end, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkCls}
              title={collapsed && !mobileOpen ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {(!collapsed || mobileOpen) && (
                <>
                  <span className="truncate">{label}</span>
                  {badge && (
                    <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </>
              )}
              {/* Active indicator dot when collapsed */}
              {collapsed && !mobileOpen && (
                <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-[.bg-gradient-to-r]:opacity-100" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Stats (only when expanded) */}
        {(!collapsed || mobileOpen) && (
          <div className="px-3 pb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Products</p>
                <p className="text-lg font-bold text-white">{catalogProducts.length}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Orders</p>
                <p className="text-lg font-bold text-white">{orders.length}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Revenue</p>
                <p className="text-sm font-bold text-white truncate">₹{revenue.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Pending</p>
                <p className="text-lg font-bold text-amber-400">{pendingOrders}</p>
              </div>
            </div>
          </div>
        )}

        {/* User & Logout */}
        <div className={`border-t border-white/5 flex-shrink-0 ${collapsed && !mobileOpen ? "p-3" : "p-4"}`}>
          {(!collapsed || mobileOpen) ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name || "Admin"}</p>
                  <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-stone-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 rounded-xl border border-white/10 text-stone-400 hover:bg-white/10 hover:text-white transition-all"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-stone-950/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-6 py-3 flex items-center gap-4 z-30">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-white/10 text-stone-400"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 text-stone-400 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.label}>
                {i > 0 && <span className="text-stone-600">/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <NavLink to={crumb.to} className="text-stone-500 hover:text-stone-300 transition-colors">
                    {crumb.label}
                  </NavLink>
                ) : (
                  <span className="text-white font-medium truncate">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/10 text-stone-400 transition-colors" title="Search">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 text-stone-400 transition-colors relative" title="Notifications">
              <Bell className="w-4 h-4" />
              {pendingOrders > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-stone-400 text-sm hover:bg-white/10 hover:text-white transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Store</span>
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-stone-950">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Scrollbar styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default AdminLayout;
