const BASE = "http://localhost:5000/api";
async function call(method, url, body, token) {
  const res = await fetch(BASE + url, { method, headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, data: await res.json().catch(() => null) };
}
(async () => {
  let r = await call("POST", "/auth/login", { email: "admin@seedcosmetics.in", password: "SeedAdmin@2026!" });
  const token = r.data.token;
  const cats = (await call("GET", "/content/categories")).data.categories;
  const base = {
    name: "Admin Test Serum " + Date.now(), sku: "TEST-" + Date.now(), MRP: 999, sellingPrice: 799, stock: 20,
    shortDescription: "Test short description for admin creation flow.",
    bulletPoints: ["Point one", "Point two"], status: "published",
    thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    ingredients: [{ name: "Rosehip Oil" }, { name: "Vitamin E" }], description: "Full test description.", howToUse: "Apply nightly.", images: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600", alt: "Test", isPrimary: true }],
  };
  r = await call("POST", "/admin/products", { ...base, category: "Skin" }, token);
  console.log("string category  ->", r.status, (r.data && r.data.message || "").slice(0, 140));
  r = await call("POST", "/admin/products", { ...base, category: cats[0]._id }, token);
  console.log("objectId category ->", r.status, (r.data && r.data.message || "").slice(0, 200));
  if (r.data && r.data.product) {
    const id = r.data.product._id;
    const d = await call("DELETE", "/admin/products/" + id, null, token);
    console.log("cleanup delete   ->", d.status);
  }
})();

