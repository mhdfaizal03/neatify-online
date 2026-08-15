 require("dotenv").config();

const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "../");
const FRONTEND_DIR = path.join(ROOT, "frontend/dist");
const ASSETS_DIR = path.join(ROOT, "assets");
const UPLOAD_DIR = path.join(ASSETS_DIR, "uploads");
const DATA_DIR = path.join(__dirname, "data");
const SESSION_SECRET = process.env.SESSION_SECRET || "neatify-dev-secret-change-me";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin@neatify.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Neatify2002";

const sessions = new Map();

const IS_SERVERLESS = !!process.env.VERCEL;

try {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch {
  /* read-only filesystem on Vercel — uploads are kept in memory */
}

// Persistent store: Vercel's filesystem is read-only, so JSON data uses a
// Redis store when one is linked (add a Redis integration in Vercel →
// Storage; env vars are injected automatically), otherwise it falls back to
// memory for the life of the serverless instance.
let kv = null;
{
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const { Redis } = require("@upstash/redis");
      kv = new Redis({ url: kvUrl, token: kvToken });
    } catch {
      kv = null;
    }
  }
}

const memoryData = new Map();
const memoryMedia = new Map();
const KV_PREFIX = "neatify:";

// Express 4 doesn't catch rejected promises in async handlers —
// this wrapper forwards them to the error middleware below.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.use(express.json({ limit: "10mb" }));

// Serve in-memory uploads on serverless (registered before static mounts)
app.get("/assets/uploads/:name", (req, res, next) => {
  const m = memoryMedia.get(req.params.name);
  if (!m) return next();
  res.setHeader("Content-Type", m.mimetype);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.send(m.buffer);
});

// Serve React Frontend (Production)
app.use(express.static(FRONTEND_DIR));
app.use("/assets", express.static(ASSETS_DIR));



async function readJson(file, fallback) {
  if (kv) {
    try {
      const stored = await kv.get(KV_PREFIX + file);
      if (stored !== null && stored !== undefined) return stored;
    } catch {
      /* KV unreachable — fall back to memory/disk seed data */
    }
  }
  if (memoryData.has(file)) return memoryData.get(file);
  const filePath = path.join(DATA_DIR, file);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  memoryData.set(file, data);
  if (kv) {
    try {
      await kv.set(KV_PREFIX + file, data);
      return;
    } catch {
      /* KV write failed — the in-memory copy keeps this instance working */
    }
  }
  try {
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
  } catch {
    /* read-only FS — the in-memory copy keeps every feature working */
  }
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

function safeUploadName(originalname) {
  const ext = path.extname(originalname).toLowerCase() || ".jpg";
  const safe = originalname.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
  return `${Date.now()}-${safe.endsWith(ext) ? safe : safe + ext}`;
}

const storage = IS_SERVERLESS
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
      filename: (_req, file, cb) => cb(null, safeUploadName(file.originalname)),
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
  const files = [];
  memoryMedia.forEach((m, name) => {
    files.push({
      name,
      url: `assets/uploads/${name}`,
      size: m.buffer.length,
      uploadedAt: m.uploadedAt,
      source: "upload",
    });
  });
  const dirs = [
    { dir: path.join(ROOT, "assets"), prefix: "assets" },
    { dir: UPLOAD_DIR, prefix: "assets/uploads" },
  ];
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

async function computeStats() {
  const [products, orders, subscribers] = await Promise.all([
    readJson("products.json", []),
    readJson("orders.json", []),
    readJson("subscribers.json", []),
  ]);
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

/* ── Customer accounts: register / login / profile / orders ──
   Storefront purchases require a signed-in account; tokens are
   HMAC-signed like the admin ones but carry a `uid` claim. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createUserToken(user) {
  const payload = { uid: user.id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

async function resolveUser(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const payload = verifyToken(token);
  if (!payload || !payload.uid) return null;
  const users = await readJson("users.json", []);
  return users.find((u) => u.id === payload.uid) || null;
}

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone || "",
  address: u.address || "",
  createdAt: u.createdAt,
});

app.post("/api/account/register", wrap(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || String(name).trim().length < 2) return res.status(400).json({ error: "Please enter your name" });
  if (!email || !EMAIL_RE.test(String(email))) return res.status(400).json({ error: "Please enter a valid email" });
  if (!password || String(password).length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
  const users = await readJson("users.json", []);
  if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase().trim())) {
    return res.status(409).json({ error: "An account with this email already exists — try signing in" });
  }
  const user = {
    id: `U-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    phone: "",
    address: "",
    passHash: await bcrypt.hash(String(password), 10),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeJson("users.json", users);
  res.status(201).json({ token: createUserToken(user), user: publicUser(user) });
}));

app.post("/api/account/login", wrap(async (req, res) => {
  const { email, password } = req.body || {};
  const users = await readJson("users.json", []);
  const user = users.find((u) => u.email === String(email || "").toLowerCase().trim());
  if (!user || !(await bcrypt.compare(String(password || ""), user.passHash))) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }
  res.json({ token: createUserToken(user), user: publicUser(user) });
}));

app.get("/api/account/me", wrap(async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  res.json(publicUser(user));
}));

app.put("/api/account/profile", wrap(async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  const { name, phone, address } = req.body || {};
  if (name !== undefined && String(name).trim().length < 2) {
    return res.status(400).json({ error: "Please enter your name" });
  }
  const users = await readJson("users.json", []);
  const i = users.findIndex((u) => u.id === user.id);
  users[i] = {
    ...users[i],
    name: name !== undefined ? String(name).trim() : users[i].name,
    phone: phone !== undefined ? String(phone).trim() : users[i].phone || "",
    address: address !== undefined ? String(address).trim() : users[i].address || "",
  };
  await writeJson("users.json", users);
  res.json(publicUser(users[i]));
}));

app.put("/api/account/password", wrap(async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  const { current, next } = req.body || {};
  if (!(await bcrypt.compare(String(current || ""), user.passHash))) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }
  if (!next || String(next).length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }
  const users = await readJson("users.json", []);
  const i = users.findIndex((u) => u.id === user.id);
  users[i] = { ...users[i], passHash: await bcrypt.hash(String(next), 10) };
  await writeJson("users.json", users);
  res.json({ success: true });
}));

app.get("/api/account/orders", wrap(async (req, res) => {
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  const orders = await readJson("orders.json", []);
  const mine = orders.filter(
    (o) => o.userId === user.id || String(o.customer?.email || "").toLowerCase() === user.email
  );
  res.json(mine.reverse()); /* newest first, like a real order history */
}));

app.get("/api/stats", authMiddleware, wrap(async (_req, res) => {
  res.json(await computeStats());
}));

app.get("/api/products", wrap(async (_req, res) => {
  const products = await readJson("products.json", []);
  res.json(products.filter((p) => p.active !== false));
}));

app.get("/api/products/all", authMiddleware, wrap(async (_req, res) => {
  res.json(await readJson("products.json", []));
}));

app.post("/api/products", authMiddleware, wrap(async (req, res) => {
  const products = await readJson("products.json", []);
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
  await writeJson("products.json", products);
  res.status(201).json(product);
}));

app.put("/api/products/:id", authMiddleware, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const products = await readJson("products.json", []);
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
  await writeJson("products.json", products);
  res.json(products[index]);
}));

app.delete("/api/products/:id", authMiddleware, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const products = await readJson("products.json", []);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products[index].active = false;
  await writeJson("products.json", products);
  res.json({ success: true });
}));

app.patch("/api/products/:id/restore", authMiddleware, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const products = await readJson("products.json", []);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products[index].active = true;
  await writeJson("products.json", products);
  res.json(products[index]);
}));

app.get("/api/settings", wrap(async (_req, res) => {
  res.json(await readJson("settings.json", {}));
}));

app.put("/api/settings", authMiddleware, wrap(async (req, res) => {
  const current = await readJson("settings.json", {});
  const updated = { ...current, ...req.body };
  await writeJson("settings.json", updated);
  res.json(updated);
}));

app.get("/api/media", authMiddleware, (_req, res) => {
  res.json(listMediaFiles());
});

app.post("/api/media/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  let name = req.file.filename;
  if (IS_SERVERLESS) {
    name = safeUploadName(req.file.originalname);
    memoryMedia.set(name, {
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
    });
  }
  res.status(201).json({
    name,
    url: `assets/uploads/${name}`,
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
  const name = path.basename(url);
  if (memoryMedia.has(name)) {
    memoryMedia.delete(name);
    return res.json({ success: true });
  }
  const filePath = path.join(ROOT, url);
  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
    fs.unlinkSync(filePath);
  } catch {
    /* read-only FS on Vercel — the file isn't in memory and can't be removed from disk */
    return res.status(404).json({ error: "File not found" });
  }
  res.json({ success: true });
});

app.get("/api/subscribers", authMiddleware, wrap(async (_req, res) => {
  res.json(await readJson("subscribers.json", []));
}));

app.post("/api/subscribers", wrap(async (req, res) => {
  const { email, type = "newsletter" } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email required" });
  }
  const subscribers = await readJson("subscribers.json", []);
  if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase() && s.type === type)) {
    return res.json({ success: true, duplicate: true });
  }
  const entry = { id: Date.now(), email, type, createdAt: new Date().toISOString() };
  subscribers.push(entry);
  await writeJson("subscribers.json", subscribers);
  res.status(201).json(entry);
}));

app.get("/api/orders", authMiddleware, wrap(async (_req, res) => {
  res.json(await readJson("orders.json", []));
}));

app.post("/api/orders", wrap(async (req, res) => {
  /* Purchases require a signed-in customer account */
  const user = await resolveUser(req);
  if (!user) return res.status(401).json({ error: "Please sign in to place an order" });
  const { items, total, shipping, customer } = req.body || {};
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Order items required" });
  }
  const orders = await readJson("orders.json", []);
  const order = {
    id: `ORD-${Date.now()}`,
    items,
    total: Number(total) || 0,
    shipping: Number(shipping) || 0,
    customer: { ...(customer || {}), email: (customer && customer.email) || user.email },
    userId: user.id,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  await writeJson("orders.json", orders);
  res.status(201).json(order);
}));

app.patch("/api/orders/:id", authMiddleware, wrap(async (req, res) => {
  const orders = await readJson("orders.json", []);
  const index = orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Order not found" });
  orders[index] = { ...orders[index], ...req.body };
  await writeJson("orders.json", orders);
  res.json(orders[index]);
}));

// Fallback all other routes to React Router
app.get("*", (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Unknown /api routes always answer JSON — never empty bodies or HTML.
// Registered before the error handler so it runs after all route matches.
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || "Request failed" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Neatify running at http://localhost:${PORT}`);
    console.log(`Admin dashboard: http://localhost:${PORT}/admin/`);
  });
}

// Exported for serverless platforms (Vercel: api/index.js re-exports this app)
module.exports = app;
