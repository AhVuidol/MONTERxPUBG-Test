import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

fs.mkdirSync("data", { recursive: true });
export const db = new Database(path.resolve("data/duylore.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price_stars INTEGER NOT NULL CHECK(price_stars > 0),
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id),
  secret TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  order_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT NOT NULL,
  product_id INTEGER NOT NULL REFERENCES products(id),
  amount_stars INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  telegram_charge_id TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS promos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  percent_off INTEGER NOT NULL CHECK(percent_off BETWEEN 1 AND 90),
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS users (
  telegram_id TEXT PRIMARY KEY,
  username TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

const count = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
if (count === 0) {
  const insert = db.prepare("INSERT INTO products (name, description, price_stars) VALUES (?, ?, ?)");
  insert.run("DUYLORE Demo Key", "Sản phẩm mẫu – hãy thay bằng sản phẩm hợp pháp của shop.", 50);
}
