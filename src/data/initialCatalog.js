/** Canonical storefront catalog loaded into ShopContext / localStorage. */

export const INITIAL_PRODUCTS = [
  { id: 1001, name: "Royal Kanchipuram Silk Saree", price: 12499, oldPrice: 15999, category: "Sarees", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/sg350720-1_35585178-39ab-467b-84a2-5375c1e85f2a.jpg?v=1763113684", rating: 4.9, reviews: 156, badge: "Bestseller", fabric: "Silk", stockLeft: 5, colors: ["#8B0000", "#C41E3A", "#FFD700"] },
  { id: 2001, name: "Banarasi Silk Brocade", price: 3499, oldPrice: 4999, category: "Fabrics", image: "https://i.pinimg.com/736x/56/14/81/561481cdf44e31905ab2760bbd033202.jpg", rating: 4.7, reviews: 89, badge: "Trending", fabric: "Banarasi", stockLeft: 12, colors: ["#FF1493", "#FFD700", "#C0C0C0"] },
  { id: 3001, name: "Pastel Embroidered Kurta", price: 2999, oldPrice: 4499, category: "Kurtas", image: "https://ik.imagekit.io/4sjmoqtje/tr:w-370,c-at_max/cdn/shop/files/mustard-yellow-embellished-sharara-suit-set-with-dupatta-sg341389-1_e5fda323-a01e-4ba4-b0b7-8e91f0c06dcd.jpg?v=1768045121", rating: 4.8, reviews: 112, badge: "New Arrival", fabric: "Cotton", stockLeft: 8, colors: ["#FFF5EE", "#FFE4E1", "#E6E6FA"] },
  { id: 4001, name: "Indigo Block Print Dupatta", price: 1899, oldPrice: 2499, category: "Dupattas", image: "https://i.pinimg.com/736x/62/72/ea/6272ea7225c912087f2c5b1c235a03ea.jpg", rating: 4.6, reviews: 67, badge: "Artisanal", fabric: "Cotton", stockLeft: 3, colors: ["#1E3A8A", "#2563EB", "#60A5FA"] },
  { id: 1005, name: "Mangalagiri Cotton Saree", price: 3200, oldPrice: 4500, category: "Sarees", image: "https://i.pinimg.com/736x/20/9f/fb/209ffb9bdccd388e08bd1d7b30869234.jpg", rating: 4.5, reviews: 45, badge: "Value Pick", fabric: "Cotton", stockLeft: 15, colors: ["#F5F5DC", "#FFF8DC", "#FAEBD7"] },
  { id: 2002, name: "Ikat Handwoven Fabric", price: 1299, oldPrice: 1799, category: "Fabrics", image: "https://i.pinimg.com/1200x/b3/46/dc/b346dca6fb0cbcd99a4589c162621ef3.jpg", rating: 4.8, reviews: 78, badge: "Exclusive", fabric: "Cotton", stockLeft: 6, colors: ["#DC2626", "#EA580C", "#CA8A04"] },
  { id: 3002, name: "Olive Linen Kurta Set", price: 3799, oldPrice: 5299, category: "Kurtas", image: "https://i.pinimg.com/736x/d9/f4/cb/d9f4cb9581dbe49b1c47ce1f223655f8.jpg", rating: 4.9, reviews: 94, badge: "Premium", fabric: "Linen", stockLeft: 4, colors: ["#556B2F", "#6B8E23", "#808000"] },
  { id: 4002, name: "Banarasi Zari Dupatta", price: 4500, oldPrice: 6000, category: "Dupattas", image: "https://i.pinimg.com/736x/59/11/80/591180632783e4ac10876b05e2b3e3bb.jpg", rating: 4.9, reviews: 123, badge: "Heritage", fabric: "Silk", stockLeft: 2, colors: ["#C41E3A", "#FFD700", "#D4AF37"] },
  { id: 1006, name: "Chanderi Silk Saree", price: 5499, oldPrice: 6999, category: "Sarees", image: "https://i.pinimg.com/1200x/15/5a/31/155a3159151b2b6b4c7d08c37d80a7fa.jpg", rating: 4.7, reviews: 56, badge: "Festive", fabric: "Chanderi", stockLeft: 7, colors: ["#FF69B4", "#FFB6C1", "#FFC0CB"] },
  { id: 3003, name: "Anarkali Kurta Set", price: 4299, oldPrice: 5999, category: "Kurtas", image: "https://i.pinimg.com/736x/d9/f4/cb/d9f4cb9581dbe49b1c47ce1f223655f8.jpg", rating: 4.8, reviews: 88, badge: "Wedding", fabric: "Georgette", stockLeft: 9, colors: ["#8B0000", "#A0522D", "#D2691E"] },
];

export const DEFAULT_CATEGORIES = [
  { id: "cat-sarees", name: "Sarees", slug: "sarees" },
  { id: "cat-kurtas", name: "Kurtas", slug: "kurtas" },
  { id: "cat-dupattas", name: "Dupattas", slug: "dupattas" },
  { id: "cat-fabrics", name: "Fabrics", slug: "fabrics" },
];

export const STORAGE_CATALOG = "llmShop_catalog_products";
export const STORAGE_CATEGORIES = "llmShop_catalog_categories";
export const STORAGE_ORDERS = "llmShop_store_orders";

export const SAMPLE_ORDERS = [
  {
    id: "LM240315",
    date: new Date(Date.now() - 86400000 * 45).toISOString(),
    status: "Delivered",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    customerPhone: "+91 98852 22227",
    payment: "Card",
    total: 8999,
    items: [{ name: "Banarasi Silk Brocade", qty: 1, price: 8999 }],
  },
  {
    id: "LM240228",
    date: new Date(Date.now() - 86400000 * 60).toISOString(),
    status: "Processing",
    customerName: "Anita Rao",
    customerEmail: "anita@example.com",
    customerPhone: "+91 98200 44112",
    payment: "COD",
    total: 9998,
    items: [{ name: "Pastel Embroidered Kurta", qty: 2, price: 4999 }],
  },
];
