// Script untuk menyinkronkan pesanan lokal ke Google Spreadsheet
const fs = require("fs");
const path = require("path");

const envFile = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const getEnv = (key) => {
  const match = envFile.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match ? match[1].trim() : "";
};

const url = getEnv("APPS_SCRIPT_URL");
const token = getEnv("APPS_SCRIPT_SECRET");

async function syncOrders() {
  const dbFile = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "local-db.json"), "utf8"));
  const orders = dbFile.Orders || [];

  if (orders.length === 0) {
    console.log("Tidak ada pesanan lokal untuk disinkronkan.");
    return;
  }

  console.log(`Menyinkronkan ${orders.length} pesanan ke Google Spreadsheet...`);

  for (const order of orders) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          action: "insert",
          table: "Orders",
          data: order,
        }),
      });
      const data = await res.json();
      console.log(`Pesanan ${order.id}:`, data);
    } catch (err) {
      console.error(`Gagal sync ${order.id}:`, err.message);
    }
  }
}

syncOrders();

