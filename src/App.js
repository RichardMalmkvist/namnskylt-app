import { useMemo, useState } from "react";
import PageContainer from "./components/layout/PageContainer";
import AppHeader from "./components/layout/AppHeader";
import { printStyle } from "./styles/printStyles";
import LandingPage from "./pages/LandingPage";
import CatalogPage from "./pages/CatalogPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CartPage from "./pages/CartPage";
import ProductFormPage from "./pages/ProductFormPage";
import {
  getProductTypeLabel,
  isProfessionProductType,
} from "./data/productHelpers";
import {
  EMPTY_DELIVERY,
  EMPTY_ORDERER,
  getEmptyProductForm,
  getProfessionInitialForm,
} from "./data/formDefaults";
import {
  createCartItem,
  createDirectCartItem,
  validateCurrentItem,
} from "./data/cartHelpers";
import {
  getProductFlowType,
  getProductsByCategory,
  isProfessionFlowProduct,
} from "./data/products";
import {
  getCartItemDisplayRows,
  getPackingSlipDescriptionRows,
} from "./data/orderDisplayHelpers";
import PackingSlipModal from "./components/orders/PackingSlipModal";

export default function App() {
  const [step, setStep] = useState("landing");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [openedFromAutoCategory, setOpenedFromAutoCategory] = useState(false);

  const [productForm, setProductForm] = useState(getEmptyProductForm());
  const [orderer, setOrderer] = useState(EMPTY_ORDERER);
  const [delivery, setDelivery] = useState(EMPTY_DELIVERY);

  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPackingSlip, setShowPackingSlip] = useState(false);
  const [packingSlipOrder, setPackingSlipOrder] = useState(null);
  const [isUpdatingOrderStatus, setIsUpdatingOrderStatus] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminPasswordSearch, setAdminPasswordSearch] = useState("");
  const [ordersSortBy, setOrdersSortBy] = useState("createdAt");
  const [ordersSortDirection, setOrdersSortDirection] = useState("desc");

  function showTemporaryMessage(message, setter = setSuccessMessage) {
    setter(message);

    setTimeout(() => {
      setter("");
    }, 3000);
  }

  function addCartItem(item) {
    setCart((prev) => [...prev, item]);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetProductForm() {
    setProductForm(getEmptyProductForm());
  }

  function clearSelectedProduct() {
    setSelectedProductType(null);
    setSelectedBadge(null);
    setOpenedFromAutoCategory(false);
  }

  function goToLandingFromLogo() {
    setSelectedCategory(null);
    clearSelectedProduct();
    setSuccessMessage("");
    resetProductForm();
    setStep("landing");
    scrollToTop();
  }

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cart]
  );

  function getHeaderProps(options = {}) {
    const {
      showCartButton = true,
      showLoginButton = true,
      disableLoginAction = false,
    } = options;

    return {
      cartCount,
      onCartClick: () => setStep("cart"),
      onLoginClick: disableLoginAction ? () => {} : () => setStep("adminLogin"),
      onLogoClick: goToLandingFromLogo,
      showCartButton,
      showLoginButton,
    };
  }

  function openCategory(category, options = {}) {
    const { skipAutoOpen = false } = options;

    setSelectedCategory(category);
    clearSelectedProduct();
    setSuccessMessage("");
    resetProductForm();

    if (!skipAutoOpen && category?.autoOpenSingleProduct) {
      const categoryProducts = getProductsByCategory(category.id);

      if (categoryProducts.length === 1) {
        setOpenedFromAutoCategory(true);
        openProduct(categoryProducts[0], { preserveAutoCategoryFlag: true });
        return;
      }
    }

    setStep("catalog");
    scrollToTop();
  }

  function openNameBadges() {
    openCategory({
      id: "namnbrickor",
      title: "Namnbrickor",
    });
  }

  function openProduct(product, options = {}) {
    const { preserveAutoCategoryFlag = false } = options;

    if (!product) return;

    const flowType = getProductFlowType(product);

    setSelectedBadge(product);
    setSuccessMessage("");

    if (!preserveAutoCategoryFlag) {
      setOpenedFromAutoCategory(false);
    }

    if (flowType === "direct") {
      return;
    }

    if (flowType === "profession") {
      setSelectedProductType({
        id: "yrkestitelsskyltar",
        title: product.name,
        flowType: "profession",
      });
      setProductForm(getProfessionInitialForm(product));
      setStep("form");
      scrollToTop();
      return;
    }

    setSelectedProductType({
      id: product.productType || product.categoryId,
      title: product.name,
      flowType: product.flowType || "form",
    });
    resetProductForm();
    setStep("form");
    scrollToTop();
  }

  function addDirectProductToCart(product, quantity, directFieldValues = {}) {
    const newItem = createDirectCartItem(product, quantity, directFieldValues);

    addCartItem(newItem);
    showTemporaryMessage(`${product.name} lades i kundkorgen.`);
    scrollToTop();
  }

  async function handleAdminLogin() {
    setAdminError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: adminPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAdminError(data.message || "Inloggningen misslyckades.");
        return;
      }

      setIsAdminLoggedIn(true);
      setStep("orders");
      await fetchOrders(adminPassword);
      scrollToTop();
    } catch {
      setAdminError("Kunde inte ansluta till servern.");
    }
  }

  async function fetchOrders(passwordToUse = adminPassword) {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "x-admin-password": passwordToUse,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setAdminError(data.message || "Kunde inte hämta beställningar.");
        return;
      }

      setOrders(data.orders || []);
    } catch {
      setAdminError("Kunde inte hämta beställningar.");
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    setAdminError("");
    setIsUpdatingOrderStatus(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": adminPassword,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAdminError(data.message || "Kunde inte uppdatera status.");
        return;
      }

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? data.order : order))
      );

      setSelectedOrder(null);
    } catch {
      setAdminError("Kunde inte uppdatera status.");
    } finally {
      setIsUpdatingOrderStatus(false);
    }
  }

  async function deleteOrder(orderId) {
    const confirmed = window.confirm("Vill du verkligen ta bort beställningen?");

    if (!confirmed) return;

    setAdminError("");

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": adminPassword,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setAdminError(data.message || "Kunde inte ta bort beställningen.");
        return;
      }

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setSelectedOrder(null);
    } catch {
      setAdminError("Kunde inte ta bort beställningen.");
    }
  }

  async function submitOrderToBackend() {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          orderer,
          delivery,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Kunde inte spara beställningen.");
        return;
      }

      setShowOrderSummary(false);
      setCart([]);
      setOrderer(EMPTY_ORDERER);
      setDelivery(EMPTY_DELIVERY);
      setSelectedCategory(null);
      clearSelectedProduct();
      resetProductForm();
      setSuccessMessage("");
      setStep("landing");

      showTemporaryMessage(
        `Beställningen har skickats. Ordernummer: ${
          data.order?.orderNumber || "-"
        }`,
        setToastMessage
      );

      scrollToTop();
    } catch {
      alert("Kunde inte ansluta till servern.");
    }
  }

  function goBackToLanding() {
    setSelectedBadge(null);
    setSelectedProductType(null);
    setSelectedCategory(null);
    setOpenedFromAutoCategory(false);
    resetProductForm();
    setSuccessMessage("");
    setOrderer((prev) => ({
      ...prev,
      accountNumber: "",
    }));
    setStep("landing");
    scrollToTop();
  }

  function setStepToLanding() {
    setOrderer((prev) => ({
      ...prev,
      accountNumber: "",
    }));
    setSelectedCategory(null);
    clearSelectedProduct();
    resetProductForm();
    setSuccessMessage("");
    setStep("landing");
    scrollToTop();
  }

  function goBackFromForm() {
    setSuccessMessage("");
    setSelectedBadge(null);
    resetProductForm();

    if (openedFromAutoCategory) {
      setSelectedProductType(null);
      setOpenedFromAutoCategory(false);
      setSelectedCategory(null);
      setStep("landing");
      scrollToTop();
      return;
    }

    setStep("catalog");
    scrollToTop();
  }

  function addCurrentItemToCart() {
    const error = validateCurrentItem(
      selectedBadge,
      selectedProductType,
      productForm
    );

    if (error) {
      alert(error);
      return;
    }

    const newItem = createCartItem(
      selectedBadge,
      selectedProductType,
      productForm
    );

    addCartItem(newItem);

    if (
      isProfessionFlowProduct(selectedBadge) ||
      isProfessionProductType(selectedProductType)
    ) {
      showTemporaryMessage("Yrkestitelsskylten lades i kundkorgen.");
      scrollToTop();
      return;
    }

    showTemporaryMessage(
      `${selectedBadge?.name || "Produkten"} lades i kundkorgen.`
    );
    resetProductForm();
    scrollToTop();
  }

  function updateCartQuantity(itemId, newQuantity) {
    const safeQuantity = Math.max(1, Number(newQuantity) || 1);

    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: safeQuantity } : item
      )
    );
  }

  function removeFromCart(itemId) {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  }

  function validateOrderDetails() {
    if (cart.length === 0) return "Kundkorgen är tom.";
    if (!orderer.accountNumber.trim()) {
      return "Du måste fylla i Ansvarsnummer innan du beställer.";
    }
    return null;
  }

  function renderOrderItemDetails(item) {
    const rows = getCartItemDisplayRows(item);

    return rows.map((row, index) => (
      <div key={`${item.id}-${row.label}-${index}`}>
        <strong>{row.label}:</strong> {row.value}
      </div>
    ));
  }

  function renderPackingSlipDescription(item) {
    const rows = getPackingSlipDescriptionRows(item);

    return rows.map((row, index) => {
      if (!row.label) {
        return <div key={`${item.id}-desc-${index}`}>{row.value}</div>;
      }

      return (
        <div key={`${item.id}-${row.label}-${index}`}>
          <strong>{row.label}:</strong> {row.value}
        </div>
      );
    });
  }

  if (step === "landing") {
    return (
      <LandingPage
        toastMessage={toastMessage}
        getHeaderProps={getHeaderProps}
        selectedCategory={selectedCategory}
        openCategory={openCategory}
        openNameBadges={openNameBadges}
        primaryButtonStyle={primaryButtonStyle}
        secondaryButtonStyle={secondaryButtonStyle}
        cardStyle={cardStyle}
      />
    );
  }

  if (step === "adminLogin") {
    return (
      <AdminLoginPage
        getHeaderProps={getHeaderProps}
        goBackToLanding={goBackToLanding}
        backButtonStyle={backButtonStyle}
        cardStyle={cardStyle}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        inputStyle={inputStyle}
        adminError={adminError}
        handleAdminLogin={handleAdminLogin}
        primaryButtonStyle={primaryButtonStyle}
      />
    );
  }

  if (step === "orders") {
    const filteredOrders = orders.filter((order) => {
      const search = adminPasswordSearch.trim().toLowerCase();

      if (!search) return true;

      const customerName = order.orderer?.ordererName?.toLowerCase() || "";
      const email = order.orderer?.ordererEmail?.toLowerCase() || "";
      const accountNumber = order.orderer?.accountNumber?.toLowerCase() || "";
      const company = order.delivery?.company?.toLowerCase() || "";
      const recipient = order.delivery?.recipient?.toLowerCase() || "";
      const city = order.delivery?.city?.toLowerCase() || "";
      const status = order.status?.toLowerCase() || "";
      const orderNumber = order.orderNumber?.toLowerCase() || "";
      const itemsText = (order.cart || [])
        .map((item) => `${item.badgeName} ${item.title || ""} ${item.name || ""}`)
        .join(" ")
        .toLowerCase();

      return (
        customerName.includes(search) ||
        email.includes(search) ||
        accountNumber.includes(search) ||
        company.includes(search) ||
        recipient.includes(search) ||
        city.includes(search) ||
        status.includes(search) ||
        orderNumber.includes(search) ||
        itemsText.includes(search)
      );
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      let aValue = "";
      let bValue = "";

      if (ordersSortBy === "createdAt") {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      }

      if (ordersSortBy === "status") {
        aValue = a.status || "";
        bValue = b.status || "";
      }

      if (ordersSortBy === "customer") {
        aValue = a.orderer?.ordererName || "";
        bValue = b.orderer?.ordererName || "";
      }

      if (ordersSortBy === "accountNumber") {
        aValue = a.orderer?.accountNumber || "";
        bValue = b.orderer?.accountNumber || "";
      }

      if (ordersSortBy === "email") {
        aValue = a.orderer?.ordererEmail || "";
        bValue = b.orderer?.ordererEmail || "";
      }

      if (ordersSortBy === "city") {
        aValue = a.delivery?.city || "";
        bValue = b.delivery?.city || "";
      }

      if (ordersSortBy === "quantity") {
        aValue = (a.cart || []).reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        );
        bValue = (b.cart || []).reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        );
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return ordersSortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      const result = String(aValue).localeCompare(String(bValue), "sv");
      return ordersSortDirection === "asc" ? result : -result;
    });

    return (
      <PageContainer>
        <style>{printStyle}</style>

        <AppHeader
          {...getHeaderProps({
            showLoginButton: false,
            disableLoginAction: true,
          })}
        />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <button
            type="button"
            onClick={() => {
              setSelectedOrder(null);
              setShowPackingSlip(false);
              setPackingSlipOrder(null);
              goBackToLanding();
            }}
            style={backButtonStyle}
          >
            ← Tillbaka
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <div>
              <h1 style={{ fontSize: 40, margin: 0 }}>Beställningar</h1>
              <p style={{ margin: "8px 0 0", color: "#555" }}>
                {sortedOrders.length} av {orders.length} beställningar visas
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchOrders()}
              style={secondaryButtonStyle}
            >
              Uppdatera
            </button>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "end",
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: 18 }}>
                Lista över beställningar
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "end",
                }}
              >
                <div>
                  <label
                    htmlFor="ordersSearch"
                    style={{ display: "block", marginBottom: 6 }}
                  >
                    Sök
                  </label>
                  <input
                    id="ordersSearch"
                    type="text"
                    placeholder="Sök beställare, ordernummer, ansvarsnummer..."
                    value={adminPasswordSearch}
                    onChange={(e) => setAdminPasswordSearch(e.target.value)}
                    style={{ ...inputStyle, width: 320, maxWidth: "100%" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="ordersSortBy"
                    style={{ display: "block", marginBottom: 6 }}
                  >
                    Sortera efter
                  </label>
                  <select
                    id="ordersSortBy"
                    value={ordersSortBy}
                    onChange={(e) => setOrdersSortBy(e.target.value)}
                    style={{ ...inputStyle, width: 220 }}
                  >
                    <option value="createdAt">Datum</option>
                    <option value="status">Status</option>
                    <option value="customer">Kund</option>
                    <option value="accountNumber">Ansvarsnummer</option>
                    <option value="email">E-post</option>
                    <option value="city">Postort</option>
                    <option value="quantity">Antal</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ordersSortDirection"
                    style={{ display: "block", marginBottom: 6 }}
                  >
                    Ordning
                  </label>
                  <select
                    id="ordersSortDirection"
                    value={ordersSortDirection}
                    onChange={(e) => setOrdersSortDirection(e.target.value)}
                    style={{ ...inputStyle, width: 180 }}
                  >
                    <option value="desc">Fallande</option>
                    <option value="asc">Stigande</option>
                  </select>
                </div>
              </div>
            </div>

            {!isAdminLoggedIn ? (
              <div>Du måste logga in först.</div>
            ) : sortedOrders.length === 0 ? (
              <div>Inga beställningar hittades.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 1150,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#009846", color: "black" }}>
                      <th style={tableHeaderStyle}>Skapad</th>
                      <th style={tableHeaderStyle}>Ordernummer</th>
                      <th style={tableHeaderStyle}>Typ</th>
                      <th style={tableHeaderStyle}>Antal</th>
                      <th style={tableHeaderStyle}>Beställare</th>
                      <th style={tableHeaderStyle}>Ansvarsnummer</th>
                      <th style={tableHeaderStyle}>E-post</th>
                      <th style={tableHeaderStyle}>Leveransadress</th>
                      <th style={tableHeaderStyle}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedOrders.map((order, index) => {
                      const totalQuantity = (order.cart || []).reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0
                      );

                      const types = Array.from(
                        new Set(
                          (order.cart || []).map((item) =>
                            getProductTypeLabel(item.productType)
                          )
                        )
                      ).join(", ");

                      const deliveryText = [
                        order.delivery?.company,
                        order.delivery?.recipient,
                        order.delivery?.address,
                        order.delivery?.postalCode,
                        order.delivery?.city,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            background:
                              selectedOrder?.id === order.id
                                ? "#e8f5e9"
                                : index % 2 === 0
                                ? "#fafafa"
                                : "white",
                            borderBottom: "1px solid #e5e5e5",
                            verticalAlign: "top",
                            cursor: "pointer",
                          }}
                        >
                          <td style={tableCellStyle}>
                            {new Date(order.createdAt).toLocaleDateString("sv-SE")}
                          </td>

                          <td style={tableCellStyle}>{order.orderNumber || "-"}</td>
                          <td style={tableCellStyle}>{types || "-"}</td>
                          <td style={tableCellStyle}>{totalQuantity}</td>

                          <td style={tableCellStyle}>
                            {order.orderer?.ordererName || "-"}
                          </td>

                          <td style={tableCellStyle}>
                            {order.orderer?.accountNumber || "-"}
                          </td>

                          <td style={tableCellStyle}>
                            {order.orderer?.ordererEmail || "-"}
                          </td>

                          <td style={tableCellStyle}>{deliveryText || "-"}</td>

                          <td style={tableCellStyle}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "6px 10px",
                                borderRadius: 999,
                                background:
                                  order.status === "ny"
                                    ? "#fff3cd"
                                    : order.status === "påbörjad"
                                    ? "#e3f2fd"
                                    : order.status === "klar"
                                    ? "#e8f5e9"
                                    : "#ede7f6",
                                color:
                                  order.status === "ny"
                                    ? "#8a6d3b"
                                    : order.status === "påbörjad"
                                    ? "#0d47a1"
                                    : order.status === "klar"
                                    ? "#1b5e20"
                                    : "#4527a0",
                                fontWeight: "bold",
                                fontSize: 13,
                              }}
                            >
                              {order.status || "ny"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedOrder && (
            <div style={modalOverlayStyle}>
              <div style={modalContentStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <h2 style={{ margin: 0 }}>Beställning</h2>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setPackingSlipOrder(selectedOrder);
                        setShowPackingSlip(true);
                        setSelectedOrder(null);
                      }}
                      style={primaryButtonStyle}
                    >
                      Visa följesedel
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteOrder(selectedOrder.id)}
                      style={dangerButtonStyle}
                    >
                      Ta bort beställning
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      style={secondaryButtonStyle}
                    >
                      Stäng
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div>
                    <strong>Ordernummer:</strong>{" "}
                    {selectedOrder.orderNumber || selectedOrder.id}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <strong>Datum:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString("sv-SE")}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <label
                      htmlFor="selectedOrderStatus"
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontWeight: "bold",
                      }}
                    >
                      Status
                    </label>

                    <select
                      id="selectedOrderStatus"
                      value={selectedOrder.status || "ny"}
                      onChange={(e) =>
                        updateOrderStatus(selectedOrder.id, e.target.value)
                      }
                      disabled={isUpdatingOrderStatus}
                      style={{ ...inputStyle, maxWidth: 260 }}
                    >
                      <option value="ny">Ny</option>
                      <option value="påbörjad">Påbörjad</option>
                      <option value="klar">Klar</option>
                      <option value="skickad">Skickad</option>
                    </select>

                    {isUpdatingOrderStatus && (
                      <div style={{ marginTop: 8, color: "#555" }}>
                        Sparar status...
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={sectionTitleStyle}>Produkter</div>

                  <div style={{ display: "grid", gap: 12 }}>
                    {(selectedOrder.cart || []).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: 12,
                          padding: 14,
                          background: "#fafafa",
                        }}
                      >
                        <div style={{ fontWeight: "bold", marginBottom: 6 }}>
                          {item.badgeName}
                        </div>

                        <div>
                          <strong>Typ:</strong> {getProductTypeLabel(item.productType)}
                        </div>

                        {renderOrderItemDetails(item)}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={sectionTitleStyle}>Beställare</div>
                  <div>
                    <span style={{ color: "#666" }}>Namn:</span>{" "}
                    {selectedOrder.orderer?.ordererName || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>E-post:</span>{" "}
                    {selectedOrder.orderer?.ordererEmail || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Mobilnummer:</span>{" "}
                    {selectedOrder.orderer?.ordererPhone || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Ansvarsnummer:</span>{" "}
                    {selectedOrder.orderer?.accountNumber || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>
                      Meddelande till leverantör:
                    </span>{" "}
                    {selectedOrder.orderer?.messageToSupplier || "-"}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={sectionTitleStyle}>Leveransadress</div>
                  <div>
                    <span style={{ color: "#666" }}>Företag:</span>{" "}
                    {selectedOrder.delivery?.company || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Mottagare:</span>{" "}
                    {selectedOrder.delivery?.recipient || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Adress:</span>{" "}
                    {selectedOrder.delivery?.address || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Postnummer:</span>{" "}
                    {selectedOrder.delivery?.postalCode || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Postort:</span>{" "}
                    {selectedOrder.delivery?.city || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Land:</span>{" "}
                    {selectedOrder.delivery?.country || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <PackingSlipModal
            packingSlipOrder={packingSlipOrder}
            showPackingSlip={showPackingSlip}
            setShowPackingSlip={setShowPackingSlip}
            setPackingSlipOrder={setPackingSlipOrder}
            renderPackingSlipDescription={renderPackingSlipDescription}
            primaryButtonStyle={primaryButtonStyle}
            secondaryButtonStyle={secondaryButtonStyle}
            packingSlipOverlayStyle={packingSlipOverlayStyle}
            packingSlipStyle={packingSlipStyle}
            packingSlipActionsStyle={packingSlipActionsStyle}
            tableHeaderStyle={tableHeaderStyle}
            tableCellStyle={tableCellStyle}
          />
        </div>
      </PageContainer>
    );
  }

  if (step === "cart") {
    return (
      <CartPage
        getHeaderProps={getHeaderProps}
        goBackToLanding={goBackToLanding}
        backButtonStyle={backButtonStyle}
        cart={cart}
        cardStyle={cardStyle}
        inputStyle={inputStyle}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        orderer={orderer}
        setOrderer={setOrderer}
        delivery={delivery}
        setDelivery={setDelivery}
        validateOrderDetails={validateOrderDetails}
        setShowOrderSummary={setShowOrderSummary}
        secondaryButtonStyle={secondaryButtonStyle}
        primaryButtonStyle={primaryButtonStyle}
        setStepToLanding={setStepToLanding}
        showOrderSummary={showOrderSummary}
        submitOrderToBackend={submitOrderToBackend}
        modalOverlayStyle={modalOverlayStyle}
        modalContentStyle={modalContentStyle}
        sectionTitleStyle={sectionTitleStyle}
      />
    );
  }

  if (step === "catalog") {
    return (
      <CatalogPage
        getHeaderProps={getHeaderProps}
        goBackToLanding={goBackToLanding}
        backButtonStyle={backButtonStyle}
        selectedCategory={selectedCategory}
        openCategory={openCategory}
        secondaryButtonStyle={secondaryButtonStyle}
        primaryButtonStyle={primaryButtonStyle}
        cardStyle={cardStyle}
        inputStyle={inputStyle}
        openProduct={openProduct}
        addDirectProductToCart={addDirectProductToCart}
      />
    );
  }

  if (step === "form") {
    return (
      <ProductFormPage
        getHeaderProps={getHeaderProps}
        goBackFromForm={goBackFromForm}
        backButtonStyle={backButtonStyle}
        selectedCategory={selectedCategory}
        openCategory={openCategory}
        selectedBadge={selectedBadge}
        selectedProductType={selectedProductType}
        successMessage={successMessage}
        productForm={productForm}
        setProductForm={setProductForm}
        addCurrentItemToCart={addCurrentItemToCart}
        cardStyle={cardStyle}
        inputStyle={inputStyle}
        primaryButtonStyle={primaryButtonStyle}
      />
    );
  }

  return (
    <LandingPage
      toastMessage={toastMessage}
      getHeaderProps={getHeaderProps}
      selectedCategory={selectedCategory}
      openCategory={openCategory}
      openNameBadges={openNameBadges}
      primaryButtonStyle={primaryButtonStyle}
      secondaryButtonStyle={secondaryButtonStyle}
      cardStyle={cardStyle}
    />
  );
}

const inputStyle = {
  width: "100%",
  maxWidth: 420,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #dddddd",
  marginTop: 6,
  boxSizing: "border-box",
  fontSize: 15,
  background: "white",
};

const primaryButtonStyle = {
  padding: "13px 20px",
  borderRadius: 12,
  border: "none",
  background: "#111111",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 15,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const secondaryButtonStyle = {
  padding: "13px 20px",
  borderRadius: 12,
  border: "1px solid #e2e2e2",
  background: "white",
  color: "#111111",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 15,
};

const cardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
};

const dangerButtonStyle = {
  padding: "13px 20px",
  borderRadius: 12,
  border: "none",
  background: "#c62828",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 15,
};

const backButtonStyle = {
  marginBottom: 24,
  background: "white",
  border: "1px solid #e4e4e4",
  borderRadius: 12,
  padding: "11px 16px",
  cursor: "pointer",
  fontWeight: 600,
};

const sectionTitleStyle = {
  marginBottom: 20,
  marginTop: 10,
  fontWeight: 700,
  fontSize: 22,
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "100px 20px 20px",
  zIndex: 1000,
};

const modalContentStyle = {
  background: "white",
  borderRadius: 22,
  padding: 28,
  width: "100%",
  maxWidth: 980,
  boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
  maxHeight: "85vh",
  overflow: "auto",
};

const packingSlipOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 3000,
};

const packingSlipStyle = {
  background: "white",
  borderRadius: 22,
  padding: 28,
  paddingBottom: 40,
  width: "100%",
  maxWidth: 950,
  boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
  maxHeight: "90vh",
  overflow: "auto",
};

const packingSlipActionsStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 20,
};

const tableHeaderStyle = {
  textAlign: "left",
  padding: "14px 12px",
  fontSize: 14,
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  padding: "14px 12px",
  fontSize: 14,
  lineHeight: 1.45,
};