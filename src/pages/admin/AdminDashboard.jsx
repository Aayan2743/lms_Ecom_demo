import React from "react";
import { Link } from "react-router-dom";
import { Package, FolderTree, ShoppingBag, ArrowRight } from "lucide-react";
import { useShop } from "../../ShopContext.jsx";

const StatCard = ({ title, value, hint, icon: Icon, to }) => {
  const inner = (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <ArrowRight className="w-5 h-5 text-stone-300" />
      </div>
      <p className="text-3xl font-heading text-stone-900">{value}</p>
      <p className="text-sm font-medium text-stone-700 mt-1">{title}</p>
      {hint && <p className="text-xs text-stone-500 mt-2">{hint}</p>}
    </div>
  );
  return to ? <Link to={to} className="block h-full">{inner}</Link> : inner;
};

const AdminDashboard = () => {
  const { catalogProducts, categories, orders } = useShop();
  const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl text-stone-900">Overview</h1>
        <p className="text-stone-500 text-sm mt-1">
          Manage catalogue, collections, and customer orders from one place.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Products" value={catalogProducts.length} hint="Listed on the storefront" icon={Package} to="/admin/products" />
        <StatCard title="Categories" value={categories.length} hint="Browse filters use these labels" icon={FolderTree} to="/admin/categories" />
        <StatCard title="Orders" value={orders.length} hint="Includes demo + checkout orders" icon={ShoppingBag} to="/admin/orders" />
        <StatCard title="Recorded revenue" value={`₹${revenue.toLocaleString("en-IN")}`} hint="Sum of order totals stored locally" icon={ShoppingBag} to="/admin/orders" />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <h2 className="font-heading text-lg text-stone-900 mb-4">Recent orders</h2>
        <ul className="divide-y divide-stone-100">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="py-3 flex flex-wrap gap-2 justify-between items-center text-sm">
              <span className="font-medium text-stone-800">{o.id}</span>
              <span className="text-stone-500">{new Date(o.date).toLocaleDateString("en-IN")}</span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs">{o.status}</span>
              <span className="text-stone-800">₹{Number(o.total).toLocaleString("en-IN")}</span>
            </li>
          ))}
          {orders.length === 0 && (
            <li className="py-8 text-center text-stone-500 text-sm">No orders yet.</li>
          )}
        </ul>
        {orders.length > 5 && (
          <Link to="/admin/orders" className="inline-block mt-4 text-sm text-primary font-medium hover:underline">
            View all orders
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
