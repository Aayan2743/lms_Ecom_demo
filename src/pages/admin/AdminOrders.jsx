import React, { useState } from "react";
import { useShop } from "../../ShopContext.jsx";

const statuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useShop();
  const [q, setQ] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.id?.toLowerCase().includes(q.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(q.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-stone-900">Orders</h1>
        <p className="text-sm text-stone-500 mt-1">Statuses update here only (demo persistence in this browser).</p>
      </div>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by ID, customer, or email…"
        className="w-full max-w-md rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
      />

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left border-b border-stone-200">
                <th className="py-3 px-4 font-medium text-stone-600">Order</th>
                <th className="py-3 px-4 font-medium text-stone-600">Customer</th>
                <th className="py-3 px-4 font-medium text-stone-600">Payment</th>
                <th className="py-3 px-4 font-medium text-stone-600">Total</th>
                <th className="py-3 px-4 font-medium text-stone-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((o) => (
                <tr key={o.id} className="align-top hover:bg-stone-50/80">
                  <td className="py-4 px-4">
                    <p className="font-medium text-stone-900">{o.id}</p>
                    <p className="text-xs text-stone-500">{new Date(o.date).toLocaleString("en-IN")}</p>
                    {o.items?.length > 0 && (
                      <ul className="mt-2 text-xs text-stone-600 space-y-0.5 max-w-[220px]">
                        {o.items.slice(0, 3).map((it, i) => (
                          <li key={i}>
                            {it.name} × {it.qty}
                          </li>
                        ))}
                        {o.items.length > 3 && <li className="text-stone-400">+ more</li>}
                      </ul>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-stone-800">{o.customerName}</p>
                    <p className="text-xs text-stone-500">{o.customerEmail}</p>
                    <p className="text-xs text-stone-500">{o.customerPhone}</p>
                    {o.address && <p className="text-xs text-stone-400 mt-1 max-w-xs">{o.address}</p>}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">{o.payment}</td>
                  <td className="py-4 px-4 whitespace-nowrap font-medium">
                    ₹{Number(o.total).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="p-12 text-center text-stone-500 text-sm">No matching orders.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
