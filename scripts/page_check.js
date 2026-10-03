const WEB = "http://localhost:3000";
const routes = [
  "/", "/shop", "/search?q=ceramide", "/category/skin", "/products/centella-5-ceramide-barrier-cream",
  "/cart", "/checkout", "/track", "/account", "/account/login", "/account/register", "/admin",
  "/about-seed-cosmetics", "/faq", "/contact", "/shipping-policy", "/returns-refunds",
  "/privacy-policy", "/terms", "/guides/science-of-cold-pressed-seed-oils", "/does-not-exist",
];

(async () => {
  let bad = 0;
  for (const r of routes) {
    try {
      const res = await fetch(WEB + r, { redirect: "manual" });
      const html = await res.text();
      const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
      const ld = (html.match(/application\/ld\+json/g) || []).length;
      const expected = r === "/does-not-exist" ? 404 : 200;
      const ok = res.status === expected;
      if (!ok) bad++;
      console.log((ok ? "PASS " : "FAIL ") + res.status + " " + r + "  | " + title.slice(0, 60) + (ld ? "  [JSON-LD x" + ld + "]" : ""));
    } catch (e) {
      bad++;
      console.log("FAIL " + r + " " + e.message);
    }
  }
  console.log(bad === 0 ? "ALL PAGES OK" : bad + " page(s) failing");
})();
