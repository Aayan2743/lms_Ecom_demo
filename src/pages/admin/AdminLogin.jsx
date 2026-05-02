import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowLeft, Shield, AlertCircle } from "lucide-react";
import { useShop } from "../../ShopContext.jsx";
import { matchAdminCredential } from "../../adminAuth.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, user, isLoggedIn } = useShop();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn() && user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const match = matchAdminCredential(email, password);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (match) {
        login({
          email: match.email,
          name: "Admin",
          role: "admin",
        });
        navigate("/admin", { replace: true });
      } else {
        setError("Invalid admin email or password.");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-sm mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Storefront
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-stone-200/80">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-2xl text-stone-900">Admin</h1>
              <p className="font-body text-sm text-stone-500">LM Showroom dashboard</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-400" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="admin@lmshowroom.com"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-stone-400" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </form>

          <p className="mt-8 text-xs text-center text-stone-400 leading-relaxed">
            Demo accounts:{" "}
            <code className="text-stone-600 bg-stone-100 px-1 rounded">admin@lmshowroom.com</code> /{" "}
            <code className="text-stone-600 bg-stone-100 px-1 rounded">admin123</code>
            {" · "}
            <code className="text-stone-600 bg-stone-100 px-1 rounded">test@admin.com</code> /{" "}
            <code className="text-stone-600 bg-stone-100 px-1 rounded">123456</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
