import AppHeader from "../components/layout/AppHeader";
import PageContainer from "../components/layout/PageContainer";
import { MENU_CATEGORIES } from "../data/categories";

export default function LandingPage({
  toastMessage,
  getHeaderProps,
  openCategory,
  openNameBadges,
}) {
  const implementedCategories = MENU_CATEGORIES.filter(
    (category) => category.isImplemented
  );

  const featuredCategories = implementedCategories.filter(
    (category) =>
      category.id === "namnbrickor" || category.id === "yrkestitelsskyltar"
  );

  function openFeaturedCategory(category) {
    if (category.id === "namnbrickor") {
      openNameBadges();
      return;
    }

    openCategory(category);
  }

  return (
    <PageContainer>
      <AppHeader {...getHeaderProps()} />

      <div style={pageStyle}>
        {toastMessage ? <div style={toastStyle}>{toastMessage}</div> : null}

        <section style={heroSectionStyle}>
          <div style={heroOverlayStyle}>
            <div style={heroContentStyle}>
              <div style={heroGlassCardStyle}>
                <div style={glassHighlightStyle} />

                <div style={heroEyebrowStyle}>Jönköpings Skyltfabrik</div>

                <h1 style={heroTitleStyle}>Beställ skyltar</h1>

                <p style={heroTextStyle}>
                  Välj kategori för att börja. Här beställer du skyltar för
                  Region Jönköpings län på ett enkelt och tydligt sätt.
                </p>

                <img
                  src="/rjllogo.png"
                  alt="RJL logo"
                  style={heroLogoStyle}
                />
              </div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionEyebrowStyle}>Snabbval</div>
            <h2 style={sectionTitleStyle}>Vanliga beställningar</h2>
            <p style={sectionTextStyle}>
              Gå direkt till de vanligaste kategorierna.
            </p>
          </div>

          <div style={featuredGridStyle}>
            {featuredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => openFeaturedCategory(category)}
                style={featuredCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 36px rgba(0,0,0,0.10)";
                  e.currentTarget.style.borderColor = "#dfe7df";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.05)";
                  e.currentTarget.style.borderColor = "#ececec";
                }}
              >
                <div style={featuredCardTopStyle}>
                  <span style={featuredDotStyle} />
                  <span style={featuredLabelStyle}>Kategori</span>
                </div>

                <div style={featuredTitleStyle}>{category.title}</div>

                <div style={featuredActionStyle}>Öppna →</div>
              </button>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionEyebrowStyle}>Alla kategorier</div>
            <h2 style={sectionTitleStyle}>Välj kategori</h2>
            <p style={sectionTextStyle}>
              Här ser du hela utbudet. Vissa kategorier kan vara under uppbyggnad.
            </p>
          </div>

          <div style={categoriesGridStyle}>
            {MENU_CATEGORIES.map((category) => {
              const isImplemented = category.isImplemented;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => openCategory(category)}
                  style={{
                    ...categoryCardStyle,
                    ...(isImplemented ? {} : categoryCardMutedStyle),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0,0,0,0.07)";
                    e.currentTarget.style.borderColor = "#e2e8e3";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = "#ececec";
                  }}
                >
                  <span
                    style={{
                      ...categoryDotStyle,
                      ...(isImplemented ? {} : categoryDotMutedStyle),
                    }}
                  />
                  <span
                    style={{
                      ...categoryTitleStyle,
                      ...(isImplemented ? {} : categoryTitleMutedStyle),
                    }}
                  >
                    {category.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

const pageStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  paddingBottom: 40,
};

const toastStyle = {
  marginBottom: 16,
  background: "#eef8f1",
  border: "1px solid #d7eddd",
  color: "#1b5e20",
  borderRadius: 14,
  padding: "14px 18px",
  fontWeight: 600,
};

const heroSectionStyle = {
  position: "relative",
  minHeight: 430,
  borderRadius: 28,
  overflow: "hidden",
  marginBottom: 34,
  backgroundImage: `
    linear-gradient(
      rgba(20, 25, 30, 0.55),
      rgba(20, 25, 30, 0.65)
    ),
    url("/landing-background.jpg")
  `,
  backgroundSize: "cover",
  backgroundPosition: "center 20%",
  boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
};

const heroOverlayStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "stretch",
};

const heroContentStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: 34,
};

const heroGlassCardStyle = {
  position: "relative",
  overflow: "hidden",
  maxWidth: 680,
  width: "100%",

  // 🔥 Glasbas
  background: "rgba(255,255,255,0.12)",

  // 🔥 BLUR (det viktigaste)
  backdropFilter: "blur(26px) saturate(180%)",
  WebkitBackdropFilter: "blur(26px) saturate(180%)",

  borderRadius: 26,
  padding: "36px 40px",

  // 🔥 Glas-kant
  border: "1px solid rgba(255,255,255,0.25)",

  // 🔥 Depth + glow
  boxShadow: `
    0 12px 40px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.25),
    inset 0 -1px 0 rgba(255,255,255,0.08)
  `,
};

const heroLogoStyle = {
  position: "absolute",
  bottom: 16,
  right: 20,
  height: 36,
  objectFit: "contain",
  opacity: 0.85,
};

const glassHighlightStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "50%",
  background: `
    linear-gradient(
      180deg,
      rgba(255,255,255,0.35),
      rgba(255,255,255,0.05),
      rgba(255,255,255,0)
    )
  `,
  pointerEvents: "none",
};

const heroEyebrowStyle = {
  position: "relative",
  zIndex: 1,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#5f6368",
  marginBottom: 12,
};

const heroTitleStyle = {
  position: "relative",
  zIndex: 1,
  margin: 0,
  fontSize: 56,
  lineHeight: 1.02,
  letterSpacing: "-0.03em",
  color: "#111111",
  textShadow: "0 1px 0 rgba(255,255,255,0.65)",
};

const heroTextStyle = {
  position: "relative",
  zIndex: 1,
  margin: "18px 0 0",
  fontSize: 20,
  lineHeight: 1.6,
  color: "#2f3a45",
  maxWidth: 580,
};

const sectionStyle = {
  marginBottom: 34,
};

const sectionHeaderStyle = {
  marginBottom: 16,
};

const sectionEyebrowStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b7280",
  marginBottom: 8,
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: 30,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
};

const sectionTextStyle = {
  margin: "8px 0 0",
  fontSize: 16,
  color: "#5f6368",
  lineHeight: 1.6,
};

const featuredGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 20,
};

const featuredCardStyle = {
  width: "100%",
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 22,
  padding: 24,
  textAlign: "left",
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  transition:
    "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
};

const featuredCardTopStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 18,
};

const featuredDotStyle = {
  width: 9,
  height: 9,
  borderRadius: 999,
  background: "#009846",
  boxShadow: "0 0 0 5px rgba(0,152,70,0.10)",
};

const featuredLabelStyle = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "#6b7280",
};

const featuredTitleStyle = {
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: "#111111",
};

const featuredActionStyle = {
  marginTop: 18,
  fontSize: 15,
  fontWeight: 700,
  color: "#009846",
};

const categoriesGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const categoryCardStyle = {
  width: "100%",
  border: "1px solid #ececec",
  borderRadius: 18,
  background: "white",
  padding: 18,
  textAlign: "left",
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
  transition:
    "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const categoryCardMutedStyle = {
  opacity: 0.72,
};

const categoryDotStyle = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: "#d1d5db",
  flexShrink: 0,
};

const categoryDotMutedStyle = {
  background: "#d8dde3",
};

const categoryTitleStyle = {
  fontSize: 16,
  fontWeight: 600,
  color: "#111827",
  lineHeight: 1.35,
};

const categoryTitleMutedStyle = {
  fontWeight: 500,
  color: "#6b7280",
};