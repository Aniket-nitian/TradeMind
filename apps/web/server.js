import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");

const apiTarget = process.env.API_PROXY_TARGET;
if (!apiTarget) {
  throw new Error(
    "API_PROXY_TARGET env var is required, e.g. https://trademind-api.onrender.com"
  );
}

const app = express();

// Proxied same-origin so the API's refreshToken cookie is set for this
// site's own domain instead of the API's separate onrender.com subdomain.
// Browsers treat different onrender.com subdomains as different sites (it's
// on the public suffix list), which made the cookie a third-party cookie —
// browsers routinely block or clear those on restart, logging users out.
// Mounted at root (not app.use("/api", ...)) so Express doesn't strip the
// "/api" prefix from req.url before the proxy sees it — pathFilter matches
// against the original, unstripped path instead.
app.use(
  createProxyMiddleware({
    target: apiTarget,
    changeOrigin: true,
    pathFilter: "/api",
  })
);

app.use(express.static(distDir));

app.use((_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`web listening on ${port}, proxying /api -> ${apiTarget}`);
});
