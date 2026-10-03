const BASE = "http://localhost:5000/api";

async function call(method, url, body, token, session) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  if (session) headers["x-session-id"] = session;
  const res = await fetch(BASE + url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
}

function check(name, ok, extra) {
  console.log((ok ? "PASS " : "FAIL ") + name + (extra ? " -> " + extra : ""));
}

(async () => {
  const session = "smoke-" + Date.now();

  let r = await call("GET", "/products");
  const products = r.data && r.data.products;
  check("list products", r.status === 200 && products && products.length > 0, products && products.length + " items");

  const p = products && products[0];
  r = await call("GET", "/products/" + p.slug);
  check("product by slug", r.status === 200 && r.data.success, p.slug);

  r = await call("GET", "/products?search=niacinamide");
  check("search", r.status === 200 && r.data.products.length > 0, r.data.products && r.data.products.length + " hits");

  r = await call("POST", "/auth/login", { email: "admin@seedcosmetics.in", password: "SeedAdmin@2026!" });
  const adminToken = r.data && r.data.token;
  check("admin login", r.status === 200 && !!adminToken);

  r = await call("GET", "/admin/dashboard", null, adminToken);
  check("admin dashboard", r.status === 200 && r.data.success);

  r = await call("GET", "/admin/dashboard");
  check("admin blocked w/o token", r.status === 401 || r.status === 403, "status " + r.status);

  r = await call("POST", "/cart/items", { productId: p._id, quantity: 2, guestSessionId: session });
  check("add to cart", r.status === 200 || r.status === 201, "status " + r.status);

  r = await call("POST", "/cart/coupon", { code: "WELCOME10", guestSessionId: session });
  check("apply coupon", r.status === 200, "status " + r.status + " " + JSON.stringify(r.data).slice(0, 100));

  r = await call("GET", "/cart?guestSessionId=" + session);
  const c = r.data && r.data.cart;
  check("get cart totals", r.status === 200 && c && c.items.length === 1 && c.couponDiscount > 0,
    c && ("subtotal=" + c.subtotal + " discount=" + c.couponDiscount + " ship=" + c.shippingFee + " total=" + c.grandTotal));

  const addr = { fullName: "Smoke Tester", phone: "9876543210", addressLine1: "12 Test Lane", city: "Pune", state: "Maharashtra", pincode: "411001", country: "India" };
  r = await call("POST", "/checkout/razorpay/order", {
    guestSessionId: session, customerName: "Smoke Tester", customerEmail: "smoke+" + Date.now() + "@example.com",
    customerPhone: "9876543210", shippingAddress: addr,
  });
  console.log("     checkout response:", JSON.stringify(r.data).slice(0, 260));
  check("create razorpay order, amount matches cart", (r.status === 200 || r.status === 201) && r.data.success && r.data.amount === Math.round(c.grandTotal * 100), "status " + r.status + " amount=" + (r.data && r.data.amount));

  const root = BASE.replace("/api", "");
  const sm = await fetch(root + "/sitemap.xml");
  check("sitemap.xml", sm.status === 200, "status " + sm.status);
  const rb = await fetch(root + "/robots.txt");
  const rbText = await rb.text();
  check("robots.txt allows OAI-SearchBot", rb.status === 200 && rbText.includes("OAI-SearchBot"), "status " + rb.status);

  r = await call("GET", "/products?search=niacinamide");
  check("search filters (not all products)", r.data.products.length >= 1 && r.data.products.length < 6, r.data.products.length + " hits");

  r = await call("GET", "/products?search=(");
  check("search with regex chars does not 500", r.status === 200, "status " + r.status);
})().catch((e) => { console.error("Smoke test crashed:", e); process.exit(1); });
