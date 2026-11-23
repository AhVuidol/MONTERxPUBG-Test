import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Bot, InlineKeyboard } from "grammy";
import { db } from "./db.js";
import { verifyTelegramInitData } from "./telegram.js";

const required = ["BOT_TOKEN", "BOT_USERNAME", "ADMIN_PASSWORD"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing ${key}. Copy .env.example to .env and configure it.`);
    process.exit(1);
  }
}
const bot = new Bot(process.env.BOT_TOKEN);
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.resolve(__dirname, "../public")));

function telegramUser(req, res, next) {
  const user = verifyTelegramInitData(req.get("x-telegram-init-data"), process.env.BOT_TOKEN);
  if (!user) return res.status(401).json({ error: "Telegram session không hợp lệ. Hãy mở shop từ bot." });
  req.tgUser = user;
  db.prepare("INSERT INTO users (telegram_id, username) VALUES (?, ?) ON CONFLICT(telegram_id) DO UPDATE SET username=excluded.username")
    .run(String(user.id), user.username || "");
  next();
}
function adminOnly(req, res, next) {
  const supplied = req.get("x-admin-password") || "";
  if (supplied !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: "Sai mật khẩu Admin." });
  next();
}
function botApi(method, body) {
  return fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/${method}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
  }).then(r => r.json());
}

app.get("/api/products", telegramUser, (req, res) => {
  const products = db.prepare(`
    SELECT p.id, p.name, p.description, p.price_stars,
      (SELECT COUNT(*) FROM inventory i WHERE i.product_id=p.id AND i.status='available') AS stock
    FROM products p WHERE p.active=1 ORDER BY p.id DESC
  `).all();
  res.json({ products });
});

app.post("/api/checkout", telegramUser, async (req, res) => {
  const productId = Number(req.body.productId);
  const product = db.prepare(`
    SELECT p.*, (SELECT COUNT(*) FROM inventory i WHERE i.product_id=p.id AND i.status='available') AS stock
    FROM products p WHERE p.id=? AND p.active=1
  `).get(productId);
  if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
  if (product.stock < 1) return res.status(409).json({ error: "Sản phẩm đã hết hàng." });

  const order = db.prepare("INSERT INTO orders (telegram_id, product_id, amount_stars) VALUES (?, ?, ?)")
    .run(String(req.tgUser.id), product.id, product.price_stars);
  const orderId = Number(order.lastInsertRowid);
  const invoice = await botApi("createInvoiceLink", {
    title: product.name.slice(0, 32),
    description: (product.description || "Sản phẩm số DUYLORE").slice(0, 255),
    payload: `duylore:${orderId}`,
    provider_token: "",
    currency: "XTR",
    prices: [{ label: product.name.slice(0, 32), amount: product.price_stars }]
  });
  if (!invoice.ok) {
    db.prepare("UPDATE orders SET status='failed' WHERE id=?").run(orderId);
    return res.status(502).json({ error: "Không tạo được hóa đơn Telegram Stars." });
  }
  res.json({ invoiceUrl: invoice.result, orderId });
});

app.get("/api/orders", telegramUser, (req, res) => {
  const orders = db.prepare(`
    SELECT o.id, p.name, o.amount_stars, o.status, o.created_at
    FROM orders o JOIN products p ON p.id=o.product_id
    WHERE o.telegram_id=? ORDER BY o.id DESC LIMIT 30
  `).all(String(req.tgUser.id));
  res.json({ orders });
});

// Minimal admin API. Keep ADMIN_PASSWORD private; use HTTPS and change it before deployment.
app.get("/admin", (req, res) => res.sendFile(path.resolve(__dirname, "../public/admin.html")));
app.get("/api/admin/products", adminOnly, (req, res) => {
  res.json({ products: db.prepare("SELECT * FROM products ORDER BY id DESC").all() });
});
app.post("/api/admin/products", adminOnly, (req, res) => {
  const { name, description = "", priceStars } = req.body;
  const price = Number(priceStars);
  if (!name?.trim() || !Number.isInteger(price) || price < 1) return res.status(400).json({ error: "Tên và giá Stars không hợp lệ." });
  const result = db.prepare("INSERT INTO products (name, description, price_stars) VALUES (?, ?, ?)")
    .run(name.trim().slice(0, 100), String(description).slice(0, 500), price);
  res.json({ id: Number(result.lastInsertRowid) });
});
app.post("/api/admin/inventory", adminOnly, (req, res) => {
  const productId = Number(req.body.productId);
  const keys = String(req.body.keys || "").split(/\\r?\\n/).map(x => x.trim()).filter(Boolean);
  if (!Number.isInteger(productId) || !keys.length || keys.length > 500) return res.status(400).json({ error: "Chọn sản phẩm và nhập tối đa 500 key mỗi lần." });
  const product = db.prepare("SELECT id FROM products WHERE id=?").get(productId);
  if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm." });
  const insert = db.prepare("INSERT INTO inventory (product_id, secret) VALUES (?, ?)");
  const tx = db.transaction(() => keys.forEach(k => insert.run(productId, k.slice(0, 1000))));
  tx();
  res.json({ added: keys.length });
});
app.post("/api/admin/promos", adminOnly, (req, res) => {
  const code = String(req.body.code || "").trim().toUpperCase();
  const percent = Number(req.body.percentOff);
  if (!/^[A-Z0-9_-]{3,24}$/.test(code) || !Number.isInteger(percent) || percent < 1 || percent > 90)
    return res.status(400).json({ error: "Mã hoặc phần trăm giảm không hợp lệ." });
  try {
    db.prepare("INSERT INTO promos (code, percent_off) VALUES (?, ?)").run(code, percent);
    res.json({ ok: true });
  } catch {
    res.status(409).json({ error: "Mã khuyến mãi đã tồn tại." });
  }
});

bot.command("start", async ctx => {
  const url = process.env.PUBLIC_URL;
  if (!url || !url.startsWith("https://")) return ctx.reply("Shop đang được cấu hình. Vui lòng quay lại sau.");
  const keyboard = new InlineKeyboard().webApp("🛍 Mở DUYLORE", url);
  await ctx.reply("Chào mừng đến DUYLORE – cửa hàng key số. Nhấn nút bên dưới để mở shop.", { reply_markup: keyboard });
});
bot.command("terms", ctx => ctx.reply("Điều khoản DUYLORE: vui lòng kiểm tra đúng sản phẩm trước khi thanh toán. Liên hệ shop nếu cần hỗ trợ."));
bot.command("paysupport", ctx => ctx.reply("Hỗ trợ thanh toán DUYLORE: vui lòng gửi mã đơn hàng và ảnh biên nhận Telegram."));
bot.on("pre_checkout_query", async ctx => {
  const payload = ctx.preCheckoutQuery.invoice_payload || "";
  const match = payload.match(/^duylore:(\\d+)$/);
  if (!match) return ctx.answerPreCheckoutQuery(false, "Đơn hàng không hợp lệ.");
  const order = db.prepare("SELECT * FROM orders WHERE id=? AND status='pending'").get(Number(match[1]));
  if (!order) return ctx.answerPreCheckoutQuery(false, "Đơn hàng không còn khả dụng.");
  const stock = db.prepare("SELECT COUNT(*) AS n FROM inventory WHERE product_id=? AND status='available'").get(order.product_id).n;
  if (stock < 1) return ctx.answerPreCheckoutQuery(false, "Sản phẩm vừa hết hàng.");
  await ctx.answerPreCheckoutQuery(true);
});
bot.on("message:successful_payment", async ctx => {
  const payment = ctx.message.successful_payment;
  const match = payment.invoice_payload.match(/^duylore:(\\d+)$/);
  if (!match) return;
  const orderId = Number(match[1]);
  const deliver = db.transaction(() => {
    const order = db.prepare("SELECT * FROM orders WHERE id=? AND status='pending'").get(orderId);
    if (!order || String(ctx.from.id) !== order.telegram_id || payment.currency !== "XTR" || payment.total_amount !== order.amount_stars) return null;
    const item = db.prepare("SELECT * FROM inventory WHERE product_id=? AND status='available' ORDER BY id LIMIT 1").get(order.product_id);
    if (!item) return null;
    db.prepare("UPDATE inventory SET status='sold', order_id=? WHERE id=? AND status='available'").run(orderId, item.id);
    db.prepare("UPDATE orders SET status='paid', telegram_charge_id=? WHERE id=?").run(payment.telegram_payment_charge_id, orderId);
    return { secret: item.secret, productId: order.product_id };
  });
  const result = deliver();
  if (result) await ctx.reply(`✅ Thanh toán thành công!\\nMã đơn: #${orderId}\\nKey của bạn:\\n\\n\\`${result.secret}\\``, { parse_mode: "Markdown" });
  else await ctx.reply("Thanh toán đã nhận nhưng shop cần kiểm tra đơn hàng. Vui lòng liên hệ /paysupport và cung cấp mã đơn.");
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`DUYLORE server listening on ${port}`));
bot.start().catch(err => console.error("Bot polling error:", err));
