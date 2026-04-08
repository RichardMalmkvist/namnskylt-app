const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = "hemligtlosenord";
const DATA_FILE = path.join(__dirname, "orders.json");

function readOrders() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return raw ? JSON.parse(raw) : [];
}

function writeOrders(orders) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function getNextOrderNumber(orders) {
  const prefix = "REG-";
  let highestNumber = 10000;

  for (const order of orders) {
    if (!order || typeof order.orderNumber !== "string") {
      continue;
    }

    if (!order.orderNumber.startsWith(prefix)) {
      continue;
    }

    const numberPart = order.orderNumber.replace(prefix, "");
    const parsed = parseInt(numberPart, 10);

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

  return res.status(401).json({
    success: false,
    message: "Fel lösenord",
  });
});

app.get("/api/orders", (req, res) => {
  const password = req.headers["x-admin-password"];

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Obehörig",
    });
  }

  const orders = readOrders();

  return res.json({
    success: true,
    orders,
  });
});

app.patch("/api/orders/:id/status", (req, res) => {
  const password = req.headers["x-admin-password"];
  const { id } = req.params;
  const { status } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Obehörig",
    });
  }

  const allowedStatuses = ["ny", "påbörjad", "klar", "skickad"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Ogiltig status",
    });
  }

  const orders = readOrders();
  const orderIndex = orders.findIndex((order) => order.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Beställningen hittades inte",
    });
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
  };

  writeOrders(orders);

  return res.json({
    success: true,
    message: "Status uppdaterad",
    order: orders[orderIndex],
  });
});

app.post("/api/orders", (req, res) => {
  const order = req.body;

  if (!order || !Array.isArray(order.cart) || order.cart.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Tom beställning",
    });
  }

  const orders = readOrders();
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
  writeOrders(orders);

  return res.json({
    success: true,
    order: newOrder,
  });
});

app.delete("/api/orders/:id", (req, res) => {
  const password = req.headers["x-admin-password"];
  const { id } = req.params;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Obehörig",
    });
  }

  const orders = readOrders();
  const filteredOrders = orders.filter((order) => order.id !== id);

  if (filteredOrders.length === orders.length) {
    return res.status(404).json({
      success: false,
      message: "Beställningen hittades inte",
    });
  }

  writeOrders(filteredOrders);

  return res.json({
    success: true,
    message: "Beställningen är borttagen",
  });
});
app.listen(PORT, () => {
  console.log(`Server kör på http://localhost:${PORT}`);
});
