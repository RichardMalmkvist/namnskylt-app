import { useMemo, useState } from "react";
import {
  PRODUCT_TYPES,
  NAME_BADGES,
  PROFESSION_BADGES,
} from "./data/constants";
import PageContainer from "./components/layout/PageContainer";
import TopBar from "./components/layout/TopBar";
import ProductTypeCard from "./components/products/ProductTypeCard";
import BadgeCard from "./components/products/BadgeCard";
import AutoFitText from "./components/products/AutoFitText";

const PROFESSION_CHOICES = [
  { id: "lakare", label: "Läkare", color: "#c62828", textColor: "#ffffff" },
  {
    id: "sjukskoterska",
    label: "Sjuksköterska",
    color: "#1565c0",
    textColor: "#ffffff",
  },
  {
    id: "barnmorska",
    label: "Barnmorska",
    color: "#1565c0",
    textColor: "#ffffff",
  },
  {
    id: "underskoterska",
    label: "Undersköterska",
    color: "#2e7d32",
    textColor: "#ffffff",
  },
  {
    id: "fysioterapeut",
    label: "Fysioterapeut",
    color: "#ef6c00",
    textColor: "#ffffff",
  },
  {
    id: "arbetsterapeut",
    label: "Arbetsterapeut",
    color: "#ef6c00",
    textColor: "#ffffff",
  },
  {
    id: "vardadministrator",
    label: "Vårdadministratör",
    color: "#7b1fa2",
    textColor: "#ffffff",
  },
  {
    id: "administrativ_samordnare",
    label: "Administrativ samordnare",
    color: "#7b1fa2",
    textColor: "#ffffff",
  },
  {
    id: "tandlakare",
    label: "Tandläkare",
    color: "#4fc3f7",
    textColor: "#ffffff",
  },
  {
    id: "tandhygienist",
    label: "Tandhygienist",
    color: "#4fc3f7",
    textColor: "#ffffff",
  },
  {
    id: "tandskoterska",
    label: "Tandsköterska",
    color: "#4fc3f7",
    textColor: "#ffffff",
  },
  {
    id: "receptionist",
    label: "Receptionist",
    color: "#4fc3f7",
    textColor: "#ffffff",
  },
  {
    id: "ortopedassistent",
    label: "Ortopedassistent",
    color: "#4fc3f7",
    textColor: "#ffffff",
  },
  {
    id: "biomedicinsk_analytiker",
    label: "Biomedicinsk analytiker",
    color: "#7b1e3a",
    textColor: "#ffffff",
  },
  {
    id: "servicepersonal",
    label: "Servicepersonal",
    color: "#212121",
    textColor: "#ffffff",
  },
  {
    id: "student",
    label: "Student",
    color: "#ffffff",
    textColor: "#000000",
  },
];

const EMPTY_PRODUCT_FORM = {
  orgLine1: "",
  orgLine2: "",
  name: "",
  title: "",
  titleLine2: "",
  professionChoiceId: "lakare",
  fastening: "",
  quantity: 1,
  extraMagnets: 0,
};

const EMPTY_ORDERER = {
  ordererName: "",
  ordererEmail: "",
  ordererPhone: "",
  messageToSupplier: "",
  accountNumber: "",
};

const EMPTY_DELIVERY = {
  company: "",
  recipient: "",
  address: "",
  postalCode: "",
  city: "",
  country: "Sverige",
};

function isProfessionProductType(typeOrId) {
  const id = typeof typeOrId === "string" ? typeOrId : typeOrId?.id;
  return id === "yrkestitelsskyltar" || id === "yrkestitelsskylt";
}

function getProductTypeLabel(type) {
  return isProfessionProductType(type) ? "Yrkestitelsskylt" : "Namnbricka";
}

function getChosenProfession(choiceId) {
  return (
    PROFESSION_CHOICES.find((choice) => choice.id === choiceId) ||
    PROFESSION_CHOICES[0]
  );
}

function getNameBadgePreviewConfig(id, mini = false) {
  const textColor = "#1f1b1c";
  const subColor = "#3b2d2d";
  const orgColor = "#1f1b1c";

  if (mini) {
    switch (id) {
      case 1:
        return {
          showName: true,
          showTitle1: true,
          showTitle2: false,
          showOrg1: false,
          showOrg2: false,
          name: {
            top: "14%",
            left: "6%",
            fontSize: "10px",
            fontWeight: 700,
            color: textColor,
          },
          title1: {
            top: "41%",
            left: "6%",
            fontSize: "6px",
            fontWeight: 400,
            color: subColor,
          },
          title2: {},
          org1: {},
          org2: {},
        };
      case 2:
        return {
          showName: true,
          showTitle1: true,
          showTitle2: false,
          showOrg1: true,
          showOrg2: false,
          name: {
            top: "14%",
            left: "6%",
            fontSize: "10px",
            fontWeight: 700,
            color: textColor,
          },
          title1: {
            top: "41%",
            left: "6%",
            fontSize: "6px",
            fontWeight: 400,
            color: subColor,
          },
          title2: {},
          org1: {
            top: "70%",
            left: "6%",
            fontSize: "7px",
            fontWeight: 700,
            color: orgColor,
          },
          org2: {},
        };
      case 3:
        return {
          showName: true,
          showTitle1: true,
          showTitle2: true,
          showOrg1: false,
          showOrg2: false,
          name: {
            top: "14%",
            left: "6%",
            fontSize: "10px",
            fontWeight: 700,
            color: textColor,
          },
          title1: {
            top: "41%",
            left: "6%",
            fontSize: "6px",
            fontWeight: 400,
            color: subColor,
          },
          title2: {
            top: "53%",
            left: "6%",
            fontSize: "6px",
            fontWeight: 400,
            color: subColor,
          },
          org1: {},
          org2: {},
        };
      case 4:
        return {
          showName: true,
          showTitle1: true,
          showTitle2: false,
          showOrg1: true,
          showOrg2: true,
          name: {
            top: "14%",
            left: "6%",
            fontSize: "10px",
            fontWeight: 700,
            color: textColor,
          },
          title1: {
            top: "41%",
            left: "6%",
            fontSize: "6px",
            fontWeight: 400,
            color: subColor,
          },
          title2: {},
          org1: {
            top: "66%",
            left: "6%",
            fontSize: "7px",
            fontWeight: 700,
            color: orgColor,
          },
          org2: {
            top: "78%",
            left: "6%",
            fontSize: "7px",
            fontWeight: 700,
            color: orgColor,
          },
        };
      default:
        return {
          showName: true,
          showTitle1: true,
          showTitle2: false,
          showOrg1: false,
          showOrg2: false,
          name: {
            top: "14%",
            left: "6%",
            fontSize: "10px",
            fontWeight: 700,
            color: textColor,
          },
          title1: {
            top: "41%",
            left: "6%",
            fontSize: "6px",
            fontWeight: 400,
            color: subColor,
          },
          title2: {},
          org1: {},
          org2: {},
        };
    }
  }

  switch (id) {
    case 1:
      return {
        showName: true,
        showTitle1: true,
        showTitle2: false,
        showOrg1: false,
        showOrg2: false,
        name: {
          top: "14%",
          left: "6%",
          fontSize: "clamp(16px, 3vw, 48px)",
          fontWeight: 700,
          color: textColor,
        },
        title1: {
          top: "41%",
          left: "6%",
          fontSize: "clamp(10px, 1.5vw, 22px)",
          fontWeight: 400,
          color: subColor,
        },
        title2: {},
        org1: {},
        org2: {},
      };
    case 2:
      return {
        showName: true,
        showTitle1: true,
        showTitle2: false,
        showOrg1: true,
        showOrg2: false,
        name: {
          top: "14%",
          left: "6%",
          fontSize: "clamp(16px, 3vw, 48px)",
          fontWeight: 700,
          color: textColor,
        },
        title1: {
          top: "41%",
          left: "6%",
          fontSize: "clamp(10px, 1.5vw, 22px)",
          fontWeight: 400,
          color: subColor,
        },
        title2: {},
        org1: {
          top: "69%",
          left: "6%",
          fontSize: "clamp(10px, 1.6vw, 24px)",
          fontWeight: 700,
          color: orgColor,
        },
        org2: {},
      };
    case 3:
      return {
        showName: true,
        showTitle1: true,
        showTitle2: true,
        showOrg1: false,
        showOrg2: false,
        name: {
          top: "14%",
          left: "6%",
          fontSize: "clamp(16px, 3vw, 48px)",
          fontWeight: 700,
          color: textColor,
        },
        title1: {
          top: "41%",
          left: "6%",
          fontSize: "clamp(10px, 1.5vw, 22px)",
          fontWeight: 400,
          color: subColor,
        },
        title2: {
          top: "53%",
          left: "6%",
          fontSize: "clamp(10px, 1.5vw, 22px)",
          fontWeight: 400,
          color: subColor,
        },
        org1: {},
        org2: {},
      };
    case 4:
      return {
        showName: true,
        showTitle1: true,
        showTitle2: false,
        showOrg1: true,
        showOrg2: true,
        name: {
          top: "14%",
          left: "6%",
          fontSize: "clamp(16px, 3vw, 48px)",
          fontWeight: 700,
          color: textColor,
        },
        title1: {
          top: "41%",
          left: "6%",
          fontSize: "clamp(10px, 1.5vw, 22px)",
          fontWeight: 400,
          color: subColor,
        },
        title2: {},
        org1: {
          top: "64%",
          left: "6%",
          fontSize: "clamp(10px, 1.6vw, 24px)",
          fontWeight: 700,
          color: orgColor,
        },
        org2: {
          top: "77%",
          left: "6%",
          fontSize: "clamp(10px, 1.6vw, 24px)",
          fontWeight: 700,
          color: orgColor,
        },
      };
    default:
      return {
        showName: true,
        showTitle1: true,
        showTitle2: false,
        showOrg1: false,
        showOrg2: false,
        name: {
          top: "14%",
          left: "6%",
          fontSize: "clamp(16px, 3vw, 48px)",
          fontWeight: 700,
          color: textColor,
        },
        title1: {
          top: "41%",
          left: "6%",
          fontSize: "clamp(10px, 1.5vw, 22px)",
          fontWeight: 400,
          color: subColor,
        },
        title2: {},
        org1: {},
        org2: {},
      };
  }
}

function ProfessionBadgePreview({
  title,
  professionChoiceId,
  maxWidth = 700,
  mini = false,
}) {
  const selectedProfession = getChosenProfession(professionChoiceId);
  const displayText = title || selectedProfession.label;

  return (
    <div style={{ marginBottom: mini ? 0 : 30 }}>
      <div
        style={{
          width: "100%",
          maxWidth,
          aspectRatio: mini ? "85 / 24" : "85 / 22",
          borderRadius: mini ? 8 : 12,
          overflow: "hidden",
          background: selectedProfession.color,
          border: selectedProfession.id === "student" ? "1px solid #ccc" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: mini ? "0 6px" : "0 10px",
          boxSizing: "border-box",
        }}
      >
        <AutoFitText
          text={displayText}
          maxWidth={mini ? 160 : 650}
          maxFontSize={mini ? 26 : 85}
          minFontSize={mini ? 10 : 18}
          safetyPadding={mini ? 6 : 30}
          style={{
            color: selectedProfession.textColor,
            textAlign: "center",
            fontWeight: "500",
            lineHeight: 1.12,
            padding: mini ? "0 6px" : "0 8px",
            boxSizing: "border-box",
          }}
        />

      </div>
    </div>
  );
}

function NameBadgePreview({ badgeId, productForm, maxWidth = 900, mini = false }) {
  const config = getNameBadgePreviewConfig(badgeId, mini);

  const safeOrgLine1 = productForm.orgLine1 || "Verksamhetsnamn";
  const safeOrgLine2 = productForm.orgLine2 || "2 rader";
  const safeName = productForm.name || "Namn Efternamn";
  const safeTitle = productForm.title || "Titel";
  const safeTitleLine2 = productForm.titleLine2 || "Titel";

  return (
    <div style={{ marginBottom: mini ? 0 : 30 }}>
      <div style={{ position: "relative", width: "100%", maxWidth }}>
        <img
          src="/namnskylt blank.jpg"
          alt="Preview namnskylt"
          style={{
            width: "100%",
            display: "block",
            borderRadius: mini ? 8 : 12,
          }}
        />

        {config.showName && (
          <AutoFitText
            text={safeName}
            maxWidth={mini ? 160 : 520}
            maxFontSize={mini ? 10 : 40}
            minFontSize={mini ? 6 : 18}
            style={{
              position: "absolute",
              top: config.name.top,
              left: config.name.left,
              fontWeight: config.name.fontWeight,
              color: config.name.color,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          />
        )}

        {config.showTitle1 && (
          <AutoFitText
            text={safeTitle}
            maxWidth={mini ? 160 : 520}
            maxFontSize={mini ? 6 : 22}
            minFontSize={mini ? 5 : 10}
            style={{
              position: "absolute",
              top: config.title1.top,
              left: config.title1.left,
              fontWeight: config.title1.fontWeight,
              color: config.title1.color,
              lineHeight: 1,
            }}
          />
        )}

        {config.showTitle2 && (
          <AutoFitText
            text={safeTitleLine2}
            maxWidth={mini ? 160 : 520}
            maxFontSize={mini ? 6 : 22}
            minFontSize={mini ? 5 : 10}
            style={{
              position: "absolute",
              top: config.title2.top,
              left: config.title2.left,
              fontWeight: config.title2.fontWeight,
              color: config.title2.color,
              lineHeight: 1,
            }}
          />
        )}

        {config.showOrg1 && (
          <AutoFitText
            text={safeOrgLine1}
            maxWidth={mini ? 160 : 320}
            maxFontSize={mini ? 7 : 24}
            minFontSize={mini ? 6 : 10}
            style={{
              position: "absolute",
              top: config.org1.top,
              left: config.org1.left,
              fontWeight: config.org1.fontWeight,
              color: config.org1.color,
              lineHeight: 1,
            }}
          />
        )}

        {config.showOrg2 && (
          <AutoFitText
            text={safeOrgLine2}
            maxWidth={mini ? 160 : 320}
            maxFontSize={mini ? 7 : 24}
            minFontSize={mini ? 6 : 10}
            style={{
              position: "absolute",
              top: config.org2.top,
              left: config.org2.left,
              fontWeight: config.org2.fontWeight,
              color: config.org2.color,
              lineHeight: 1,
            }}
          />
        )}

      </div>
    </div >
  );
}

function BadgePreview({
  badgeId,
  productType,
  productForm,
  maxWidth,
  mini = false,
}) {
  if (isProfessionProductType(productType) || badgeId === 101) {
    return (
      <ProfessionBadgePreview
        title={productForm.title}
        professionChoiceId={productForm.professionChoiceId}
        maxWidth={maxWidth}
        mini={mini}
      />
    );
  }

  return (
    <NameBadgePreview
      badgeId={badgeId}
      productForm={productForm}
      maxWidth={maxWidth}
      mini={mini}
    />
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={htmlFor}>{label}:</label>
      <br />
      {children}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("landing");
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
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

  function resetProductForm() {
    setProductForm(EMPTY_PRODUCT_FORM);
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
      fetchOrders(adminPassword);
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
    const confirmed = window.confirm(
      "Vill du verkligen ta bort beställningen?"
    );

    if (!confirmed) return;

    setAdminError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "x-admin-password": adminPassword,
          },
        }
      );

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
      setSuccessMessage("");
      setStep("landing");

      setToastMessage(
        `Beställningen har skickats. Ordernummer: ${data.order?.orderNumber || "-"
        }`
      );

      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    } catch {
      alert("Kunde inte ansluta till servern.");
    }
  }

  function handleSelectProductType(type) {
    setSelectedProductType(type);
    setSuccessMessage("");

    if (isProfessionProductType(type)) {
      setSelectedBadge(PROFESSION_BADGES[0]);
      setProductForm({
        ...EMPTY_PRODUCT_FORM,
        title: "Läkare",
        professionChoiceId: "lakare",
      });
      setStep("form");
      return;
    }

    setSelectedBadge(null);
    resetProductForm();
    setStep("start");
  }

  function goBackToLanding() {
    setSelectedProductType(null);
    setSelectedBadge(null);
    setSuccessMessage("");
    setOrderer((prev) => ({
      ...prev,
      accountNumber: "",
    }));
    setStep("landing");
  }

  function goBackFromForm() {
    setSuccessMessage("");

    if (isProfessionProductType(selectedProductType)) {
      goBackToLanding();
      return;
    }

    setSelectedBadge(null);
    resetProductForm();
    setStep("start");
  }

  function validateCurrentItem() {
    if (!selectedBadge) return "Ingen skylt är vald.";

    if (isProfessionProductType(selectedProductType)) {
      if (!productForm.title.trim()) return "Du måste fylla i text på skylten.";
    } else {
      if (!productForm.name.trim()) return "Du måste fylla i namn.";

      if (selectedBadge.id === 3) {
        if (!productForm.title.trim() && !productForm.titleLine2.trim()) {
          return "Du måste fylla i minst en titelrad.";
        }
      } else {
        if (!productForm.title.trim()) return "Du måste fylla i titel.";
      }

      if (selectedBadge.id === 2 && !productForm.orgLine1.trim()) {
        return "Du måste fylla i verksamhetsnamn.";
      }

      if (selectedBadge.id === 4 && !productForm.orgLine1.trim()) {
        return "Du måste fylla i verksamhetsnamn rad 1.";
      }

      if (!productForm.fastening.trim()) return "Du måste välja fäste.";
    }

    if (
      !Number.isFinite(Number(productForm.quantity)) ||
      Number(productForm.quantity) < 1
    ) {
      return "Antal måste vara minst 1.";
    }

    if (
      !isProfessionProductType(selectedProductType) &&
      (!Number.isFinite(Number(productForm.extraMagnets)) ||
        Number(productForm.extraMagnets) < 0)
    ) {
      return "Extra magnetfästen kan inte vara mindre än 0.";
    }

    return null;
  }

  function addCurrentItemToCart() {
    const error = validateCurrentItem();

    if (error) {
      alert(error);
      return;
    }

    if (isProfessionProductType(selectedProductType)) {
      const chosenProfession = getChosenProfession(productForm.professionChoiceId);
      const safeQuantity = Math.max(1, Number(productForm.quantity) || 1);

      const newItem = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(),
        productType: "yrkestitelsskyltar",
        badgeId: 101,
        badgeName: selectedBadge?.name || "Yrkestitelsskylt",
        title: productForm.title || chosenProfession.label,
        professionChoiceId: chosenProfession.id,
        color: chosenProfession.color,
        textColor: chosenProfession.textColor,
        quantity: safeQuantity,
      };

      setCart((prev) => [...prev, newItem]);
      setSuccessMessage("Yrkestitelsskylten lades i kundkorgen.");

      setProductForm((prev) => ({
        ...prev,
        title: chosenProfession.label,
        quantity: 1,
      }));
      return;
    }

    const newItem = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString(),
      productType: "namnbrickor",
      badgeId: selectedBadge.id,
      badgeName: selectedBadge.name,
      name: productForm.name.trim(),
      title: productForm.title.trim(),
      titleLine2: productForm.titleLine2.trim(),
      orgLine1: productForm.orgLine1.trim(),
      orgLine2: productForm.orgLine2.trim(),
      fastening: productForm.fastening,
      quantity: Math.max(1, Number(productForm.quantity) || 1),
      extraMagnets: Math.max(0, Number(productForm.extraMagnets) || 0),
    };

    setCart((prev) => [...prev, newItem]);
    setSuccessMessage("Namnbrickan lades i kundkorgen.");
    resetProductForm();
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

  const visibleBadges = useMemo(() => {
    if (isProfessionProductType(selectedProductType)) {
      return PROFESSION_BADGES;
    }
    return NAME_BADGES;
  }, [selectedProductType]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cart]
  );

  if (step === "landing") {
    return (
      <PageContainer>
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              background: "#4caf50",
              color: "white",
              padding: "16px 20px",
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 2000,
              fontWeight: "bold",
            }}
          >
            {toastMessage}
          </div>
        )}

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <TopBar cartCount={cartCount} onCartClick={() => setStep("cart")} />

          <div style={{ marginBottom: 20, textAlign: "right" }}>
            <button
              type="button"
              onClick={() => setStep("adminLogin")}
              style={secondaryButtonStyle}
            >
              Beställningar
            </button>
          </div>

          <div style={welcomeCardStyle}>
            <p style={welcomeTextStyle}>
              Välkommen, här kan du beställa namnskyltar till Region Jönköpings
              län, RJL
            </p>
          </div>

          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h1 style={{ fontSize: 46, marginTop: 95, marginBottom: 12 }}>
              Välj typ av skylt
            </h1>

            <p style={{ fontSize: 20, color: "#555", margin: 0 }}>
              Börja med att välja vilken typ av skylt du vill beställa.
            </p>
          </div>

          <div style={landingGridStyle}>
            {PRODUCT_TYPES.map((type) => (
              <ProductTypeCard
                key={type.id}
                type={type}
                onSelect={() => handleSelectProductType(type)}
              />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (step === "adminLogin") {
    return (
      <PageContainer>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <button
            type="button"
            onClick={() => setStep("landing")}
            style={backButtonStyle}
          >
            ← Tillbaka
          </button>

          <div style={cardStyle}>
            <h1 style={{ fontSize: 36, marginTop: 0 }}>Logga in</h1>
            <p style={{ color: "#555" }}>
              Ange lösenord för att öppna beställningar.
            </p>

            <Field label="Lösenord" htmlFor="adminPassword">
              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={inputStyle}
              />
            </Field>

            {adminError && (
              <p style={{ color: "#c62828", marginTop: 10 }}>{adminError}</p>
            )}

            <button
              type="button"
              onClick={handleAdminLogin}
              style={primaryButtonStyle}
            >
              Logga in
            </button>
          </div>
        </div>
      </PageContainer>
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

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <button
            type="button"
            onClick={() => {
              setSelectedOrder(null);
              setShowPackingSlip(false);
              setPackingSlipOrder(null);
              setStep("landing");
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

                        {isProfessionProductType(item.productType) ? (
                          <>
                            <div>
                              <strong>Text:</strong> {item.title || "-"}
                            </div>
                            <div>
                              <strong>Val:</strong>{" "}
                              {getChosenProfession(item.professionChoiceId).label}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <strong>Namn:</strong> {item.name || "-"}
                            </div>
                            <div>
                              <strong>Titel:</strong> {item.title || "-"}
                            </div>

                            {item.titleLine2 ? (
                              <div>
                                <strong>Titel rad 2:</strong> {item.titleLine2}
                              </div>
                            ) : null}

                            {item.orgLine1 ? (
                              <div>
                                <strong>Verksamhetsnamn rad 1:</strong>{" "}
                                {item.orgLine1}
                              </div>
                            ) : null}

                            {item.orgLine2 ? (
                              <div>
                                <strong>Verksamhetsnamn rad 2:</strong>{" "}
                                {item.orgLine2}
                              </div>
                            ) : null}

                            <div>
                              <strong>Fäste:</strong> {item.fastening || "-"}
                            </div>
                            <div>
                              <strong>Extra magnetfästen:</strong>{" "}
                              {item.extraMagnets ?? 0}
                            </div>
                          </>
                        )}

                        <div>
                          <strong>Antal:</strong> {item.quantity}
                        </div>
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

          {packingSlipOrder && showPackingSlip && (
            <div style={packingSlipOverlayStyle} className="packing-slip-overlay">
              <div style={packingSlipStyle} className="packing-slip">
                <div className="packing-slip-actions" style={packingSlipActionsStyle}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={primaryButtonStyle}
                  >
                    Skriv ut / Spara PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPackingSlip(false);
                      setPackingSlipOrder(null);
                    }}
                    style={secondaryButtonStyle}
                  >
                    Stäng följesedel
                  </button>
                </div>

                <div
                  id="packing-slip-print-area"
                  style={{
                    minHeight: "273mm",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    paddingBottom: "40px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 20,
                      flexWrap: "wrap",
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 36,
                          fontWeight: "bold",
                          color: "#1f2a44",
                          marginBottom: 8,
                        }}
                      >
                        Följesedel
                      </div>

                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: "bold",
                          marginBottom: 12,
                        }}
                      >
                        Ordernummer{" "}
                        {packingSlipOrder.orderNumber || packingSlipOrder.id}
                      </div>
                    </div>

                    <div style={{ textAlign: "right", lineHeight: 1.7 }}>
                      <div style={{ fontWeight: "bold", fontSize: 20 }}>
                        <img
                          src="/jsf-logo.jpg"
                          alt="JSF Logo"
                          style={{
                            height: 40,
                            marginBottom: 8,
                            objectFit: "contain",
                            marginLeft: "auto",
                            display: "block",
                          }}
                        />
                        Jönköpings Skyltfabrik
                      </div>
                      <div>Gammavägen 1</div>
                      <div>556 52 Jönköping</div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 12,
                      marginTop: "12mm",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#1f2a44",
                          marginBottom: 12,
                          fontSize: 18,
                        }}
                      >
                        Mottagare
                      </div>

                      <div>{packingSlipOrder.delivery?.recipient || "-"}</div>
                      <div>{packingSlipOrder.delivery?.company || "-"}</div>
                      <div>{packingSlipOrder.delivery?.address || "-"}</div>
                      <div>
                        {packingSlipOrder.delivery?.postalCode || "-"}{" "}
                        {packingSlipOrder.delivery?.city || ""}
                      </div>
                      <div>{packingSlipOrder.delivery?.country || "-"}</div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#1f2a44",
                          marginBottom: 12,
                          fontSize: 18,
                        }}
                      >
                        Beställare
                      </div>

                      <div>{packingSlipOrder.orderer?.ordererName || "-"}</div>
                      <div>{packingSlipOrder.orderer?.ordererEmail || "-"}</div>
                      <div>{packingSlipOrder.orderer?.ordererPhone || "-"}</div>
                      <div>
                        Ansvarsnummer:{" "}
                        {packingSlipOrder.orderer?.accountNumber || "-"}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 0 }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              ...tableHeaderStyle,
                              color: "#1f2a44",
                              borderBottom: "2px solid #1f2a44",
                              paddingBottom: 8,
                            }}
                          >
                            Artikel
                          </th>
                          <th
                            style={{
                              ...tableHeaderStyle,
                              color: "#1f2a44",
                              borderBottom: "2px solid #1f2a44",
                              paddingBottom: 8,
                            }}
                          >
                            Beskrivning
                          </th>
                          <th
                            style={{
                              ...tableHeaderStyle,
                              color: "#1f2a44",
                              borderBottom: "2px solid #1f2a44",
                              paddingBottom: 8,
                            }}
                          >
                            Antal
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {(packingSlipOrder.cart || []).map((item, index) => (
                          <tr
                            key={item.id || index}
                            style={{
                              background: index % 2 === 0 ? "#f7f7f7" : "white",
                            }}
                          >
                            <td
                              style={{
                                ...tableCellStyle,
                                paddingTop: 8,
                                paddingBottom: 8,
                                verticalAlign: "top",
                              }}
                            >
                              {item.badgeName ||
                                getProductTypeLabel(item.productType)}
                            </td>

                            <td
                              style={{
                                ...tableCellStyle,
                                paddingTop: 8,
                                paddingBottom: 8,
                              }}
                            >
                              {isProfessionProductType(item.productType) ? (
                                <>
                                  <div>
                                    <strong>Text:</strong> {item.title || "-"}
                                  </div>
                                  <div>
                                    <strong>Typ:</strong>{" "}
                                    {getProductTypeLabel(item.productType)}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <strong>Namn:</strong> {item.name || "-"}
                                  </div>
                                  <div>
                                    <strong>Titel:</strong> {item.title || "-"}
                                  </div>
                                  {item.titleLine2 ? (
                                    <div>
                                      <strong>Titel rad 2:</strong>{" "}
                                      {item.titleLine2}
                                    </div>
                                  ) : null}
                                  {item.orgLine1 ? (
                                    <div>
                                      <strong>Verksamhet:</strong>{" "}
                                      {item.orgLine1}
                                    </div>
                                  ) : null}
                                  {item.orgLine2 ? (
                                    <div>{item.orgLine2}</div>
                                  ) : null}
                                  <div>
                                    <strong>Fäste:</strong>{" "}
                                    {item.fastening || "-"}
                                  </div>
                                  <div>
                                    <strong>Extra magnetfästen:</strong>{" "}
                                    {item.extraMagnets ?? 0}
                                  </div>
                                </>
                              )}
                            </td>

                            <td
                              style={{
                                ...tableCellStyle,
                                paddingTop: 10,
                                paddingBottom: 10,
                              }}
                            >
                              {item.quantity || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div
                    style={{
                      transform: "translateY(26mm)",
                      marginBottom: "32px",
                      marginTop: "auto",
                      paddingTop: 16,
                      borderTop: "2px solid #444",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      Jönköpings Skyltfabrik
                    </div>

                    <div>
                      Antal artiklar:{" "}
                      {(packingSlipOrder.cart || []).reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0
                      )}
                    </div>

                    <div>Sida 1 av 1</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer >
    );
  }

  if (step === "cart") {
    return (
      <PageContainer>
        <div style={{ maxWidth: 950, margin: "0 auto" }}>
          <button type="button" onClick={goBackToLanding} style={backButtonStyle}>
            ← Tillbaka
          </button>

          <h1 style={{ fontSize: 40, marginBottom: 10 }}>Kundkorg</h1>

          <p style={{ color: "#555", fontSize: 18 }}>
            Du har {cart.length} {cart.length === 1 ? "artikel" : "artiklar"} i
            kundkorgen.
          </p>

          {cart.length === 0 ? (
            <div style={cardStyle}>Kundkorgen är tom.</div>
          ) : (
            <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
              {cart.map((item) => (
                <div key={item.id} style={cardStyle}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) 190px",
                      gap: 18,
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 22, marginBottom: 8 }}>
                        {item.badgeName}
                      </div>

                      <div style={{ color: "#333", lineHeight: 1.6, marginBottom: 14 }}>
                        <div>
                          <strong>Typ:</strong> {getProductTypeLabel(item.productType)}
                        </div>

                        {isProfessionProductType(item.productType) ? (
                          <>
                            <div>
                              <strong>Text:</strong> {item.title}
                            </div>
                            <div>
                              <strong>Val:</strong>{" "}
                              {getChosenProfession(item.professionChoiceId).label}
                            </div>
                          </>
                        ) : (
                          <>
                            {(item.badgeId === 2 || item.badgeId === 4) && (
                              <div>
                                <strong>Verksamhetsnamn rad 1:</strong>{" "}
                                {item.orgLine1 || "-"}
                              </div>
                            )}
                            {item.badgeId === 4 && (
                              <div>
                                <strong>Verksamhetsnamn rad 2:</strong>{" "}
                                {item.orgLine2 || "-"}
                              </div>
                            )}
                            <div>
                              <strong>Namn:</strong> {item.name || "-"}
                            </div>
                            <div>
                              <strong>Titel:</strong> {item.title || "-"}
                            </div>
                            {item.badgeId === 3 && (
                              <div>
                                <strong>Titel rad 2:</strong>{" "}
                                {item.titleLine2 || "-"}
                              </div>
                            )}
                            <div>
                              <strong>Fäste:</strong> {item.fastening || "-"}
                            </div>
                            <div>
                              <strong>Extra magnetfästen:</strong>{" "}
                              {item.extraMagnets}
                            </div>
                          </>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "end",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <label
                            htmlFor={`quantity-${item.id}`}
                            style={{ display: "block", marginBottom: 6 }}
                          >
                            Antal:
                          </label>
                          <input
                            id={`quantity-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartQuantity(item.id, e.target.value)
                            }
                            style={{ ...inputStyle, maxWidth: 120, marginTop: 0 }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          style={dangerButtonStyle}
                        >
                          Ta bort produkt
                        </button>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                        Förhandsvisning
                      </div>

                      <BadgePreview
                        badgeId={item.badgeId}
                        productType={item.productType}
                        productForm={
                          isProfessionProductType(item.productType)
                            ? {
                              title: item.title,
                              professionChoiceId: item.professionChoiceId,
                            }
                            : {
                              name: item.name || "",
                              title: item.title || "",
                              titleLine2: item.titleLine2 || "",
                              orgLine1: item.orgLine1 || "",
                              orgLine2: item.orgLine2 || "",
                            }
                        }
                        maxWidth={190}
                        mini
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const error = validateOrderDetails();
              if (error) {
                alert(error);
                return;
              }
              setShowOrderSummary(true);
            }}
            style={cardStyle}
          >
            <div style={sectionTitleStyle}>Beställare</div>

            <Field label="Namn" htmlFor="ordererName">
              <input
                id="ordererName"
                type="text"
                placeholder="Anna Svensson"
                style={inputStyle}
                value={orderer.ordererName}
                onChange={(e) =>
                  setOrderer((prev) => ({
                    ...prev,
                    ordererName: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="E-post" htmlFor="ordererEmail">
              <input
                id="ordererEmail"
                type="text"
                placeholder="anna@rjl.se"
                style={inputStyle}
                value={orderer.ordererEmail}
                onChange={(e) =>
                  setOrderer((prev) => ({
                    ...prev,
                    ordererEmail: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Mobilnummer" htmlFor="ordererPhone">
              <input
                id="ordererPhone"
                type="text"
                placeholder="07X-XXX XX XX"
                style={inputStyle}
                value={orderer.ordererPhone}
                onChange={(e) =>
                  setOrderer((prev) => ({
                    ...prev,
                    ordererPhone: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Meddelande till leverantör" htmlFor="messageToSupplier">
              <input
                id="messageToSupplier"
                type="text"
                style={inputStyle}
                value={orderer.messageToSupplier}
                onChange={(e) =>
                  setOrderer((prev) => ({
                    ...prev,
                    messageToSupplier: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Ansvarsnummer" htmlFor="accountNumber">
              <input
                id="accountNumber"
                type="text"
                style={inputStyle}
                value={orderer.accountNumber}
                onChange={(e) =>
                  setOrderer((prev) => ({
                    ...prev,
                    accountNumber: e.target.value,
                  }))
                }
              />
            </Field>

            <div style={sectionTitleStyle}>Leveransadress</div>

            <Field label="Företag" htmlFor="company">
              <input
                id="company"
                type="text"
                placeholder="Onkologmottagningen Region Jönköpings Län"
                style={inputStyle}
                value={delivery.company}
                onChange={(e) =>
                  setDelivery((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Mottagare" htmlFor="recipient">
              <input
                id="recipient"
                type="text"
                placeholder="Anna Svensson"
                style={inputStyle}
                value={delivery.recipient}
                onChange={(e) =>
                  setDelivery((prev) => ({
                    ...prev,
                    recipient: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Adress" htmlFor="address">
              <input
                id="address"
                type="text"
                style={inputStyle}
                value={delivery.address}
                onChange={(e) =>
                  setDelivery((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Postnummer" htmlFor="postalCode">
              <input
                id="postalCode"
                type="text"
                style={inputStyle}
                value={delivery.postalCode}
                onChange={(e) =>
                  setDelivery((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Postort" htmlFor="city">
              <input
                id="city"
                type="text"
                style={inputStyle}
                value={delivery.city}
                onChange={(e) =>
                  setDelivery((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Land" htmlFor="country">
              <input
                id="country"
                type="text"
                placeholder="Sverige"
                style={inputStyle}
                value={delivery.country}
                onChange={(e) =>
                  setDelivery((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
              />
            </Field>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  setOrderer((prev) => ({
                    ...prev,
                    accountNumber: "",
                  }));
                  setStep("landing");
                }}
                style={secondaryButtonStyle}
              >
                Lägg till fler produkter
              </button>

              <button type="submit" style={primaryButtonStyle}>
                Beställ
              </button>
            </div>

            <p
              style={{
                color: "#666",
                marginTop: 14,
                marginBottom: 0,
                lineHeight: 1.5,
              }}
            >
              När du klickar på Beställ visas först en sammanfattning innan ordern
              sparas.
            </p>
          </form>

          {showOrderSummary && (
            <div style={modalOverlayStyle}>
              <div style={modalContentStyle}>
                <h2 style={{ marginTop: 0, marginBottom: 16 }}>
                  Sammanfattning av beställning
                </h2>

                <div style={{ marginBottom: 20 }}>
                  <div style={sectionTitleStyle}>Produkter</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    {cart.map((item) => (
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

                        {isProfessionProductType(item.productType) ? (
                          <>
                            <div>
                              <strong>Text:</strong> {item.title}
                            </div>
                            <div>
                              <strong>Val:</strong>{" "}
                              {getChosenProfession(item.professionChoiceId).label}
                            </div>
                          </>
                        ) : (
                          <>
                            {(item.badgeId === 2 || item.badgeId === 4) && (
                              <div>
                                <strong>Verksamhetsnamn rad 1:</strong>{" "}
                                {item.orgLine1 || "-"}
                              </div>
                            )}
                            {item.badgeId === 4 && (
                              <div>
                                <strong>Verksamhetsnamn rad 2:</strong>{" "}
                                {item.orgLine2 || "-"}
                              </div>
                            )}
                            <div>
                              <strong>Namn:</strong> {item.name || "-"}
                            </div>
                            <div>
                              <strong>Titel:</strong> {item.title || "-"}
                            </div>
                            {item.badgeId === 3 && (
                              <div>
                                <strong>Titel rad 2:</strong>{" "}
                                {item.titleLine2 || "-"}
                              </div>
                            )}
                            <div>
                              <strong>Fäste:</strong> {item.fastening || "-"}
                            </div>
                            <div>
                              <strong>Extra magnetfästen:</strong>{" "}
                              {item.extraMagnets}
                            </div>
                          </>
                        )}

                        <div>
                          <strong>Antal:</strong> {item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={sectionTitleStyle}>Beställare</div>
                  <div>
                    <span style={{ color: "#666" }}>Namn:</span>{" "}
                    {orderer.ordererName || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>E-post:</span>{" "}
                    {orderer.ordererEmail || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Mobilnummer:</span>{" "}
                    {orderer.ordererPhone || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Ansvarsnummer:</span>{" "}
                    {orderer.accountNumber || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Meddelande:</span>{" "}
                    {orderer.messageToSupplier || "-"}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={sectionTitleStyle}>Leveransadress</div>
                  <div>
                    <span style={{ color: "#666" }}>Företag:</span>{" "}
                    {delivery.company || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Mottagare:</span>{" "}
                    {delivery.recipient || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Adress:</span>{" "}
                    {delivery.address || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Postnummer:</span>{" "}
                    {delivery.postalCode || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Postort:</span>{" "}
                    {delivery.city || "-"}
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Land:</span>{" "}
                    {delivery.country || "-"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setShowOrderSummary(false)}
                    style={secondaryButtonStyle}
                  >
                    Tillbaka och ändra
                  </button>

                  <button
                    type="button"
                    onClick={submitOrderToBackend}
                    style={primaryButtonStyle}
                  >
                    Bekräfta beställning
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    );
  }

  if (step === "start") {
    return (
      <PageContainer>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <button type="button" onClick={goBackToLanding} style={backButtonStyle}>
            ← Tillbaka
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 30,
            }}
          >
            <div>
              <h1 style={{ fontSize: 42, marginBottom: 10 }}>
                Beställ din namnskylt
              </h1>

              <p style={{ fontSize: 18, color: "#555", margin: 0 }}>
                Välj den modell du vill beställa för att gå vidare.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep("cart")}
              style={secondaryButtonStyle}
            >
              Kundkorg ({cartCount})
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {visibleBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                onSelect={() => {
                  setSelectedBadge(badge);
                  resetProductForm();
                  setSuccessMessage("");
                  setStep("form");
                }}
              />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ maxWidth: 950, margin: "0 auto" }}>
        <button type="button" onClick={goBackFromForm} style={backButtonStyle}>
          ← Tillbaka
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h1 style={{ fontSize: 40, marginBottom: 10 }}>
            Beställ {selectedBadge?.name}
          </h1>

          <button
            type="button"
            onClick={() => setStep("cart")}
            style={secondaryButtonStyle}
          >
            Kundkorg ({cartCount})
          </button>
        </div>

        <p style={{ color: "#555", fontSize: 18 }}>Fyll i uppgifterna nedan.</p>

        {selectedBadge && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: "bold", fontSize: 24 }}>
              {selectedBadge.name}
            </div>
            <div style={{ color: "#555", lineHeight: 1.4 }}>
              {selectedBadge.desc}
            </div>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              background: "#e8f5e9",
              border: "1px solid #c8e6c9",
              color: "#1b5e20",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 20,
              fontWeight: "bold",
            }}
          >
            {successMessage}
          </div>
        )}

        {isProfessionProductType(selectedProductType) ? (
          <>
            <p
              style={{
                marginTop: 0,
                marginBottom: 14,
                color: "#555",
                lineHeight: 1.5,
              }}
            >
              Denna skylt levereras med militärklämma i metall.
            </p>

            <BadgePreview
              badgeId={101}
              productType="yrkestitelsskyltar"
              productForm={productForm}
              maxWidth={700}
            />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCurrentItemToCart();
              }}
              style={cardStyle}
            >
              <Field label="Välj yrkesroll / färg" htmlFor="professionChoice">
                <select
                  id="professionChoice"
                  value={productForm.professionChoiceId}
                  onChange={(e) => {
                    const chosen = getChosenProfession(e.target.value);

                    setProductForm((prev) => ({
                      ...prev,
                      professionChoiceId: chosen.id,
                      title: chosen.label,
                    }));
                    setSuccessMessage("");
                  }}
                  style={inputStyle}
                >
                  {PROFESSION_CHOICES.map((choice) => (
                    <option key={choice.id} value={choice.id}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Text på skylten" htmlFor="professionTitle">
                <input
                  id="professionTitle"
                  type="text"
                  value={productForm.title}
                  onChange={(e) => {
                    setProductForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }));
                    setSuccessMessage("");
                  }}
                  style={inputStyle}
                />
              </Field>

              <Field label="Antal" htmlFor="professionQuantity">
                <input
                  id="professionQuantity"
                  type="number"
                  min="1"
                  value={productForm.quantity}
                  onChange={(e) => {
                    setProductForm((prev) => ({
                      ...prev,
                      quantity: Number(e.target.value),
                    }));
                    setSuccessMessage("");
                  }}
                  style={inputStyle}
                />
              </Field>

              <button type="submit" style={primaryButtonStyle}>
                Lägg i kundkorg
              </button>
            </form>
          </>
        ) : (
          <>
            <BadgePreview
              badgeId={selectedBadge?.id}
              productType="namnbrickor"
              productForm={productForm}
              maxWidth={600}
            />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCurrentItemToCart();
              }}
              style={cardStyle}
            >
              <Field label="Namn" htmlFor="name">
                <input
                  id="name"
                  type="text"
                  placeholder="Anna Svensson"
                  style={inputStyle}
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field
                label={selectedBadge?.id === 3 ? "Titel rad 1" : "Titel"}
                htmlFor="title"
              >
                <input
                  id="title"
                  type="text"
                  placeholder={selectedBadge?.id === 3 ? "Titel 1" : "Titel"}
                  style={inputStyle}
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </Field>

              {selectedBadge?.id === 3 && (
                <Field label="Titel rad 2" htmlFor="titleLine2">
                  <input
                    id="titleLine2"
                    type="text"
                    placeholder="Titel 2"
                    style={inputStyle}
                    value={productForm.titleLine2}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        titleLine2: e.target.value,
                      }))
                    }
                  />
                </Field>
              )}

              {selectedBadge?.id === 2 && (
                <Field label="Verksamhetsnamn" htmlFor="orgLine1">
                  <input
                    id="orgLine1"
                    type="text"
                    placeholder="Verksamhetsnamn"
                    style={inputStyle}
                    value={productForm.orgLine1}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        orgLine1: e.target.value,
                      }))
                    }
                  />
                </Field>
              )}

              {selectedBadge?.id === 4 && (
                <>
                  <Field label="Verksamhetsnamn rad 1" htmlFor="orgLine1">
                    <input
                      id="orgLine1"
                      type="text"
                      placeholder="Verksamhetsnamn"
                      style={inputStyle}
                      value={productForm.orgLine1}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          orgLine1: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="Verksamhetsnamn rad 2" htmlFor="orgLine2">
                    <input
                      id="orgLine2"
                      type="text"
                      placeholder="2 rader"
                      style={inputStyle}
                      value={productForm.orgLine2}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          orgLine2: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </>
              )}

              <Field label="Fäste" htmlFor="fastening">
                <select
                  id="fastening"
                  style={inputStyle}
                  value={productForm.fastening}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      fastening: e.target.value,
                    }))
                  }
                >
                  <option value="">Välj...</option>
                  <option value="Magnet">Magnet</option>
                  <option value="Nål">Nål</option>
                </select>
              </Field>

              <Field label="Antal" htmlFor="quantity">
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={productForm.quantity}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      quantity: Number(e.target.value),
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Extra magnetfästen" htmlFor="extraMagnets">
                <input
                  id="extraMagnets"
                  type="number"
                  min="0"
                  value={productForm.extraMagnets}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      extraMagnets: Number(e.target.value),
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <button type="submit" style={primaryButtonStyle}>
                Lägg i kundkorg
              </button>
            </form>
          </>
        )}
      </div>
    </PageContainer>
  );
}

const inputStyle = {
  width: "100%",
  maxWidth: 420,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginTop: 4,
  boxSizing: "border-box",
};

const primaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: 8,
  border: "none",
  background: "black",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "white",
  color: "black",
  cursor: "pointer",
  fontWeight: "bold",
};

const dangerButtonStyle = {
  padding: "12px 18px",
  borderRadius: 8,
  border: "none",
  background: "#c62828",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const backButtonStyle = {
  marginBottom: 20,
  background: "white",
  border: "1px solid #ccc",
  borderRadius: 8,
  padding: "10px 14px",
  cursor: "pointer",
};

const cardStyle = {
  background: "white",
  border: "1px solid #ddd",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const welcomeCardStyle = {
  background: "white",
  border: "1px solid #ddd",
  borderRadius: 16,
  padding: "18px 22px",
  marginBottom: 28,
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const welcomeTextStyle = {
  margin: 0,
  fontSize: 20,
  color: "#333",
  lineHeight: 1.5,
  textAlign: "center",
};

const landingGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 24,
  marginTop: 20,
};

const sectionTitleStyle = {
  marginBottom: 20,
  marginTop: 10,
  fontWeight: "bold",
  fontSize: 20,
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 1000,
};

const modalContentStyle = {
  background: "white",
  borderRadius: 18,
  padding: 24,
  width: "100%",
  maxWidth: 820,
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
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
  zIndex: 1100,
};

const packingSlipStyle = {
  background: "white",
  borderRadius: 18,
  padding: 24,
  paddingBottom: 40,
  width: "100%",
  maxWidth: 950,
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
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

const printStyle = `
  @page {
    size: A4;
    margin: 6mm;
  }

  @media print {
    html,
    body {
      width: 210mm;
      height: 297mm;
overflow: hidden;
      margin: 0;
      padding: 0;
      background: white;
    }
      body * {
  visibility: hidden;
}

#packing-slip-print-area,
#packing-slip-print-area * {
  visibility: visible;
}

    .packing-slip-actions {
      display: none !important;
    }

    .packing-slip-overlay {
  position: static !important;
  inset: auto !important;
  background: white !important;
  padding: 0 !important;
  display: block !important;
  align-items: flex-start !important;
justify-content: flex-start !important;
}

.packing-slip {
  max-height: none !important;
  overflow: visible !important;
  position: absolute !important;
  top: 4mm !important;
  left: 4mm !important;
  width: calc(100% - 8mm) !important;
  box-sizing: border-box !important;
  padding-bottom: 2mm !important;
}
  #packing-slip-print-area {
  page-break-inside: avoid;
  break-inside: avoid;
#packing-slip-print-area {
  width: 100%;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  min-height: auto !important;
display: block !important;
  position: absolute !important;
  top: 20mm !important;
  left: 0 !important;
  right: 0 !important;
}

    .packing-slip {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }
  }
`;