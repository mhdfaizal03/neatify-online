require("dotenv").config();

const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const USER_DIR = path.join(ROOT, "user");
const ADMIN_DIR = path.join(ROOT, "admin");
const ASSETS_DIR = path.join(ROOT, "assets");
const UPLOAD_DIR = path.join(ROOT, "assets", "uploads");
const SESSION_SECRET = process.env.SESSION_SECRET || "neatify-dev-secret-change-me";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "neatify2026";

const sessions = new Map();

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(express.json({ limit: "10mb" }));

/* Route structure:
   /        → user storefront  (user/ folder)
   /admin   → admin dashboard  (admin/ folder)
   /assets  → shared images and uploads */
app.use("/assets", express.static(ASSETS_DIR));
app.use("/admin", express.static(ADMIN_DIR));
app.get("/admin", (_req, res) => res.redirect("/admin/"));
app.use(express.static(USER_DIR));

function readJson(file, fallback) {
  const filePath = path.join(DATA_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  const filePath = path.join(DATA_DIR, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function createToken(username) {
  const payload = {
    username,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const session = verifyToken(token);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  req.admin = session;
  next();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${safe.endsWith(ext) ? safe : safe + ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

function listMediaFiles() {
  const dirs = [
    { dir: path.join(ROOT, "assets"), prefix: "assets" },
    { dir: UPLOAD_DIR, prefix: "assets/uploads" },
  ];
  const files = [];
  dirs.forEach(({ dir, prefix }) => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach((name) => {
      if (/\.(jpe?g|png|webp|gif)$/i.test(name)) {
        const stat = fs.statSync(path.join(dir, name));
        files.push({
          name,
          url: `${prefix}/${name}`,
          size: stat.size,
          uploadedAt: stat.mtime.toISOString(),
          source: prefix.includes("uploads") ? "upload" : "library",
        });
      }
    });
  });
  return files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

function computeStats() {
  const products = readJson("products.json", []);
  const orders = readJson("orders.json", []);
  const subscribers = readJson("subscribers.json", []);
  const activeProducts = products.filter((p) => p.active !== false);
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const categoryCounts = activeProducts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalProducts: activeProducts.length,
    inactiveProducts: products.length - activeProducts.length,
    totalOrders: orders.length,
    totalRevenue: revenue,
    totalSubscribers: subscribers.length,
    newsletterCount: subscribers.filter((s) => s.type === "newsletter").length,
    notifyCount: subscribers.filter((s) => s.type === "notify").length,
    categoryCounts,
    recentOrders: orders.slice(-5).reverse(),
    avgOrderValue: orders.length ? Math.round(revenue / orders.length) : 0,
  };
}

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const valid = password === ADMIN_PASSWORD || (await bcrypt.compare(password, ADMIN_PASSWORD).catch(() => false));
  if (!valid && password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = createToken(username);
  res.json({ token, username, expiresIn: 86400 });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ username: req.admin.username });
});

app.get("/api/stats", authMiddleware, (_req, res) => {
  res.json(computeStats());
});

app.get("/api/products", (_req, res) => {
  const products = readJson("products.json", []);
  res.json(products.filter((p) => p.active !== false));
});

app.get("/api/products/all", authMiddleware, (_req, res) => {
  res.json(readJson("products.json", []));
});

app.post("/api/products", authMiddleware, (req, res) => {
  const products = readJson("products.json", []);
  const body = req.body || {};
  const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const product = {
    id: nextId,
    name: body.name?.trim() || "Untitled Product",
    category: body.category || "wash",
    type: body.type || "Product",
    price: Number(body.price) || 0,
    featured: Number(body.featured) || nextId,
    image: body.image || "assets/product-1.jpeg",
    badge: body.badge || "New",
    description: body.description || "",
    points: Array.isArray(body.points) ? body.points : String(body.points || "").split("\n").map((s) => s.trim()).filter(Boolean),
    active: body.active !== false,
  };
  products.push(product);
  writeJson("products.json", products);
  res.status(201).json(product);
});

app.put("/api/products/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const products = readJson("products.json", []);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const body = req.body || {};
  products[index] = {
    ...products[index],
    name: body.name?.trim() ?? products[index].name,
    category: body.category ?? products[index].category,
    type: body.type ?? products[index].type,
    price: Number(body.price ?? products[index].price),
    featured: Number(body.featured ?? products[index].featured),
    image: body.image ?? products[index].image,
    badge: body.badge ?? products[index].badge,
    description: body.description ?? products[index].description,
    points: Array.isArray(body.points)
      ? body.points
      : body.points !== undefined
        ? String(body.points).split("\n").map((s) => s.trim()).filter(Boolean)
        : products[index].points,
    active: body.active !== undefined ? body.active !== false : products[index].active,
  };
  writeJson("products.json", products);
  res.json(products[index]);
});

app.delete("/api/products/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const products = readJson("products.json", []);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products[index].active = false;
  writeJson("products.json", products);
  res.json({ success: true });
});

app.patch("/api/products/:id/restore", authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const products = readJson("products.json", []);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products[index].active = true;
  writeJson("products.json", products);
  res.json(products[index]);
});

app.get("/api/settings", (_req, res) => {
  res.json(readJson("settings.json", {}));
});

app.put("/api/settings", authMiddleware, (req, res) => {
  const current = readJson("settings.json", {});
  const updated = { ...current, ...req.body };
  writeJson("settings.json", updated);
  res.json(updated);
});

app.get("/api/media", authMiddleware, (_req, res) => {
  res.json(listMediaFiles());
});

app.post("/api/media/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.status(201).json({
    name: req.file.filename,
    url: `assets/uploads/${req.file.filename}`,
    size: req.file.size,
    uploadedAt: new Date().toISOString(),
    source: "upload",
  });
});

app.delete("/api/media", authMiddleware, (req, res) => {
  const { url } = req.body || {};
  if (!url || !url.startsWith("assets/uploads/")) {
    return res.status(400).json({ error: "Only uploaded files can be deleted" });
  }
  const filePath = path.join(ROOT, url);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
  fs.unlinkSync(filePath);
  res.json({ success: true });
});

app.get("/api/subscribers", authMiddleware, (_req, res) => {
  res.json(readJson("subscribers.json", []));
});

app.post("/api/subscribers", (req, res) => {
  const { email, type = "newsletter" } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email required" });
  }
  const subscribers = readJson("subscribers.json", []);
  if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase() && s.type === type)) {
    return res.json({ success: true, duplicate: true });
  }
  const entry = { id: Date.now(), email, type, createdAt: new Date().toISOString() };
  subscribers.push(entry);
  writeJson("subscribers.json", subscribers);
  res.status(201).json(entry);
});

app.get("/api/orders", authMiddleware, (_req, res) => {
  res.json(readJson("orders.json", []));
});

app.post("/api/orders", (req, res) => {
  const { items, total, customer } = req.body || {};
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Order items required" });
  }
  const orders = readJson("orders.json", []);
  const order = {
    id: `ORD-${Date.now()}`,
    items,
    total: Number(total) || 0,
    customer: customer || {},
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  writeJson("orders.json", orders);
  res.status(201).json(order);
});

app.patch("/api/orders/:id", authMiddleware, (req, res) => {
  const orders = readJson("orders.json", []);
  const index = orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Order not found" });
  orders[index] = { ...orders[index], ...req.body };
  writeJson("orders.json", orders);
  res.json(orders[index]);
});

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || "Request failed" });
});

// Unknown /api routes always answer JSON — never empty bodies or HTML
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`Neatify running at http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin/`);
});
