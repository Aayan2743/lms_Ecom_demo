import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useShop } from "../../ShopContext.jsx";

const nav = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/profile", label: "Profile", icon: UserCircle },
];

const AdminLayout = () => {
  const { logout, user } = useShop();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary text-white shadow-md shadow-primary/25"
        : "text-stone-600 hover:bg-stone-100"
    }`;

  return (
    <div className="min-h-screen bg-stone-100 flex font-body">
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-200 flex flex-col transform transition-transform duration-200 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-stone-100 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="font-heading text-lg text-stone-900">LM Showroom</p>
            <p className="text-xs text-stone-500 uppercase tracking-wider">Admin</p>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-stone-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {nav.map(({ to, end, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className={linkCls} onClick={() => setSidebarOpen(false)}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-100 bg-white flex-shrink-0">
          <p className="text-xs text-stone-500 truncate mb-2 px-1">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          aria-label="Close overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-stone-200 px-4 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-stone-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="font-heading text-lg text-stone-800 truncate flex-1 text-center lg:text-left">
            Control panel
          </h2>
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 whitespace-nowrap"
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">View store</span>
          </a>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
