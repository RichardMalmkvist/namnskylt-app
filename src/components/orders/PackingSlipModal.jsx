import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { getProductTypeLabel } from "../../data/productHelpers";

function renderValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

function getOrderNumber(order) {
  return order?.orderNumber || order?.id || "-";
}

function getCreatedDate(order) {
  if (!order?.createdAt) {
    return "-";
  }

  return new Date(order.createdAt).toLocaleDateString("sv-SE");
}

function getTotalQuantity(order) {
  return (order?.cart || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
}

function getRowArticleNumber(item) {
  return item?.articleNumber || "-";
}

function getRowDeliveredQuantity(item) {
  return item?.quantity || 0;
}

export default function PackingSlipModal({
  packingSlipOrder,
  showPackingSlip,
  setShowPackingSlip,
  setPackingSlipOrder,
  renderPackingSlipDescription,
  primaryButtonStyle,
  secondaryButtonStyle,
  packingSlipOverlayStyle,
  packingSlipStyle,
  packingSlipActionsStyle,
  tableHeaderStyle,
  tableCellStyle,
}) {
  const barcodeRef = useRef(null);

  const orderNumber = getOrderNumber(packingSlipOrder);
  const totalQuantity = getTotalQuantity(packingSlipOrder);
  const createdDate = getCreatedDate(packingSlipOrder);
  const supplierMessage = packingSlipOrder?.orderer?.messageToSupplier?.trim();

  useEffect(() => {
    if (!barcodeRef.current || !packingSlipOrder || !showPackingSlip) {
      return;
    }

    if (!orderNumber || orderNumber === "-") {
      return;
    }

    JsBarcode(barcodeRef.current, orderNumber, {
      format: "CODE128",
      width: 1.45,
      height: 30,
      margin: 0,
      displayValue: false,
      background: "transparent",
    });
  }, [orderNumber, packingSlipOrder, showPackingSlip]);

  if (!packingSlipOrder || !showPackingSlip) {
    return null;
  }

  return (
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            color: "#111",
            background: "white",
            padding: "0 42px",
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          <div className="packing-slip-top-section">
            <div
              className="packing-slip-print-header"
              style={{
                paddingBottom: 8,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 0.9fr",
                  gap: 40,
                  alignItems: "start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 700,
                      letterSpacing: "0.10em",
                      textTransform: "none",
                      color: "#111111",
                      marginBottom: 14,
                    }}
                  >
                    Följesedel
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 18,
                      maxWidth: 420,
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div style={metaLabelStyle}>Datum</div>
                      <div style={metaValueStyle}>{createdDate}</div>
                    </div>

                    <div>
                      <div style={metaLabelStyle}>Ordernummer</div>
                      <div style={metaValueStyle}>{orderNumber}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <svg
                      ref={barcodeRef}
                      aria-label={`Streckkod för ordernummer ${orderNumber}`}
                      style={{
                        display: "block",
                        marginTop: 6,
                      }}
                    />
                  </div>

                  <div style={{ fontSize: 12, lineHeight: 1.6, color: "#222" }}>
                    <div>
                      <strong>Orderdatum:</strong> {createdDate}
                    </div>
                    <div>
                      <strong>Totalt antal artiklar:</strong> {totalQuantity}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <img
                    src="/jsf-logo.jpg"
                    alt="JSF Logo"
                    style={{
                      height: 42,
                      marginBottom: 12,
                      objectFit: "contain",
                      marginLeft: "auto",
                      display: "block",
                    }}
                  />

                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#1f2a44",
                      lineHeight: 1.4,
                    }}
                  >
                    Jönköpings Skyltfabrik
                  </div>

                  <div style={{ fontSize: 12, lineHeight: 1.7, color: "#222" }}>
                    <div>Gammavägen 1</div>
                    <div>556 52 Jönköping</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="packing-slip-addresses"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 50,
                marginBottom: 18,
              }}
            >
              <div>
                <div style={sectionLabelStyle}>Leveransadress</div>

                <div style={addressTextStyle}>
                  <div>{renderValue(packingSlipOrder.delivery?.recipient)}</div>
                  <div>{renderValue(packingSlipOrder.delivery?.company)}</div>
                  <div>{renderValue(packingSlipOrder.delivery?.address)}</div>
                  <div>
                    {renderValue(packingSlipOrder.delivery?.postalCode)}{" "}
                    {packingSlipOrder.delivery?.city || ""}
                  </div>
                  <div>{renderValue(packingSlipOrder.delivery?.country)}</div>
                </div>
              </div>

              <div>
                <div style={sectionLabelStyle}>Beställare</div>

                <div style={addressTextStyle}>
                  <div>{renderValue(packingSlipOrder.orderer?.ordererName)}</div>
                  <div>{renderValue(packingSlipOrder.orderer?.ordererEmail)}</div>
                  <div>{renderValue(packingSlipOrder.orderer?.ordererPhone)}</div>
                  <div style={{ marginTop: 2 }}>
                    <strong>Ansvarsnummer:</strong>{" "}
                    {renderValue(packingSlipOrder.orderer?.accountNumber)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: supplierMessage ? 14 : 16 }}>
            <table
              className="packing-slip-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      ...tableHeaderStyle,
                      ...headerCellStyle,
                      width: "18%",
                    }}
                  >
                    Artikelgrupp
                  </th>
                  <th
                    style={{
                      ...tableHeaderStyle,
                      ...headerCellStyle,
                      width: "14%",
                    }}
                  >
                    Art.nr
                  </th>
                  <th
                    style={{
                      ...tableHeaderStyle,
                      ...headerCellStyle,
                      width: "40%",
                    }}
                  >
                    Beskrivning
                  </th>
                  <th
                    style={{
                      ...tableHeaderStyle,
                      ...headerCellStyle,
                      width: "14%",
                      textAlign: "center",
                    }}
                  >
                    Antal
                  </th>
                  <th
                    style={{
                      ...tableHeaderStyle,
                      ...headerCellStyle,
                      width: "14%",
                      textAlign: "center",
                    }}
                  >
                    Lev. antal
                  </th>
                </tr>
              </thead>

              <tbody>
                {(packingSlipOrder.cart || []).map((item, index) => (
                  <tr key={item.id || index}>
                    <td
                      style={{
                        ...tableCellStyle,
                        ...bodyCellStyle,
                        verticalAlign: "top",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        {getProductTypeLabel(item.productType)}
                      </div>
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        ...bodyCellStyle,
                        verticalAlign: "top",
                      }}
                    >
                      {getRowArticleNumber(item)}
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        ...bodyCellStyle,
                        verticalAlign: "top",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gap: 3,
                          lineHeight: 1.4,
                        }}
                      >
                        {renderPackingSlipDescription(item)}
                      </div>
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        ...bodyCellStyle,
                        textAlign: "center",
                        verticalAlign: "top",
                        fontWeight: 600,
                      }}
                    >
                      {item.quantity || 0}
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        ...bodyCellStyle,
                        textAlign: "center",
                        verticalAlign: "top",
                        fontWeight: 600,
                      }}
                    >
                      {getRowDeliveredQuantity(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {supplierMessage ? (
            <div
              className="packing-slip-message"
              style={{
                marginBottom: 16,
                paddingTop: 8,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#444",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 5,
                }}
              >
                Meddelande till leverantör
              </div>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.55,
                  fontSize: 12,
                  color: "#222",
                }}
              >
                {supplierMessage}
              </div>
            </div>
          ) : null}

          <div
            className="packing-slip-footer"
            style={{
              marginTop: 18,
              paddingTop: 12,
              borderTop: "1px solid #444",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 20,
              alignItems: "center",
              fontSize: 12,
              color: "#333",
            }}
          >
            <div>
              <strong>Jönköpings Skyltfabrik</strong>
            </div>

            <div>
              Totalt antal: <strong>{totalQuantity}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const metaLabelStyle = {
  fontSize: 10,
  fontWeight: 700,
  color: "#555",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 3,
};

const metaValueStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: "#111",
  lineHeight: 1.4,
};

const sectionLabelStyle = {
  fontWeight: 700,
  color: "#111111",
  marginBottom: 10,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const addressTextStyle = {
  lineHeight: 1.65,
  fontSize: 12,
  color: "#222",
};

const headerCellStyle = {
  color: "#222",
  borderBottom: "1px solid #444",
  paddingTop: 8,
  paddingBottom: 3,
  fontSize: 11,
  fontWeight: 700,
  background: "transparent",
};

const bodyCellStyle = {
  paddingTop: 8,
  paddingBottom: 8,
  fontSize: 12,
  lineHeight: 1.45,
};