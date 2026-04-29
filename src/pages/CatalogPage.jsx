import { useMemo, useState } from "react";
import BadgeCard from "../components/products/BadgeCard";
import CategorySideMenu from "../components/layout/CategorySideMenu";
import AppHeader from "../components/layout/AppHeader";
import PageContainer from "../components/layout/PageContainer";
import { getProductsByCategory } from "../data/products";
import {
  getCategoryEmptyState,
  getCategoryIntroText,
} from "../data/catalogConfig";
import { getDirectProductQuantityConfig } from "../data/directProductFieldHelpers";

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

  if (length <= 10) return 36;
  if (length <= 14) return 34;
  if (length <= 18) return 32;
  if (length <= 24) return 29;
  if (length <= 30) return 27;

  return 19;
}

function getProfessionLetterSpacing(title = "") {
  const length = title.trim().length;

  if (length <= 14) return "-0.02em";
  if (length <= 24) return "-0.03em";

  return "-0.04em";
}

function isProfessionProduct(product) {
  return (
    product?.previewType === "profession" ||
    product?.productType === "yrkestitelsskylt" ||
    product?.categoryId === "yrkestitelsskyltar"
  );
}

function isCatalogCardProduct(product) {
  if (!product) return false;

  return product.flowType !== "direct" || product.directAddToCart === true;
}

function getProductsGridStyle(categoryId) {
  if (categoryId === "pendlade-vit") {
    return {
      ...productsGridStyle,
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    };
  }

  if (categoryId === "dorrskyltar") {
    return {
      ...productsGridStyle,
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    };
  }

  return productsGridStyle;
}

function getDirectImageStyle(product) {
  const isSmall = product?.imageVariant === "small";

  return {
    ...floatingMediaImageStyle,
    maxWidth: isSmall ? "52%" : "100%",
    maxHeight: isSmall ? 74 : 140,
  };
}

export default function CatalogPage({
  getHeaderProps,
  goBackToLanding,
  backButtonStyle,
  selectedCategory,
  openCategory,
  inputStyle,
  openProduct,
  addDirectProductToCart,
}) {
  const [localSuccessMessage, setLocalSuccessMessage] = useState("");
  const [selectedProfessionId, setSelectedProfessionId] = useState("");
  const [selectedFolktandvardenProfessionId, setSelectedFolktandvardenProfessionId] =
    useState("");
  const [productInputs, setProductInputs] = useState({});

  const categoryId = selectedCategory?.id || null;

  const categoryProducts = useMemo(() => {
    if (!categoryId) return [];
    return getProductsByCategory(categoryId);
  }, [categoryId]);

  const catalogCardProducts = useMemo(() => {
    return categoryProducts.filter((product) => isCatalogCardProduct(product));
  }, [categoryProducts]);

  const directCategoryProducts = useMemo(() => {
    return categoryProducts.filter((product) => !isCatalogCardProduct(product));
  }, [categoryProducts]);

  const emptyState = getCategoryEmptyState(selectedCategory);

  const professionProducts = useMemo(() => {
    return categoryProducts.filter((product) => isProfessionProduct(product));
  }, [categoryProducts]);

  const standardProfessionProducts = useMemo(() => {
    return professionProducts.filter(
      (product) => product.group !== "folktandvarden"
    );
  }, [professionProducts]);

  const folktandvardenProfessionProducts = useMemo(() => {
    return professionProducts.filter(
      (product) => product.group === "folktandvarden"
    );
  }, [professionProducts]);

  const selectedProfessionProduct = useMemo(() => {
    if (!standardProfessionProducts.length) return null;

    const explicitMatch = standardProfessionProducts.find(
      (product) => String(product.id) === String(selectedProfessionId)
    );

    return explicitMatch || standardProfessionProducts[0];
  }, [standardProfessionProducts, selectedProfessionId]);

  const selectedFolktandvardenProfessionProduct = useMemo(() => {
    if (!folktandvardenProfessionProducts.length) return null;

    const explicitMatch = folktandvardenProfessionProducts.find(
      (product) =>
        String(product.id) === String(selectedFolktandvardenProfessionId)
    );

    return explicitMatch || folktandvardenProfessionProducts[0];
  }, [
    folktandvardenProfessionProducts,
    selectedFolktandvardenProfessionId,
  ]);

  function getProductInputState(product) {
    const existing = productInputs[product.id];
    if (existing) return existing;

    const quantityConfig = getDirectProductQuantityConfig(product);

    return {
      quantity: quantityConfig.defaultValue ?? 1,
    };
  }

  function getProductQuantity(product) {
    return getProductInputState(product).quantity || 1;
  }

  function updateProductQuantity(product, value) {
    const quantityConfig = getDirectProductQuantityConfig(product);

    const normalizedValue = Math.max(
      quantityConfig?.min || 1,
      Number(value) || quantityConfig?.defaultValue || 1
    );

    setProductInputs((prev) => ({
      ...prev,
      [product.id]: {
        ...getProductInputState(product),
        ...(prev[product.id] || {}),
        quantity: normalizedValue,
      },
    }));
  }

  function showLocalSuccessMessage(message) {
    setLocalSuccessMessage(message);

    setTimeout(() => {
      setLocalSuccessMessage("");
    }, 3000);
  }

  function getProductDisplayName(product) {
    return product?.articleNumber
      ? `Art.nr ${product.articleNumber}`
      : product?.name || "Produkten";
  }

  function handleProfessionProduct(product) {
    if (!product) return;

    const quantity = getProductQuantity(product);
    addDirectProductToCart(product, quantity, {});
    showLocalSuccessMessage(
      `${getProductDisplayName(product)} lades i kundkorgen.`
    );
  }

  function handleCatalogCardAction(product) {
    if (product?.directAddToCart) {
      addDirectProductToCart(product, 1, {});
      showLocalSuccessMessage(
        `${getProductDisplayName(product)} lades i kundkorgen.`
      );
      return;
    }

    openProduct(product);
  }

  function handleSimpleDirectAdd(product) {
    const quantity = getProductQuantity(product);
    addDirectProductToCart(product, quantity, {});
    showLocalSuccessMessage(
      `${getProductDisplayName(product)} lades i kundkorgen.`
    );
  }

  function renderIntroText() {
    return getCategoryIntroText(
      selectedCategory,
      directCategoryProducts.length > 0
    );
  }

  function renderProfessionProductPreview(product) {
    const professionTitle =
      product?.fixedProfessionTitle || product?.name || "Titel";
    const { background, color } = getProfessionCardColors(
      product?.fixedColor,
      product?.fixedTextColor
    );

    const isWhiteBadge = (product?.fixedColor || "").toLowerCase() === "vit";

    return (
      <div style={professionPreviewShellStyle}>
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
              fontSize: getProfessionFontSize(professionTitle),
              letterSpacing: getProfessionLetterSpacing(professionTitle),
            }}
          >
            {professionTitle}
          </div>
        </div>
      </div>
    );
  }

  function renderProfessionDropdownCard(
    products,
    selectedProduct,
    setSelectedProductId,
    title = "Yrkestitelsskylt",
    description = "Välj yrkesroll i listan nedan och lägg direkt i kundkorgen."
  ) {
    if (!products.length || !selectedProduct) {
      return (
        <div style={emptyCardStyle}>
          <div style={emptyTitleStyle}>{emptyState.title}</div>
          <p style={emptyTextStyle}>{emptyState.text}</p>
        </div>
      );
    }

    const quantityConfig = getDirectProductQuantityConfig(selectedProduct);

    return (
      <div style={professionDropdownCardStyle}>
        <div style={floatingMediaAreaStyle}>
          <div style={floatingMediaStageStyle}>
            {renderProfessionProductPreview(selectedProduct)}
          </div>

          <div style={floatingMediaShadowStyle} />
        </div>

        <div style={directCardContentStyle}>
          <div>
            <div style={directCardTitleStyle}>{title}</div>
            <div style={directCardDescStyle}>{description}</div>
            <div style={directCardDescStyle}>
              Levereras med militärklämma i metall.
            </div>
          </div>

          <div style={professionFormGridStyle}>
            <div>
              <label
                htmlFor={`profession-choice-${title}`}
                style={fieldLabelStyle}
              >
                Yrkesroll
              </label>

              <select
                id={`profession-choice-${title}`}
                value={selectedProduct.id}
                onChange={(e) => setSelectedProductId(e.target.value)}
                style={{
                  ...inputStyle,
                  maxWidth: "100%",
                }}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.fixedProfessionTitle || product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={`quantity-${selectedProduct.id}`}
                style={fieldLabelStyle}
              >
                {quantityConfig.label}
              </label>

              <input
                id={`quantity-${selectedProduct.id}`}
                type="number"
                min={String(quantityConfig.min ?? 1)}
                value={getProductQuantity(selectedProduct)}
                onChange={(e) =>
                  updateProductQuantity(selectedProduct, e.target.value)
                }
                style={{
                  ...inputStyle,
                  width: "100%",
                  maxWidth: "100%",
                  marginTop: 0,
                }}
              />
            </div>
          </div>

          <div style={professionMetaStyle}>
            <div>
              <strong>Art.nr:</strong>{" "}
              {selectedProduct.articleNumber || "-"}
            </div>
            <div>
              <strong>Färg:</strong> {selectedProduct.fixedColor || "-"}
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => handleProfessionProduct(selectedProduct)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleProfessionProduct(selectedProduct);
              }
            }}
            style={addToCartLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            Lägg i kundkorg <span style={addToCartArrowStyle}>→</span>
          </div>
        </div>
      </div>
    );
  }

  function renderSimpleDirectProductCard(product) {
    const quantityConfig = getDirectProductQuantityConfig(product);

    return (
      <div
        key={product.id}
        style={simpleDirectCardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.07)";
          e.currentTarget.style.borderColor = "#e2e8e3";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.04)";
          e.currentTarget.style.borderColor = "#ececec";
        }}
      >
        <div style={floatingMediaAreaStyle}>
          <div style={floatingMediaStageStyle}>
            <img
              src={product.image}
              alt={product.name}
              style={getDirectImageStyle(product)}
            />
          </div>

          <div style={floatingMediaShadowStyle} />
        </div>

        <div style={directCardContentStyle}>
          <div>
            <div style={directCardTitleStyle}>
              {product.articleNumber
                ? `Art.nr ${product.articleNumber}`
                : product.name}
            </div>
            <div style={directCardDescStyle}>{product.desc}</div>
          </div>

          <div style={simpleDirectFooterStyle}>
            <div>
              <label
                htmlFor={`quantity-${product.id}`}
                style={fieldLabelStyle}
              >
                {quantityConfig.label}
              </label>

              <input
                id={`quantity-${product.id}`}
                type="number"
                min={String(quantityConfig.min ?? 1)}
                value={getProductQuantity(product)}
                onChange={(e) => updateProductQuantity(product, e.target.value)}
                style={{
                  ...inputStyle,
                  width: 92,
                  maxWidth: 92,
                  marginTop: 0,
                }}
              />
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => handleSimpleDirectAdd(product)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSimpleDirectAdd(product);
                }
              }}
              style={addToCartLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              Lägg i kundkorg <span style={addToCartArrowStyle}>→</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderProductCard(product) {
    return (
      <BadgeCard
        key={product.id}
        badge={product}
        onAction={() => handleCatalogCardAction(product)}
      />
    );
  }

  function renderProductsWithOptionalHeading(products) {
    if (products.length === 0) {
      return null;
    }

    if (categoryId !== "namnbrickor") {
      return products.map((product) => renderProductCard(product));
    }

    return products.map((product) => (
      <div key={product.id} style={productGroupItemStyle}>
        {product.articleNumber === "0208" && (
          <div style={catalogSubsectionHeadingWrapStyle}>
            <h2 style={catalogSubsectionHeadingStyle}>
              Namnbrickor Folktandvården
            </h2>
          </div>
        )}

        {product.articleNumber === "0211" && (
          <div style={catalogSubsectionHeadingWrapStyle}>
            <h2 style={catalogSubsectionHeadingStyle}>
              Namnbrickor Energikontor Norra Småland
            </h2>
          </div>
        )}

        {renderProductCard(product)}
      </div>
    ));
  }

  function renderProductCards(products) {
    if (products.length === 0) {
      return (
        <div style={emptyCardStyle}>
          <div style={emptyTitleStyle}>Inga produkter</div>
          <p style={emptyTextStyle}>
            Det finns inga upplagda produkter för denna kategori ännu.
          </p>
        </div>
      );
    }

    return (
      <div style={getProductsGridStyle(categoryId)}>
        {renderProductsWithOptionalHeading(products)}
      </div>
    );
  }

  function renderDirectCategory(products) {
    if (categoryId === "yrkestitelsskyltar") {
      return (
        <div style={mixedSectionsStyle}>
          <section>
            <div style={sectionHeadingWrapStyle}>
              <div style={sectionEyebrowStyle}>Yrkestitelsskyltar</div>
              <h2 style={sectionHeadingStyle}>Standard</h2>
            </div>
            {renderProfessionDropdownCard(
              standardProfessionProducts,
              selectedProfessionProduct,
              setSelectedProfessionId,
              "Yrkestitelsskylt",
              "Välj yrkesroll i listan nedan och lägg direkt i kundkorgen."
            )}
          </section>

          {folktandvardenProfessionProducts.length > 0 && (
            <section>
              <div style={sectionHeadingWrapStyle}>
                <div style={sectionEyebrowStyle}>Yrkestitelsskyltar</div>
                <h2 style={sectionHeadingStyle}>Folktandvården</h2>
              </div>
              {renderProfessionDropdownCard(
                folktandvardenProfessionProducts,
                selectedFolktandvardenProfessionProduct,
                setSelectedFolktandvardenProfessionId,
                "Yrkestitelsskylt Folktandvården",
                "Välj yrkesroll i listan nedan och lägg direkt i kundkorgen."
              )}
            </section>
          )}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div style={emptyCardStyle}>
          <div style={emptyTitleStyle}>{emptyState.title}</div>
          <p style={emptyTextStyle}>{emptyState.text}</p>
        </div>
      );
    }

    return (
      <div style={getProductsGridStyle(categoryId)}>
        {products.map((product) => renderSimpleDirectProductCard(product))}
      </div>
    );
  }

  function renderCategoryContent() {
    if (!selectedCategory) {
      return (
        <div style={emptyCardStyle}>
          <div style={emptyTitleStyle}>Ingen kategori vald</div>
          <p style={emptyTextStyle}>Välj en kategori i menyn.</p>
        </div>
      );
    }
    if (!selectedCategory.isImplemented) {
      return (
        <div style={emptyCardStyle}>
          <div style={emptyTitleStyle}>{selectedCategory.title}</div>
          <p style={emptyTextStyle}>
            Denna produktkategori är inte upplagd ännu.
          </p>
        </div>
      );
    }

    if (catalogCardProducts.length > 0 && directCategoryProducts.length === 0) {
      return renderProductCards(catalogCardProducts);
    }

    if (directCategoryProducts.length > 0 && catalogCardProducts.length === 0) {
      return renderDirectCategory(directCategoryProducts);
    }

    if (catalogCardProducts.length === 0 && directCategoryProducts.length === 0) {
      return (
        <div style={emptyCardStyle}>
          <div style={emptyTitleStyle}>{emptyState.title}</div>
          <p style={emptyTextStyle}>{emptyState.text}</p>
        </div>
      );
    }

    return (
      <div style={mixedSectionsStyle}>
        {catalogCardProducts.length > 0 && (
          <section>
            <div style={sectionHeadingWrapStyle}>
              <div style={sectionEyebrowStyle}>Produkter</div>
              <h2 style={sectionHeadingStyle}>Välj produkt</h2>
            </div>
            {renderProductCards(catalogCardProducts)}
          </section>
        )}

        {directCategoryProducts.length > 0 && (
          <section>
            <div style={sectionHeadingWrapStyle}>
              <div style={sectionEyebrowStyle}>Direktbeställning</div>
              <h2 style={sectionHeadingStyle}>Beställ direkt</h2>
            </div>
            {renderDirectCategory(directCategoryProducts)}
          </section>
        )}
      </div>
    );
  }

  return (
    <PageContainer>
      <AppHeader {...getHeaderProps()} />

      <div style={pageStyle}>
        <button type="button" onClick={goBackToLanding} style={backButtonStyle}>
          ← Tillbaka
        </button>

        <div style={layoutStyle}>
          <CategorySideMenu
            activeCategoryId={selectedCategory?.id}
            onSelectCategory={openCategory}
          />

          <div style={contentColumnStyle}>
            <section style={heroSectionStyle}>
              <div style={heroBackdropStyle}>
                <div style={heroGlassCardStyle}>
                  <div style={heroEyebrowStyle}>Produktkategori</div>

                  <h1 style={heroTitleStyle}>
                    {selectedCategory?.title || "Produkter"}
                  </h1>

                  <p style={heroTextStyle}>{renderIntroText()}</p>
                </div>
              </div>
            </section>

            {localSuccessMessage && (
              <div style={successStyle}>{localSuccessMessage}</div>
            )}

            {renderCategoryContent()}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

const pageStyle = {
  maxWidth: 1280,
  margin: "0 auto",
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
  gap: 24,
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

const heroEyebrowStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.68)",
  marginBottom: 10,
};

const heroTitleStyle = {
  margin: 0,
  fontSize: 42,
  lineHeight: 1.08,
  letterSpacing: "-0.03em",
  color: "#ffffff",
};

const heroTextStyle = {
  margin: "14px 0 0",
  fontSize: 18,
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.88)",
  maxWidth: 620,
};

const successStyle = {
  background: "#eef8f1",
  border: "1px solid #d7eddd",
  color: "#1b5e20",
  borderRadius: 14,
  padding: "14px 18px",
  fontWeight: 600,
};

const productsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 24,
};

const productGroupItemStyle = {
  display: "contents",
};

const catalogSubsectionHeadingWrapStyle = {
  gridColumn: "1 / -1",
  marginTop: 8,
  marginBottom: -4,
};

const catalogSubsectionHeadingStyle = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
  color: "#111111",
};

const mixedSectionsStyle = {
  display: "grid",
  gap: 34,
};

const sectionHeadingWrapStyle = {
  marginBottom: 18,
};

const sectionEyebrowStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b7280",
  marginBottom: 8,
};

const sectionHeadingStyle = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: "#111111",
};

const emptyCardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
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
  marginBottom: 0,
  lineHeight: 1.7,
  fontSize: 16,
};

const professionDropdownCardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 22,
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
  display: "flex",
  flexDirection: "column",
  maxWidth: 720,
};

const simpleDirectCardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 22,
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
  transition:
    "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
  display: "flex",
  flexDirection: "column",
};

const floatingMediaAreaStyle = {
  position: "relative",
  height: 220,
  padding: "18px 16px 6px",
  background: "#f6f7f8",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const floatingMediaStageStyle = {
  width: "100%",
  height: 150,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 2,
};

const floatingMediaImageStyle = {
  maxWidth: "100%",
  maxHeight: 140,
  objectFit: "contain",
  display: "block",
  filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.08))",
};

const floatingMediaShadowStyle = {
  width: "55%",
  height: 14,
  marginTop: 6,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.10)",
  filter: "blur(10px)",
};

const professionPreviewShellStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const professionPreviewCardStyle = {
  position: "relative",
  width: "100%",
  maxWidth: 420,
  height: 100,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 10px",
  boxSizing: "border-box",
  overflow: "hidden",
  boxShadow: `
    0 8px 16px rgba(0,0,0,0.10),
    inset 0 1px 0 rgba(255,255,255,0.16),
    inset 0 -1px 0 rgba(0,0,0,0.12)
  `,
};

const whiteProfessionPreviewCardStyle = {
  border: "1px solid rgba(0,0,0,0.12)",
};

const professionPreviewSurfaceStyle = {
  position: "absolute",
  inset: 0,
  borderRadius: 10,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.03) 100%)",
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

const directCardContentStyle = {
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const professionFormGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 140px",
  gap: 16,
  alignItems: "end",
  marginTop: 6,
};

const professionMetaStyle = {
  display: "grid",
  gap: 6,
  marginTop: 6,
  color: "#374151",
  fontSize: 14,
  lineHeight: 1.5,
};

const directCardTitleStyle = {
  fontWeight: 700,
  fontSize: 18,
  lineHeight: 1.3,
  marginBottom: 4,
  color: "#111111",
};

const directCardDescStyle = {
  color: "#5f6368",
  lineHeight: 1.5,
  fontSize: 14,
};

const simpleDirectFooterStyle = {
  display: "grid",
  gap: 10,
  marginTop: 4,
};

const addToCartLinkStyle = {
  marginTop: 2,
  fontSize: 14,
  fontWeight: 700,
  color: "#009846",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  width: "fit-content",
  transition: "transform 0.18s ease",
};

const addToCartArrowStyle = {
  fontSize: 18,
  lineHeight: 1,
};

const fieldLabelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: 8,
  fontSize: 14,
  color: "#1f2937",
};