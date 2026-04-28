import AppHeader from "../components/layout/AppHeader";
import BadgePreview from "../components/products/BadgePreview";
import PageContainer from "../components/layout/PageContainer";
import { getCartItemDisplayRows } from "../data/orderDisplayHelpers";
import { getCartPreviewConfig } from "../data/previewHelpers";

function renderDisplayRows(rows, options = {}) {
  const { hideLabels = [] } = options;

  return rows
    .filter((row) => !hideLabels.includes(row.label))
    .map((row, index) => (
      <div key={`${row.label}-${index}`} style={displayRowStyle}>
        <strong>{row.label}:</strong> {row.value}
      </div>
    ));
}

function isProfessionCartItem(item) {
  return (
    item?.productType === "yrkestitelsskylt" ||
    item?.categoryId === "yrkestitelsskyltar"
  );
}

function getProfessionCardColors(color, textColor) {
  const normalizedColor = (color || "").toLowerCase();
  const normalizedTextColor = (textColor || "").toLowerCase();

  const backgroundMap = {
    röd: "#d62828",
    blå: "#2563eb",
    grön: "#2e7d32",
    orange: "#ef6c00",
    lila: "#7b1fa2",
    ljusblå: "#4fc3f7",
    vinröd: "#8e244d",
    svart: "#212121",
    vit: "#ffffff",
  };

  const background = backgroundMap[normalizedColor] || "#d62828";

  let colorValue = "#ffffff";

  if (normalizedTextColor === "svart") {
    colorValue = "#111111";
  }

  if (normalizedColor === "vit" && !normalizedTextColor) {
    colorValue = "#111111";
  }

  return {
    background,
    color: colorValue,
  };
}

function getProfessionFontSize(title = "") {
  const length = title.trim().length;

  if (length <= 10) return 20;
  if (length <= 14) return 18;
  if (length <= 18) return 17;
  if (length <= 24) return 15;

  return 14;
}

function getProfessionLetterSpacing(title = "") {
  const length = title.trim().length;

  if (length <= 14) return "-0.02em";
  if (length <= 24) return "-0.03em";

  return "-0.04em";
}

function renderProfessionCartPreview(item) {
  const title = item?.title || item?.badgeName || item?.name || "Titel";
  const { background, color } = getProfessionCardColors(
    item?.color,
    item?.textColor
  );
  const isWhiteBadge = (item?.color || "").toLowerCase() === "vit";

  return (
    <div style={professionPreviewWrapStyle}>
      <div
        style={{
          ...professionPreviewCardStyle,
          background,
          color,
          ...(isWhiteBadge ? whiteProfessionPreviewCardStyle : {}),
        }}
      >
        <div style={professionPreviewSurfaceStyle} />
        <div style={professionPreviewGlossStyle} />
        <div style={professionPreviewBottomShadeStyle} />

        <div
          style={{
            ...professionPreviewTextStyle,
            fontSize: getProfessionFontSize(title),
            letterSpacing: getProfessionLetterSpacing(title),
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

function renderCartPreview(item) {
  if (isProfessionCartItem(item)) {
    return renderProfessionCartPreview(item);
  }

  const config = getCartPreviewConfig(item);

  if (
    config.previewType === "badge" ||
    config.previewType === "profession" ||
    config.previewType === "hanging_sign" ||
    config.previewType === "door_sign"
  ) {
    return (
      <div style={badgePreviewWrapStyle}>
        <BadgePreview
          badgeId={config.badgeId}
          productType={config.productType}
          productForm={item}
          mini={config.mini}
          maxWidth={config.maxWidth}
        />
      </div>
    );
  }

  if (config.previewType === "imageTall") {
    return config.image ? (
      <div style={imagePreviewWrapStyle}>
        <img
          src={config.image}
          alt={config.alt}
          style={{
            width: config.width,
            height: config.height,
            objectFit: "contain",
            display: "block",
            maxWidth: "100%",
          }}
        />
      </div>
    ) : (
      <div style={previewFallbackStyle}>Ingen förhandsvisning</div>
    );
  }

  if (config.previewType === "image") {
    return config.image ? (
      <div style={imagePreviewWrapStyle}>
        <img
          src={config.image}
          alt={config.alt}
          style={{
            width: config.width,
            height: config.height,
            objectFit: "contain",
            display: "block",
            maxWidth: "100%",
          }}
        />
      </div>
    ) : (
      <div style={previewFallbackStyle}>Ingen förhandsvisning</div>
    );
  }

  return <div style={previewFallbackStyle}>Ingen förhandsvisning</div>;
}

export default function CartPage({
  getHeaderProps,
  goBackToLanding,
  backButtonStyle,
  cart,
  inputStyle,
  updateCartQuantity,
  removeFromCart,
  orderer,
  setOrderer,
  delivery,
  setDelivery,
  validateOrderDetails,
  setShowOrderSummary,
  secondaryButtonStyle,
  primaryButtonStyle,
  setStepToLanding,
  showOrderSummary,
  submitOrderToBackend,
  modalOverlayStyle,
  modalContentStyle,
  sectionTitleStyle,
}) {
  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const orderError = showOrderSummary ? validateOrderDetails() : null;

  return (
    <PageContainer>
      <AppHeader {...getHeaderProps()} />

      <div style={pageStyle}>
        <button type="button" onClick={goBackToLanding} style={backButtonStyle}>
          ← Tillbaka
        </button>

        <section style={heroSectionStyle}>
          <div style={heroBackdropStyle}>
            <div style={heroGlassCardStyle}>
              <div style={heroEyebrowStyle}>Beställning</div>

              <h1 style={heroTitleStyle}>Kundkorg</h1>

              <p style={heroTextStyle}>
                {totalItems === 0
                  ? "Kundkorgen är tom. Lägg till produkter för att gå vidare."
                  : `Du har ${totalItems} artikel${totalItems === 1 ? "" : "er"
                  } i kundkorgen. Kontrollera uppgifterna och gå vidare när du är redo.`}
              </p>
            </div>
          </div>
        </section>

        {cart.length === 0 ? (
          <div style={emptyCardStyle}>
            <div style={emptyTitleStyle}>Ingen produkt i kundkorgen</div>
            <p style={emptyTextStyle}>
              Lägg till produkter innan du går vidare till beställning.
            </p>
            <button
              type="button"
              onClick={setStepToLanding}
              style={primaryButtonStyle}
            >
              Till startsidan
            </button>
          </div>
        ) : (
          <>
            <div style={contentGridStyle}>
              <section style={mainColumnStyle}>
                <div style={sectionHeadingWrapStyle}>
                  <div style={sectionEyebrowStyle}>Produkter</div>
                  <h2 style={sectionHeadingStyle}>Dina val</h2>
                </div>

                <div style={cartListStyle}>
                  {cart.map((item) => {
                    const rows = getCartItemDisplayRows(item);
                    const detailRows = rows.filter((row) => row.label !== "Antal");

                    return (
                      <div key={item.id} style={cartItemCardStyle}>
                        <div style={cartItemContentStyle}>
                          <div>
                            <div style={cartItemTitleStyle}>
                              {item.articleNumber
                                ? `Art.nr ${item.articleNumber}`
                                : item.badgeName || item.name || "Produkt"}
                            </div> 

                            <div style={cartItemDetailsStyle}>
                              {renderDisplayRows(detailRows)}
                            </div>
                          </div>

                          <div style={cartItemActionsWrapStyle}>
                            <label
                              htmlFor={`qty-${item.id}`}
                              style={fieldLabelStyle}
                            >
                              Antal
                            </label>

                            <div style={quantityRowStyle}>
                              <input
                                id={`qty-${item.id}`}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateCartQuantity(item.id, e.target.value)
                                }
                                style={{
                                  ...inputStyle,
                                  maxWidth: 120,
                                  marginTop: 0,
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                style={dangerButtonStyle}
                              >
                                Ta bort produkt
                              </button>
                            </div>
                          </div>
                        </div>

                        <div style={previewColumnStyle}>
                          <div style={previewLabelStyle}>Förhandsvisning</div>

                          <div style={previewShellStyle}>
                            {renderCartPreview(item)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <aside style={summaryColumnStyle}>
                <div style={summaryCardStyle}>
                  <div style={summaryEyebrowStyle}>Sammanfattning</div>
                  <div style={summaryTitleStyle}>Översikt</div>

                  <div style={summaryStatsStyle}>
                    <div style={summaryStatStyle}>
                      <div style={summaryStatValueStyle}>{cart.length}</div>
                      <div style={summaryStatLabelStyle}>Produkter</div>
                    </div>

                    <div style={summaryStatStyle}>
                      <div style={summaryStatValueStyle}>{totalItems}</div>
                      <div style={summaryStatLabelStyle}>Totalt antal</div>
                    </div>
                  </div>

                  <div style={summaryTextStyle}>
                    Fyll i beställare och leveransadress nedan och gå sedan vidare
                    till orderöversikt.
                  </div>
                </div>
              </aside>
            </div>

            <div style={formsGridStyle}>
              <div style={formCardStyle}>
                <div style={formHeaderStyle}>
                  <div style={sectionEyebrowStyle}>Kontakt</div>
                  <div style={formTitleStyle}>Beställare</div>
                </div>

                <div style={formFieldsGridStyle}>
                  <div>
                    <label htmlFor="ordererName" style={fieldLabelStyle}>
                      Namn
                    </label>
                    <input
                      id="ordererName"
                      type="text"
                      value={orderer.ordererName}
                      onChange={(e) =>
                        setOrderer((prev) => ({
                          ...prev,
                          ordererName: e.target.value,
                        }))
                      }
                      style={inputStyle}
                      placeholder="Anna Svensson"
                    />
                  </div>

                  <div>
                    <label htmlFor="ordererEmail" style={fieldLabelStyle}>
                      E-post
                    </label>
                    <input
                      id="ordererEmail"
                      type="email"
                      value={orderer.ordererEmail}
                      onChange={(e) =>
                        setOrderer((prev) => ({
                          ...prev,
                          ordererEmail: e.target.value,
                        }))
                      }
                      style={inputStyle}
                      placeholder="anna@rjl.se"
                    />
                  </div>

                  <div>
                    <label htmlFor="ordererPhone" style={fieldLabelStyle}>
                      Mobilnummer
                    </label>
                    <input
                      id="ordererPhone"
                      type="text"
                      value={orderer.ordererPhone}
                      onChange={(e) =>
                        setOrderer((prev) => ({
                          ...prev,
                          ordererPhone: e.target.value,
                        }))
                      }
                      style={inputStyle}
                      placeholder="070-123 45 67"
                    />
                  </div>

                  <div>
                    <label htmlFor="accountNumber" style={fieldLabelStyle}>
                      Ansvarsnummer
                    </label>
                    <input
                      id="accountNumber"
                      type="text"
                      value={orderer.accountNumber}
                      onChange={(e) =>
                        setOrderer((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                      style={inputStyle}
                      placeholder="Ansvarsnummer"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="messageToSupplier" style={fieldLabelStyle}>
                      Meddelande till leverantör
                    </label>
                    <textarea
                      id="messageToSupplier"
                      value={orderer.messageToSupplier}
                      onChange={(e) =>
                        setOrderer((prev) => ({
                          ...prev,
                          messageToSupplier: e.target.value,
                        }))
                      }
                      style={{
                        ...inputStyle,
                        minHeight: 110,
                        maxWidth: "100%",
                        resize: "vertical",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={formCardStyle}>
                <div style={formHeaderStyle}>
                  <div style={sectionEyebrowStyle}>Leverans</div>
                  <div style={formTitleStyle}>Leveransadress</div>
                </div>

                <div style={formFieldsGridStyle}>
                  <div>
                    <label htmlFor="deliveryCompany" style={fieldLabelStyle}>
                      Företag
                    </label>
                    <input
                      id="deliveryCompany"
                      type="text"
                      value={delivery.company}
                      onChange={(e) =>
                        setDelivery((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryRecipient" style={fieldLabelStyle}>
                      Mottagare
                    </label>
                    <input
                      id="deliveryRecipient"
                      type="text"
                      value={delivery.recipient}
                      onChange={(e) =>
                        setDelivery((prev) => ({
                          ...prev,
                          recipient: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="deliveryAddress" style={fieldLabelStyle}>
                      Adress
                    </label>
                    <input
                      id="deliveryAddress"
                      type="text"
                      value={delivery.address}
                      onChange={(e) =>
                        setDelivery((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryPostalCode" style={fieldLabelStyle}>
                      Postnummer
                    </label>
                    <input
                      id="deliveryPostalCode"
                      type="text"
                      value={delivery.postalCode}
                      onChange={(e) =>
                        setDelivery((prev) => ({
                          ...prev,
                          postalCode: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryCity" style={fieldLabelStyle}>
                      Postort
                    </label>
                    <input
                      id="deliveryCity"
                      type="text"
                      value={delivery.city}
                      onChange={(e) =>
                        setDelivery((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="deliveryCountry" style={fieldLabelStyle}>
                      Land
                    </label>
                    <input
                      id="deliveryCountry"
                      type="text"
                      value={delivery.country}
                      onChange={(e) =>
                        setDelivery((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={checkoutCardStyle}>
              <div>
                <div style={checkoutTitleStyle}>Redo att beställa?</div>
                <div style={checkoutTextStyle}>
                  Kontrollera uppgifterna och gå vidare till orderöversikt.
                </div>
              </div>

              <div style={checkoutActionsStyle}>
                <button
                  type="button"
                  onClick={setStepToLanding}
                  style={secondaryButtonStyle}
                >
                  Fortsätt handla
                </button>

                <button
                  type="button"
                  onClick={() => setShowOrderSummary(true)}
                  style={primaryButtonStyle}
                >
                  Gå vidare
                </button>
              </div>
            </div>
          </>
        )}

        {showOrderSummary && (
          <div style={modalOverlayStyle}>
            <div
              style={{
                ...modalContentStyle,
                borderRadius: 24,
                boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
              }}
            >
              <div style={summaryModalHeaderStyle}>
                <div>
                  <div style={sectionEyebrowStyle}>Bekräfta</div>
                  <h2 style={summaryModalTitleStyle}>Orderöversikt</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOrderSummary(false)}
                  style={secondaryButtonStyle}
                >
                  Stäng
                </button>
              </div>

              <div style={summaryModalSectionStyle}>
                <div style={sectionTitleStyle}>Produkter</div>
                <div style={summaryItemsListStyle}>
                  {cart.map((item) => {
                    const rows = getCartItemDisplayRows(item);

                    return (
                      <div key={item.id} style={summaryItemCardStyle}>
                        <div style={summaryItemGridStyle}>
                          <div>
                            <div style={summaryItemTitleStyle}>
                              {item.articleNumber
                                ? `Art.nr ${item.articleNumber}`
                                : item.badgeName || item.name || "Produkt"}
                            </div>
                            {renderDisplayRows(rows)}
                          </div>

                          <div style={summaryPreviewColumnStyle}>
                            <div style={summaryPreviewLabelStyle}>
                              Förhandsvisning
                            </div>
                            <div style={summaryPreviewShellStyle}>
                              {renderCartPreview(item)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={summaryInfoGridStyle}>
                <div style={summaryInfoCardStyle}>
                  <div style={sectionTitleStyle}>Beställare</div>
                  <div style={summaryInfoTextStyle}>
                    <div>
                      <strong>Namn:</strong> {orderer.ordererName || "-"}
                    </div>
                    <div>
                      <strong>E-post:</strong> {orderer.ordererEmail || "-"}
                    </div>
                    <div>
                      <strong>Mobilnummer:</strong> {orderer.ordererPhone || "-"}
                    </div>
                    <div>
                      <strong>Ansvarsnummer:</strong> {orderer.accountNumber || "-"}
                    </div>
                    <div>
                      <strong>Meddelande till leverantör:</strong>{" "}
                      {orderer.messageToSupplier || "-"}
                    </div>
                  </div>
                </div>

                <div style={summaryInfoCardStyle}>
                  <div style={sectionTitleStyle}>Leveransadress</div>
                  <div style={summaryInfoTextStyle}>
                    <div>
                      <strong>Företag:</strong> {delivery.company || "-"}
                    </div>
                    <div>
                      <strong>Mottagare:</strong> {delivery.recipient || "-"}
                    </div>
                    <div>
                      <strong>Adress:</strong> {delivery.address || "-"}
                    </div>
                    <div>
                      <strong>Postnummer:</strong> {delivery.postalCode || "-"}
                    </div>
                    <div>
                      <strong>Postort:</strong> {delivery.city || "-"}
                    </div>
                    <div>
                      <strong>Land:</strong> {delivery.country || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {orderError ? <div style={orderErrorStyle}>{orderError}</div> : null}

              <div style={summaryModalActionsStyle}>
                <button
                  type="button"
                  onClick={() => setShowOrderSummary(false)}
                  style={secondaryButtonStyle}
                >
                  Tillbaka
                </button>

                <button
                  type="button"
                  onClick={submitOrderToBackend}
                  style={primaryButtonStyle}
                  disabled={Boolean(orderError)}
                >
                  Skicka beställning
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

const pageStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  paddingBottom: 40,
};

const heroSectionStyle = {
  position: "relative",
  minHeight: 220,
  borderRadius: 28,
  overflow: "hidden",
  backgroundImage:
    'linear-gradient(rgba(16,24,32,0.38), rgba(16,24,32,0.42)), url("/landing-background.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
  marginBottom: 28,
};

const heroBackdropStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  padding: 28,
};

const heroGlassCardStyle = {
  maxWidth: 720,
  background: "rgba(255,255,255,0.80)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.55)",
  borderRadius: 24,
  padding: "24px 26px",
  boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
};

const heroEyebrowStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b7280",
  marginBottom: 10,
};

const heroTitleStyle = {
  margin: 0,
  fontSize: 42,
  lineHeight: 1.08,
  letterSpacing: "-0.03em",
  color: "#111111",
};

const heroTextStyle = {
  margin: "14px 0 0",
  fontSize: 18,
  lineHeight: 1.6,
  color: "#374151",
  maxWidth: 620,
};

const emptyCardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
};

const emptyTitleStyle = {
  fontWeight: 700,
  fontSize: 28,
  marginBottom: 10,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
};

const emptyTextStyle = {
  color: "#5f6368",
  marginTop: 0,
  marginBottom: 20,
  lineHeight: 1.7,
  fontSize: 16,
};

const contentGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 300px",
  gap: 24,
  alignItems: "start",
  marginBottom: 28,
};

const mainColumnStyle = {
  display: "grid",
  gap: 18,
};

const summaryColumnStyle = {
  display: "grid",
};

const sectionHeadingWrapStyle = {
  marginBottom: 2,
};

const sectionHeadingStyle = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: "#111111",
};

const sectionEyebrowStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b7280",
  marginBottom: 8,
};

const cartListStyle = {
  display: "grid",
  gap: 20,
};

const cartItemCardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 280px",
  gap: 24,
  alignItems: "start",
};

const cartItemContentStyle = {
  display: "grid",
  gap: 18,
};

const cartItemTitleStyle = {
  fontWeight: 700,
  fontSize: 24,
  marginBottom: 12,
  lineHeight: 1.2,
  color: "#111111",
};

const cartItemDetailsStyle = {
  display: "grid",
  gap: 8,
  color: "#222222",
  lineHeight: 1.55,
  fontSize: 15,
};

const cartItemActionsWrapStyle = {
  marginTop: 4,
};

const quantityRowStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "center",
};

const previewColumnStyle = {
  display: "grid",
  gap: 10,
  alignSelf: "stretch",
};

const previewLabelStyle = {
  fontWeight: 700,
  fontSize: 16,
  color: "#111111",
};

const previewShellStyle = {
  minHeight: 180,
  background: "#f7f8f9",
  border: "1px solid #ececec",
  borderRadius: 18,
  padding: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  width: "100%",
  boxSizing: "border-box",
  textAlign: "center",
};

const badgePreviewWrapStyle = {
  width: "100%",
  minHeight: 140,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imagePreviewWrapStyle = {
  width: "100%",
  minHeight: 140,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const professionPreviewWrapStyle = {
  width: "100%",
  minHeight: 140,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const professionPreviewCardStyle = {
  position: "relative",
  width: "100%",
  maxWidth: 180,
  height: 44,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 12px",
  boxSizing: "border-box",
  overflow: "hidden",
  boxShadow: `
    0 6px 14px rgba(0,0,0,0.12),
    inset 0 1px 0 rgba(255,255,255,0.15),
    inset 0 -1px 0 rgba(0,0,0,0.12)
  `,
};

const whiteProfessionPreviewCardStyle = {
  border: "1px solid rgba(0,0,0,0.15)",
};

const professionPreviewSurfaceStyle = {
  position: "absolute",
  inset: 0,
  borderRadius: 10,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.04) 100%)",
  pointerEvents: "none",
};

const professionPreviewGlossStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "46%",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02), rgba(255,255,255,0))",
  pointerEvents: "none",
};

const professionPreviewBottomShadeStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: "28%",
  background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.08))",
  pointerEvents: "none",
};

const professionPreviewTextStyle = {
  position: "relative",
  zIndex: 1,
  fontWeight: 500,
  lineHeight: 1,
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "visible",
  textOverflow: "clip",
  textShadow: "0 1px 1px rgba(0,0,0,0.10)",
};

const previewFallbackStyle = {
  color: "#6b7280",
  fontSize: 14,
};

const summaryCardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 24,
  padding: 22,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  position: "sticky",
  top: 24,
};

const summaryEyebrowStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b7280",
  marginBottom: 8,
};

const summaryTitleStyle = {
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: "#111111",
  marginBottom: 18,
};

const summaryStatsStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 16,
};

const summaryStatStyle = {
  background: "#f7f8f9",
  border: "1px solid #ececec",
  borderRadius: 18,
  padding: 16,
};

const summaryStatValueStyle = {
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1,
  color: "#111111",
  marginBottom: 8,
};

const summaryStatLabelStyle = {
  fontSize: 13,
  color: "#6b7280",
  lineHeight: 1.4,
};

const summaryTextStyle = {
  color: "#5f6368",
  fontSize: 14,
  lineHeight: 1.65,
};

const formsGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  marginBottom: 28,
};

const formCardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  display: "grid",
  gap: 22,
};

const formHeaderStyle = {
  display: "grid",
  gap: 6,
};

const formTitleStyle = {
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: "#111111",
};

const formFieldsGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 18,
};

const checkoutCardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
};

const checkoutTitleStyle = {
  fontWeight: 700,
  fontSize: 24,
  marginBottom: 6,
  lineHeight: 1.2,
  color: "#111111",
};

const checkoutTextStyle = {
  color: "#5f6368",
  lineHeight: 1.6,
};

const checkoutActionsStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const dangerButtonStyle = {
  padding: "13px 20px",
  borderRadius: 12,
  border: "none",
  background: "#d32f2f",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 15,
};

const displayRowStyle = {
  lineHeight: 1.55,
};

const fieldLabelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: 8,
  fontSize: 14,
  color: "#1f2937",
};

const summaryModalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 24,
};

const summaryModalTitleStyle = {
  margin: 0,
  fontSize: 32,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
};

const summaryModalSectionStyle = {
  marginBottom: 24,
};

const summaryItemsListStyle = {
  display: "grid",
  gap: 14,
};

const summaryItemCardStyle = {
  border: "1px solid #e6e6e6",
  borderRadius: 16,
  padding: 16,
  background: "#fafafa",
};

const summaryItemGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 220px",
  gap: 18,
  alignItems: "start",
};

const summaryItemTitleStyle = {
  fontWeight: 700,
  marginBottom: 10,
  fontSize: 18,
  color: "#111111",
};

const summaryPreviewColumnStyle = {
  display: "grid",
  gap: 8,
};

const summaryPreviewLabelStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: "#374151",
};

const summaryPreviewShellStyle = {
  minHeight: 140,
  background: "#f7f8f9",
  border: "1px solid #ececec",
  borderRadius: 16,
  padding: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  width: "100%",
  boxSizing: "border-box",
  textAlign: "center",
};

const summaryInfoGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 18,
  marginBottom: 24,
};

const summaryInfoCardStyle = {
  border: "1px solid #e6e6e6",
  borderRadius: 16,
  padding: 18,
  background: "#fafafa",
};

const summaryInfoTextStyle = {
  display: "grid",
  gap: 8,
  lineHeight: 1.6,
  color: "#222222",
};

const orderErrorStyle = {
  marginBottom: 20,
  padding: "14px 16px",
  borderRadius: 12,
  background: "#fff4e5",
  border: "1px solid #ffd59e",
  color: "#8a4b08",
  fontWeight: 700,
};

const summaryModalActionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
  flexWrap: "wrap",
};