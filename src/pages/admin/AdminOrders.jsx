import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  ShoppingBag,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  User,
  Hash,
  ArrowUpDown,
  Eye,
  Layers,
  TrendingUp,
  AlertCircle,
  Download,
  MoreHorizontal,
  FileText,
  Printer,
} from "lucide-react";
import { useShop } from "../../ShopContext.jsx";

const STATUSES = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusConfig = {
  Processing: {
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Clock,
    dot: "bg-amber-400",
    label: "Processing",
  },
  Shipped: {
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: Truck,
    dot: "bg-blue-400",
    label: "Shipped",
  },
  Delivered: {
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
    dot: "bg-emerald-400",
    label: "Delivered",
  },
  Cancelled: {
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: XCircle,
    dot: "bg-red-400",
    label: "Cancelled",
  },
};

const paymentIcons = {
  Card: CreditCard,
  COD: Banknote,
  UPI: SmartphoneIcon,
  "Net Banking": CreditCard,
};

function SmartphoneIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useShop();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  // ─── Computed stats ───
  const stats = useMemo(() => {
    const total = orders.length;
    const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const pending = orders.filter((o) => o.status === "Processing").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    const avgOrderValue = total > 0 ? revenue / total : 0;
    return { total, revenue, pending, delivered, cancelled, avgOrderValue };
  }, [orders]);

  // ─── Filter & sort ───
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerEmail?.toLowerCase().includes(q) ||
          o.customerPhone?.includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date") {
        cmp = new Date(a.date) - new Date(b.date);
      } else if (sortBy === "total") {
        cmp = (Number(a.total) || 0) - (Number(b.total) || 0);
      } else if (sortBy === "customer") {
        cmp = (a.customerName || "").localeCompare(b.customerName || "");
      } else if (sortBy === "status") {
        cmp = (a.status || "").localeCompare(b.status || "");
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [orders, statusFilter, search, sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentIcon = (method) => {
    const Icon = paymentIcons[method] || CreditCard;
    return Icon;
  };

  const generateInvoiceHTML = (order) => {
    const invoiceNumber = order.id || `INV-${Date.now()}`;
    const invoiceDate = formatDate(order.date);
    const subtotal = order.items?.reduce((s, it) => s + (it.qty || 1) * Number(it.price || 0), 0) || Number(order.total) || 0;
    const taxRate = 5;
    const taxAmount = Math.round(subtotal * taxRate / 100);
    const total = subtotal + taxAmount;
    const itemsRows = (order.items || []).map((item, i) =>
      `<tr><td>${i + 1}</td><td>${item.name || 'Product'}</td><td style="text-align:center">${item.qty || 1}</td><td style="text-align:right;font-family:monospace">₹${Number(item.price || 0).toLocaleString('en-IN')}</td><td style="text-align:right;font-family:monospace">₹${((item.qty || 1) * Number(item.price || 0)).toLocaleString('en-IN')}</td></tr>`
    ).join('');

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Invoice ${invoiceNumber} - FabricForever</title><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;color:#1c1917;background:#fff;padding:40px}
.inv{max-width:800px;margin:0 auto;border:2px solid #e7e5e4;border-radius:16px;padding:40px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #e7e5e4}
.logo h1{font-size:24px;font-weight:800;color:#1c1917;letter-spacing:-.5px}
.logo p{font-size:12px;color:#78716c;margin-top:2px}
.ititle{text-align:right}.ititle h2{font-size:28px;font-weight:800;color:#1c1917;letter-spacing:-.5px}
.ititle .num{font-size:14px;color:#78716c;margin-top:4px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px}
.blk h3{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a8a29e;margin-bottom:8px}
.blk p{font-size:14px;color:#44403c;line-height:1.6}.blk .nm{font-weight:700;color:#1c1917}
table{width:100%;border-collapse:collapse;margin-bottom:32px}
th{background:#fafaf9;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#78716c;border-bottom:2px solid #e7e5e4}
td{padding:14px 16px;font-size:14px;color:#44403c;border-bottom:1px solid #f5f5f4}
tr:last-child td{border-bottom:2px solid #e7e5e4}
.tots{margin-left:auto;width:300px}.tots .row{display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#44403c}
.tots .row.ttl{border-top:2px solid #e7e5e4;margin-top:8px;padding-top:12px;font-size:18px;font-weight:800;color:#1c1917}
.ftr{margin-top:40px;padding-top:24px;border-top:1px solid #e7e5e4;text-align:center;font-size:12px;color:#a8a29e;line-height:1.8}
.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
.badge-Delivered{background:#ecfdf5;color:#059669}.badge-Processing{background:#fffbeb;color:#d97706}
.badge-Shipped{background:#eff6ff;color:#2563eb}.badge-Cancelled{background:#fef2f2;color:#dc2626}
@media print{body{padding:0}.inv{border:none;border-radius:0;padding:20px}}
</style></head><body><div class="inv">
<div class="hdr"><div class="logo"><h1>FabricForever</h1><p>Premium Fabric Store</p><p style="margin-top:8px;font-size:12px;color:#78716c">123 Textile Street, Fashion District<br>Mumbai, Maharashtra 400001<br>GSTIN: 27AABCF1234F1Z5</p></div>
<div class="ititle"><h2>INVOICE</h2><p class="num">#${invoiceNumber}</p><p style="font-size:12px;color:#78716c;margin-top:4px">Date: ${invoiceDate}</p><p style="margin-top:8px"><span class="badge badge-${order.status || 'Processing'}">${order.status || 'Processing'}</span></p></div></div>
<div class="grid"><div class="blk"><h3>Bill To</h3><p class="nm">${order.customerName || 'Customer'}</p><p>${order.customerEmail || ''}</p><p>${order.customerPhone || ''}</p>${order.address ? `<p style="margin-top:4px">${order.address}</p>` : ''}</div>
<div class="blk"><h3>Payment</h3><p>Method: <strong>${order.payment || 'N/A'}</strong></p><p>Order ID: <span style="font-family:monospace">${invoiceNumber}</span></p><p>Date: ${invoiceDate}</p></div></div>
<table><thead><tr><th>#</th><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Rate (₹)</th><th style="text-align:right">Amount (₹)</th></tr></thead><tbody>${itemsRows}</tbody></table>
<div class="tots"><div class="row"><span>Subtotal</span><span style="font-family:monospace">₹${subtotal.toLocaleString('en-IN')}</span></div><div class="row"><span>GST (${taxRate}%)</span><span style="font-family:monospace">₹${taxAmount.toLocaleString('en-IN')}</span></div><div class="row ttl"><span>Total</span><span style="font-family:monospace">₹${total.toLocaleString('en-IN')}</span></div></div>
<div class="ftr"><p>Thank you for shopping with FabricForever!</p><p>This is a computer-generated invoice. For queries, contact support@fabricforever.com</p><p style="margin-top:8px">Terms: Payment due within 15 days • Subject to Mumbai jurisdiction</p></div>
</div></body></html>`;
  };

  const downloadInvoice = (order) => {
    const html = generateInvoiceHTML(order);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.id || Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printInvoice = (order) => {
    const html = generateInvoiceHTML(order);
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-white">Orders</h1>
          <p className="text-sm text-stone-400 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-stone-300 text-sm font-medium hover:bg-white/10 transition-all">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-stone-500 mt-0.5">Total Orders</p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">Total Revenue</p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
          <p className="text-xs text-stone-500 mt-0.5">Pending</p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.delivered}</p>
          <p className="text-xs text-stone-500 mt-0.5">Delivered</p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
          <p className="text-xs text-stone-500 mt-0.5">Cancelled</p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            ₹{Math.round(stats.avgOrderValue).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">Avg. Order</p>
        </div>
      </div>

      {/* ─── Filters Bar ─── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, email or phone…"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 bg-white/5 rounded-xl p-1">
          {STATUSES.map((s) => {
            const cfg = statusConfig[s];
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? s === "All"
                      ? "bg-white/10 text-white"
                      : `${cfg.color} border`
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {s === "All" ? "All" : cfg.label}
                {s !== "All" && (
                  <span className="ml-1.5 opacity-60">
                    {orders.filter((o) => o.status === s).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          {[
            { key: "date", label: "Date" },
            { key: "total", label: "Amount" },
            { key: "customer", label: "Customer" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === key
                  ? "bg-white/10 text-white"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              {label}
              {sortBy === key && (
                <ArrowUpDown className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Orders List ─── */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-stone-600" />
            </div>
            <p className="text-stone-400 font-medium">
              {search || statusFilter !== "All"
                ? "No orders match your filters"
                : "No orders yet"}
            </p>
            <p className="text-xs text-stone-600 mt-1">
              {search || statusFilter !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Orders will appear here when customers place them"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.Processing;
            const StatusIcon = cfg.icon;
            const PaymentIcon = getPaymentIcon(order.payment);
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all"
              >
                {/* ─── Order Row ─── */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="flex flex-wrap items-center gap-4 p-4 md:p-5 cursor-pointer select-none"
                >
                  {/* Order ID & Date */}
                  <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-xl ${cfg.color.replace("text-", "bg-").replace("/10", "/15").replace("border-" + cfg.dot.replace("bg-", "").replace("/20", ""), "")} flex items-center justify-center`}>
                      <StatusIcon className={`w-5 h-5 ${cfg.color.split(" ")[1]}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {order.id}
                      </p>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-stone-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-stone-200 truncate font-medium">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-stone-500 truncate">
                        {order.customerEmail}
                      </p>
                    </div>
                  </div>

                  {/* Items count */}
                  <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-400 flex-shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                  </div>

                  {/* Payment */}
                  <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-400 flex-shrink-0">
                    <PaymentIcon className="w-3.5 h-3.5" />
                    {order.payment}
                  </div>

                  {/* Total */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-white">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all ${cfg.color}`}
                    >
                      {STATUSES.filter((s) => s !== "All").map((s) => {
                        const sc = statusConfig[s];
                        return (
                          <option key={s} value={s} className="bg-stone-900 text-stone-200">
                            {sc.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Expand chevron */}
                  <div className="flex-shrink-0 text-stone-600">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* ─── Expanded Detail ─── */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-white/[0.01]">
                    <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Customer Details */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Customer Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-stone-500 flex-shrink-0" />
                            <span className="text-stone-300">{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-stone-500 flex-shrink-0" />
                            <span className="text-stone-400">{order.customerEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-stone-500 flex-shrink-0" />
                            <span className="text-stone-400">{order.customerPhone}</span>
                          </div>
                          {order.address && (
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
                              <span className="text-stone-400">{order.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Order Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Hash className="w-4 h-4 text-stone-500 flex-shrink-0" />
                            <span className="text-stone-400">Order ID:</span>
                            <span className="text-stone-200 font-mono text-xs">{order.id}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-stone-500 flex-shrink-0" />
                            <span className="text-stone-400">Placed:</span>
                            <span className="text-stone-200">{formatDateTime(order.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <PaymentIcon className="w-4 h-4 text-stone-500 flex-shrink-0" />
                            <span className="text-stone-400">Payment:</span>
                            <span className="text-stone-200">{order.payment}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <IndianRupee className="w-4 h-4 text-stone-500 flex-shrink-0" />
                            <span className="text-stone-400">Total:</span>
                            <span className="text-stone-200 font-semibold">
                              ₹{Number(order.total).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* Invoice Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadInvoice(order); }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary-foreground text-xs font-medium hover:bg-primary/20 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Download Invoice
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); printInvoice(order); }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-stone-300 text-xs font-medium hover:bg-white/10 transition-all"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Print
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3 md:col-span-2 lg:col-span-1">
                        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Items ({order.items?.length || 0})
                        </h4>
                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <Package className="w-4 h-4 text-stone-500" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm text-stone-200 truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-stone-500">
                                      Qty: {item.qty} × ₹{Number(item.price).toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm font-semibold text-white flex-shrink-0">
                                  ₹{((item.qty || 1) * Number(item.price || 0)).toLocaleString("en-IN")}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-stone-600">No items listed</p>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="border-t border-white/5 px-4 md:px-5 py-4">
                      <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                        Order Timeline
                      </h4>
                      <div className="flex items-center gap-0">
                        {[
                          { label: "Placed", done: true, date: formatDate(order.date) },
                          {
                            label: "Confirmed",
                            done: order.status !== "Cancelled",
                            date: order.status !== "Cancelled" ? formatDate(order.date) : null,
                          },
                          {
                            label: "Shipped",
                            done: ["Shipped", "Delivered"].includes(order.status),
                            date: ["Shipped", "Delivered"].includes(order.status)
                              ? "In transit"
                              : null,
                          },
                          {
                            label: "Delivered",
                            done: order.status === "Delivered",
                            date: order.status === "Delivered" ? "Completed" : null,
                          },
                        ].map((step, i, arr) => (
                          <React.Fragment key={step.label}>
                            <div className="flex flex-col items-center flex-1">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  step.done
                                    ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30"
                                    : order.status === "Cancelled" && i > 0
                                    ? "bg-red-500/10 text-red-400 border-2 border-red-500/20"
                                    : "bg-white/5 text-stone-600 border-2 border-white/5"
                                }`}
                              >
                                {step.done ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : order.status === "Cancelled" && i > 0 ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  i + 1
                                )}
                              </div>
                              <p
                                className={`text-[10px] mt-1.5 font-medium text-center ${
                                  step.done ? "text-stone-300" : "text-stone-600"
                                }`}
                              >
                                {step.label}
                              </p>
                              {step.date && (
                                <p className="text-[9px] text-stone-600 text-center mt-0.5">
                                  {step.date}
                                </p>
                              )}
                            </div>
                            {i < arr.length - 1 && (
                              <div
                                className={`h-0.5 flex-1 -mt-5 transition-all ${
                                  arr[i + 1].done
                                    ? "bg-emerald-500/30"
                                    : order.status === "Cancelled"
                                    ? "bg-red-500/20"
                                    : "bg-white/5"
                                }`}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ─── Summary footer ─── */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between text-xs text-stone-600 pt-2">
          <p>
            Showing {filteredOrders.length} of {orders.length} orders
            {statusFilter !== "All" && ` • Filtered by "${statusFilter}"`}
          </p>
          <p>
            Total: ₹
            {filteredOrders
              .reduce((s, o) => s + (Number(o.total) || 0), 0)
              .toLocaleString("en-IN")}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
