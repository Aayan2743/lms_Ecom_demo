import React from "react";
import { Link } from "react-router-dom";
import { Package, FolderTree, ShoppingBag, ArrowRight, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useShop } from "../../ShopContext.jsx";

const StatCard = ({ title, value, hint, icon: Icon, to, accent }) => {
  const inner = (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 hover:bg-white/[0.07] transition-all h-full flex flex-col group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`p-2.5 rounded-xl ${accent || "bg-primary/20"}`}>
          <Icon className={`w-6 h-6 ${accent ? "text-inherit" : "text-primary"}`} />
        </div>
        <ArrowRight className="w-5 h-5 text-stone-600 group-hover:text-stone-400 transition-colors" />
      </div>
      <p className="text-3xl font-heading text-white">{value}</p>
      <p className="text-sm font-medium text-stone-400 mt-1">{title}</p>
      {hint && <p className="text-xs text-stone-500 mt-2">{hint}</p>}
    </div>
  );
  return to ? <Link to={to} className="block h-full">{inner}</Link> : inner;
};

const AdminDashboard = () => {
  const { catalogProducts, categories, orders } = useShop();
  const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Processing").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl text-white">Overview</h1>
        <p className="text-stone-400 text-sm mt-1">
          Manage catalogue, collections, and customer orders from one place.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Products" value={catalogProducts.length} hint="Listed on the storefront" icon={Package} to="/admin/products" />
        <StatCard title="Categories" value={categories.length} hint="Browse filters use these labels" icon={FolderTree} to="/admin/categories" />
        <StatCard title="Orders" value={orders.length} hint="Includes demo + checkout orders" icon={ShoppingBag} to="/admin/orders" />
        <StatCard title="Recorded revenue" value={`₹${revenue.toLocaleString("en-IN")}`} hint="Sum of order totals stored locally" icon={DollarSign} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg text-white">Recent orders</h2>
            {pendingOrders > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {pendingOrders} pending
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="py-2 px-3 font-medium text-stone-500 text-xs uppercase tracking-wider">Order</th>
                  <th className="py-2 px-3 font-medium text-stone-500 text-xs uppercase tracking-wider">Date</th>
                  <th className="py-2 px-3 font-medium text-stone-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="py-2 px-3 font-medium text-stone-500 text-xs uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="py-3 px-3 font-medium text-stone-300">{o.id}</td>
                    <td className="py-3 px-3 text-stone-500">{new Date(o.date).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        o.status === "Delivered" ? "bg-green-400/10 text-green-400" :
                        o.status === "Processing" ? "bg-amber-400/10 text-amber-400" :
                        o.status === "Shipped" ? "bg-blue-400/10 text-blue-400" :
                        "bg-red-400/10 text-red-400"
                      }`}>{o.status}</span>
                    </td>
                    <td className="py-3 px-3 text-right text-stone-300 font-medium">₹{Number(o.total).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <p className="py-8 text-center text-stone-500 text-sm">No orders yet.</p>
          )}
          {orders.length > 5 && (
            <Link to="/admin/orders" className="inline-block mt-4 text-sm text-primary hover:text-primary/80 transition-colors">
              View all orders →
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-medium text-stone-400 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Total Products</span>
                <span className="text-lg font-bold text-white">{catalogProducts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Categories</span>
                <span className="text-lg font-bold text-white">{categories.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Total Revenue</span>
                <span className="text-lg font-bold text-primary">₹{revenue.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Pending Orders</span>
                <span className="text-lg font-bold text-amber-400">{pendingOrders}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-white">Need help?</h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Use the sidebar to manage products, categories, and orders. All changes are saved locally in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
