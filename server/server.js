const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const { BlobServiceClient } = require("@azure/storage-blob");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = "hemligtlosenord";
const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "orders";
const BLOB_NAME = "orders.json";

async function getBlobClient() {
  const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  await containerClient.createIfNotExists();
  return containerClient.getBlockBlobClient(BLOB_NAME);
}

async function readOrders() {
  try {
    const blobClient = await getBlobClient();
    const exists = await blobClient.exists();
    if (!exists) return [];
    const download = await blobClient.download();
    const chunks = [];
    for await (const chunk of download.readableStreamBody) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks).toString("utf8");
    return content ? JSON.parse(content) : [];
  } catch {
    return [];
  }
}

async function writeOrders(orders) {
  const blobClient = await getBlobClient();
  const content = JSON.stringify(orders, null, 2);
  await blobClient.upload(Buffer.from(content), Buffer.byteLength(content), {
    overwrite: true,
  });
}

function getNextOrderNumber(orders) {
  const prefix = "REG-";
  let highestNumber = 10000;
  for (const order of orders) {
    if (!order || typeof order.orderNumber !== "string") continue;
    if (!order.orderNumber.startsWith(prefix)) continue;
    const parsed = parseInt(order.orderNumber.replace(prefix, ""), 10);
    if (Number.isFinite(parsed) && parsed > highestNumber) {
      highestNumber = parsed;
    }
  }
  return `${prefix}${highestNumber + 1}`;
}

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: "Fel lösenord" });
});

app.get("/api/orders", async (req, res) => {
  const password = req.headers["x-admin-password"];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Obehörig" });
  }
  const orders = await readOrders();
  return res.json({ success: true, orders });
});

app.patch("/api/orders/:id/status", async (req, res) => {
  const password = req.headers["x-admin-password"];
  const { id } = req.params;
  const { status } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Obehörig" });
  }
  const allowedStatuses = ["ny", "påbörjad", "klar", "skickad"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Ogiltig status" });
  }
  const orders = await readOrders();
  const orderIndex = orders.findIndex((order) => order.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: "Beställningen hittades inte" });
  }
  orders[orderIndex] = { ...orders[orderIndex], status };
  await writeOrders(orders);
  return res.json({ success: true, message: "Status uppdaterad", order: orders[orderIndex] });
});

app.post("/api/orders", async (req, res) => {
  const order = req.body;
  if (!order || !Array.isArray(order.cart) || order.cart.length === 0) {
    return res.status(400).json({ success: false, message: "Tom beställning" });
  }
  const orders = await readOrders();
  const orderNumber = getNextOrderNumber(orders);
  console.log("Ny order skapas:", orderNumber);
  const newOrder = {
    id: crypto.randomUUID(),
    orderNumber,
    createdAt: new Date().toISOString(),
    status: "ny",
    cart: order.cart || [],
    orderer: order.orderer || {},
    delivery: order.delivery || {},
  };
  orders.unshift(newOrder);
  await writeOrders(orders);
  return res.json({ success: true, order: newOrder });
});

app.delete("/api/orders/:id", async (req, res) => {
  const password = req.headers["x-admin-password"];
  const { id } = req.params;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Obehörig" });
  }
  const orders = await readOrders();
  const filteredOrders = orders.filter((order) => order.id !== id);
  if (filteredOrders.length === orders.length) {
    return res.status(404).json({ success: false, message: "Beställningen hittades inte" });
  }
  await writeOrders(filteredOrders);
  return res.json({ success: true, message: "Beställningen är borttagen" });
});

const buildPath = path.join(__dirname, "../build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server kör på http://localhost:${PORT}`);
});
