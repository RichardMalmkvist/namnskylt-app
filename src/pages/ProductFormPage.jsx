import AppHeader from "../components/layout/AppHeader";
import BadgePreview from "../components/products/BadgePreview";
import CategorySideMenu from "../components/layout/CategorySideMenu";
import Field from "../components/forms/Field";
import PageContainer from "../components/layout/PageContainer";
import {
  hasBadgeField,
  isProfessionProductType,
} from "../data/productHelpers";
import { isProfessionFlowProduct } from "../data/products";
import { getFormPreviewConfig } from "../data/previewHelpers";
import {
  DEFAULT_FIELD_ORDER,
  renderConfiguredField,
} from "../data/formFieldHelpers";

function renderFloatingPreview(selectedBadge, productForm) {
  const config = getFormPreviewConfig(selectedBadge);

  if (
    config.previewType === "profession" ||
    config.previewType === "badge" ||
    config.previewType === "hanging_sign" ||
    config.previewType === "door_sign"
  ) {
    return (
      <div style={floatingPreviewAreaStyle}>
        <div style={floatingPreviewStageStyle}>
          <BadgePreview
            badgeId={config.badgeId}
            productType={config.productType}
            productForm={productForm}
            maxWidth={config.maxWidth}
          />
        </div>

        <div style={floatingPreviewShadowStyle} />
      </div>
    );
  }

  if (selectedBadge?.image) {
    return (
      <div style={floatingPreviewAreaStyle}>
        <div style={floatingPreviewStageStyle}>
          <img
            src={selectedBadge.image}
            alt={selectedBadge.name || "Produktbild"}
            style={{
              width: "100%",
              maxWidth: config.maxWidth || 700,
              height: "auto",
              objectFit: "contain",
              display: "block",
              filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.10))",
            }}
          />
        </div>

        <div style={floatingPreviewShadowStyle} />
      </div>
    );
  }

  return null;
}

export default function ProductFormPage({
  getHeaderProps,
  goBackFromForm,
  backButtonStyle,
  selectedCategory,
  openCategory,
  selectedBadge,
  selectedProductType,
  successMessage,
  productForm,
  setProductForm,
  addCurrentItemToCart,
  inputStyle,
}) {
  const isProfession =
    isProfessionFlowProduct(selectedBadge) ||
    isProfessionProductType(selectedProductType);

  const hasSelectedProduct = isProfession || Boolean(selectedBadge);

  function updateFormValue(key, value) {
    setProductForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function renderProductFields() {
    if (!selectedBadge?.fields) return null;

    return DEFAULT_FIELD_ORDER.map((fieldKey) => {
      if (!hasBadgeField(selectedBadge, fieldKey)) {
        return null;
      }

      return renderConfiguredField(fieldKey, {
        Field,
        selectedBadge,
        productForm,
        updateFormValue,
        setProductForm,
        inputStyle,
      });
    });
  }

  return (
    <PageContainer>
      <AppHeader {...getHeaderProps()} />

      <div style={pageStyle}>
        <button type="button" onClick={goBackFromForm} style={backButtonStyle}>
          ← Tillbaka
        </button>

        <div style={layoutStyle}>
          <CategorySideMenu
            activeCategoryId={selectedCategory?.id}
            onSelectCategory={openCategory}
          />

          <div style={contentColumnStyle}>
            {!hasSelectedProduct ? (
              <div style={emptyStateCardStyle}>
                <h1 style={emptyTitleStyle}>Ingen produkt vald</h1>

                <p style={emptyTextStyle}>
                  Du har hamnat på formulärsidan utan att någon produkt är vald.
                  Gå tillbaka och välj en produkt i katalogen.
                </p>

                <button
                  type="button"
                  onClick={goBackFromForm}
                  style={fallbackActionStyle}
                >
                  Gå tillbaka till katalogen
                  <span style={addToCartArrowStyle}>→</span>
                </button>
              </div>
            ) : (
              <>
                <section style={heroSectionStyle}>
                  <div style={heroBackdropStyle}>
                    <div style={heroGlassCardStyle}>
                      <div style={glassHighlightStyle} />

                      <div style={heroEyebrowStyle}>
                        {selectedCategory?.title || "Produkt"}
                      </div>

                      <h1 style={heroTitleStyle}>
                        Beställ{" "}
                        {selectedBadge?.name || selectedProductType?.title || ""}
                      </h1>

                      <p style={heroTextStyle}>
                        Fyll i uppgifterna nedan för att anpassa produkten och
                        lägga den i kundkorgen.
                      </p>
                    </div>
                  </div>
                </section>

                {selectedBadge && (
                  <div style={productMetaStyle}>
                    <div style={productMetaTitleStyle}>{selectedBadge.name}</div>
                    <div style={productMetaDescStyle}>{selectedBadge.desc}</div>
                  </div>
                )}

                {successMessage ? (
                  <div style={successStyle}>{successMessage}</div>
                ) : null}

                {isProfession ? (
                  <div style={infoBoxStyle}>
                    Denna skylt levereras med militärklämma i metall.
                  </div>
                ) : null}

                <div style={previewShellStyle}>
                  {renderFloatingPreview(selectedBadge, productForm)}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addCurrentItemToCart();
                  }}
                  style={formCardStyle}
                >
                  <div style={formHeaderStyle}>
                    <div style={formHeaderEyebrowStyle}>Anpassning</div>
                    <div style={formHeaderTitleStyle}>Produktuppgifter</div>
                  </div>

                  <div style={fieldsWrapperStyle}>{renderProductFields()}</div>

                  <div style={formActionsStyle}>
                    <button
                      type="submit"
                      style={addToCartLinkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.gap = "10px";
                        e.currentTarget.style.opacity = "0.8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.gap = "6px";
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      Lägg i kundkorg
                      <span style={addToCartArrowStyle}>→</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

const pageStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  paddingTop: 28,
  paddingBottom: 40,
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "260px minmax(0, 1fr)",
  gap: 32,
  alignItems: "start",
};

const contentColumnStyle = {
  display: "grid",
  gap: 20,
  maxWidth: 920,
};

const heroSectionStyle = {
  position: "relative",
  minHeight: 250,
  borderRadius: 28,
  overflow: "hidden",
  backgroundImage:
    'linear-gradient(rgba(20,25,30,0.55), rgba(20,25,30,0.65)), url("/landing-background.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
};

const heroBackdropStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  padding: 28,
};

const heroGlassCardStyle = {
  position: "relative",
  overflow: "hidden",
  maxWidth: 680,
  width: "100%",
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(26px) saturate(180%)",
  WebkitBackdropFilter: "blur(26px) saturate(180%)",
  borderRadius: 26,
  padding: "36px 40px",
  border: "1px solid rgba(255,255,255,0.25)",
  boxShadow: `
    0 12px 40px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.25),
    inset 0 -1px 0 rgba(255,255,255,0.08)
  `,
};

const glassHighlightStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "50%",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05), rgba(255,255,255,0))",
  pointerEvents: "none",
};

const heroEyebrowStyle = {
  position: "relative",
  zIndex: 1,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.68)",
  marginBottom: 10,
};

const heroTitleStyle = {
  position: "relative",
  zIndex: 1,
  margin: 0,
  fontSize: 42,
  lineHeight: 1.08,
  letterSpacing: "-0.03em",
  color: "#ffffff",
};

const heroTextStyle = {
  position: "relative",
  zIndex: 1,
  margin: "14px 0 0",
  fontSize: 18,
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.88)",
  maxWidth: 580,
};

const productMetaStyle = {
  display: "grid",
  gap: 6,
  padding: "2px 2px 0",
};

const productMetaTitleStyle = {
  fontWeight: 700,
  fontSize: 22,
  color: "#111111",
  lineHeight: 1.2,
};

const productMetaDescStyle = {
  color: "#5f6368",
  lineHeight: 1.6,
  fontSize: 15,
};

const successStyle = {
  background: "#eef8f1",
  border: "1px solid #d7eddd",
  color: "#1b5e20",
  borderRadius: 14,
  padding: "14px 18px",
  fontWeight: 600,
};

const infoBoxStyle = {
  background: "#f6f8fb",
  border: "1px solid #e5eaf0",
  borderRadius: 16,
  padding: "14px 18px",
  color: "#374151",
  lineHeight: 1.6,
  fontSize: 14,
};

const previewShellStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 24,
  padding: 0,
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
};

const floatingPreviewAreaStyle = {
  position: "relative",
  minHeight: 290,
  padding: "34px 28px 18px",
  background:
    "linear-gradient(180deg, #fbfbfc 0%, #f5f6f7 72%, #f2f3f4 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const floatingPreviewStageStyle = {
  width: "100%",
  minHeight: 210,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 2,
};

const floatingPreviewShadowStyle = {
  width: "52%",
  height: 18,
  marginTop: 10,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.12)",
  filter: "blur(14px)",
  transform: "translateY(-1px)",
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

const formHeaderEyebrowStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b7280",
};

const formHeaderTitleStyle = {
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: "#111111",
};

const fieldsWrapperStyle = {
  display: "grid",
  gap: 18,
};

const formActionsStyle = {
  paddingTop: 4,
};

const addToCartLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 16,
  fontWeight: 700,
  color: "#009846",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
  transition: "all 0.18s ease",
  width: "fit-content",
};

const addToCartArrowStyle = {
  fontSize: 18,
  lineHeight: 1,
};

const fallbackActionStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 16,
  fontWeight: 700,
  color: "#009846",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
  transition: "all 0.18s ease",
  width: "fit-content",
};

const emptyStateCardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
};

const emptyTitleStyle = {
  fontSize: 36,
  marginTop: 0,
  marginBottom: 12,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
};

const emptyTextStyle = {
  color: "#5f6368",
  marginTop: 0,
  marginBottom: 20,
  lineHeight: 1.7,
  fontSize: 16,
};