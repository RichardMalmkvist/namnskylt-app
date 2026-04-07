const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = "hemligtlosenord";
const DATA_FILE = path.join(__dirname, "orders.json");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildProductRows(cart) {
  return cart.map(item => {
    if (item.productType === "namnbrickor") {
      return `<tr>
        <td style="padding:8px;border:1px solid #ddd">${item.badgeName}</td>
        <td style="padding:8px;border:1px solid #ddd">${item.name}</td>
        <td style="padding:8px;border:1px solid #ddd">${item.title}${item.titleLine2 ? "<br>" + item.titleLine2 : ""}</td>
        <td style="padding:8px;border:1px solid #ddd">${item.orgLine1}${item.orgLine2 ? "<br>" + item.orgLine2 : ""}</td>
        <td style="padding:8px;border:1px solid #ddd">${item.fastening}</td>
        <td style="padding:8px;border:1px solid #ddd">${item.quantity} st</td>
        <td style="padding:8px;border:1px solid #ddd">${item.extraMagnets} st</td>
      </tr>`;
    } else if (item.productType === "yrkestitelsskyltar") {
      return `<tr>
        <td style="padding:8px;border:1px solid #ddd">${item.badgeName}</td>
        <td style="padding:8px;border:1px solid #ddd" colspan="3">${item.title}</td>
        <td style="padding:8px;border:1px solid #ddd">—</td>
        <td style="padding:8px;border:1px solid #ddd">${item.quantity} st</td>
        <td style="padding:8px;border:1px solid #ddd">—</td>
      </tr>`;
    }
    return "";
  }).join("");
}

function buildManufacturerEmail(order) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto">
      <h2 style="color:#1a237e">Ny beställning: ${order.orderNumber}</h2>
      <p><strong>Datum:</strong> ${new Date(order.createdAt).toLocaleString("sv-SE")}</p>
      <h3>Beställare</h3>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:4px 8px"><strong>Namn:</strong></td><td>${order.orderer.ordererName || "—"}</td></tr>
        <tr><td style="padding:4px 8px"><strong>E-post:</strong></td><td>${order.orderer.ordererEmail || "—"}</td></tr>
        <tr><td style="padding:4px 8px"><strong>Telefon:</strong></td><td>${order.orderer.ordererPhone || "—"}</td></tr>
        <tr><td style="padding:4px 8px"><strong>Ansvarsnummer:</strong></td><td>${order.orderer.accountNumber || "—"}</td></tr>
        <tr><td style="padding:4px 8px"><strong>Meddelande:</strong></td><td>${order.orderer.messageToSupplier || "—"}</td></tr>
      </table>
      <h3>Leveransadress</h3>
      <p>
        ${order.delivery.company}<br>
        ${order.delivery.recipient}<br>
        ${order.delivery.address}<br>
        ${order.delivery.postalCode} ${order.delivery.city}<br>
        ${order.delivery.country}
      </p>
      <h3>Produkter</h3>
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr style="background:#1a237e;color:white">
            <th style="padding:8px;border:1px solid #ddd">Artikel</th>
            <th style="padding:8px;border:1px solid #ddd">Namn</th>
            <th style="padding:8px;border:1px solid #ddd">Titel</th>
            <th style="padding:8px;border:1px solid #ddd">Verksamhet</th>
            <th style="padding:8px;border:1px solid #ddd">Fäste</th>
            <th style="padding:8px;border:1px solid #ddd">Antal</th>
            <th style="padding:8px;border:1px solid #ddd">Extra magneter</th>
          </tr>
        </thead>
        <tbody>${buildProductRows(order.cart)}</tbody>
      </table>
    </div>`;
}

function buildConfirmationEmail(order) {
  const productList = order.cart.map(item => {
    const name = item.productType === "namnbrickor"
      ? `${item.badgeName} – ${item.name}`
      : `${item.badgeName} – ${item.title}`;
    return `<li>${name} (${item.quantity} st)</li>`;
  }).join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1a237e">Tack för din beställning!</h2>
      <p>Din beställning <strong>${order.orderNumber}</strong> har tagits emot och skickas till leverantören.</p>
      <h3>Beställda produkter</h3>
      <ul>${productList}</ul>
      <h3>Leveransadress</h3>
      <p>
        ${order.delivery.company}<br>
        ${order.delivery.recipient}<br>
        ${order.delivery.address}<br>
        ${order.delivery.postalCode} ${order.delivery.city}
      </p>
      <p style="color:#666;font-size:14px">Vid frågor, kontakta Region Jönköping.</p>
    </div>`;
}

function readOrders() {
  if (!fs.existsSync(DATA_FILE)) return [];
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
    if (!order || typeof order.orderNumber !== "string") continue;
    if (!order.orderNumber.startsWith(prefix)) continue;
    const parsed = parseInt(order.orderNumber.replace(prefix, ""), 10);
    if (Number.isFinite(parsed) && parsed > highestNumber) highestNumber = parsed;
  }
  return `${prefix}${highestNumber + 1}`;
}

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) return res.json({ success: true });
  return res.status(401).json({ success: false, message: "Fel lösenord" });
});

app.get("/api/orders", (req, res) => {
  const password = req.headers["x-admin-password"];
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ success: false, message: "Obehörig" });
  return res.json({ success: true, orders: readOrders() });
});

app.patch("/api/orders/:id/status", (req, res) => {
  const password = req.headers["x-admin-password"];
  const { id } = req.params;
  const { status } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ success: false, message: "Obehörig" });
  const allowedStatuses = ["ny", "påbörjad", "klar", "skickad"];
  if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: "Ogiltig status" });
  const orders = readOrders();
  const orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex === -1) return res.status(404).json({ success: false, message: "Beställningen hittades inte" });
  orders[orderIndex] = { ...orders[orderIndex], status };
  writeOrders(orders);
  return res.json({ success: true, message: "Status uppdaterad", order: orders[orderIndex] });
});

app.post("/api/orders", async (req, res) => {
  const order = req.body;
  if (!order || !Array.isArray(order.cart) || order.cart.length === 0) {
    return res.status(400).json({ success: false, message: "Tom beställning" });
  }
  const orders = readOrders();
  const orderNumber = getNextOrderNumber(orders);
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

  try {
    await transporter.sendMail({
      from: "noreply@namnskyltar-rjl.se",
      to: "order-rjl@jonkopingsskyltfabrik.se",
      subject: `Ny beställning ${orderNumber} – Region Jönköping`,
      html: buildManufacturerEmail(newOrder),
    });
    if (newOrder.orderer.ordererEmail) {
      await transporter.sendMail({
        from: "noreply@namnskyltar-rjl.se",
        to: newOrder.orderer.ordererEmail,
        subject: `Orderbekräftelse ${orderNumber}`,
        html: buildConfirmationEmail(newOrder),
      });
    }
  } catch (emailError) {
    console.error("Fel vid mailutskick:", emailError.message);
  }

  return res.json({ success: true, order: newOrder });
});

app.delete("/api/orders/:id", (req, res) => {
  const password = req.headers["x-admin-password"];
  const { id } = req.params;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ success: false, message: "Obehörig" });
  const orders = readOrders();
  const filteredOrders = orders.filter(o => o.id !== id);
  if (filteredOrders.length === orders.length) return res.status(404).json({ success: false, message: "Beställningen hittades inte" });
  writeOrders(filteredOrders);
  return res.json({ success: true, message: "Beställningen är borttagen" });
});

// Servera React-appen i produktion
app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Servera React-appen i produktion
app.use(express.static(path.join(__dirname, "./build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.listen(PORT, () => console.log(`Server kör på port ${PORT}`));
