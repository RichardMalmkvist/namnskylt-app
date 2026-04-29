function getCardTitle(badge) {
  if (badge?.articleNumber) {
    return `Art.nr ${badge.articleNumber}`;
  }

  return badge?.name || "Produkt";
}

function getDescriptionParts(badge) {
  const rawDesc = String(badge?.desc || "").trim();
  const explicitFormat = String(badge?.format || "").trim();

  if (!rawDesc && !explicitFormat) {
    return {
      description: "-",
      format: "",
    };
  }

  if (explicitFormat) {
    return {
      description: rawDesc || "-",
      format: explicitFormat,
    };
  }

  const formatMatch = rawDesc.match(/^(.*?)(?:\.?\s+)?Format\s+(.+)$/i);

  if (formatMatch) {
    return {
      description: formatMatch[1].trim().replace(/[.,]\s*$/, "") || "-",
      format: formatMatch[2].trim(),
    };
  }

  return {
    description: rawDesc || "-",
    format: "",
  };
}

export default function BadgeCard({
  badge,
  ctaLabel,
  onAction,
}) {
  if (!badge) return null;

  const title = getCardTitle(badge);
  const { description, format } = getDescriptionParts(badge);

  const resolvedCtaLabel = ctaLabel
    || (badge?.directAddToCart ? "Lägg i kundkorg" : "Välj produkt");

  function handleAction() {
    if (!onAction) return;

    if (badge?.directAddToCart) {
      onAction(badge, { quantity: 1 });
      return;
    }

    onAction(badge);
  }

  return (
    <div
      style={cardStyle}
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
      <div style={mediaAreaStyle}>
        <div style={mediaStageStyle}>
          {badge?.image ? (
            <img
              src={badge.image}
              alt={badge.name || title}
              style={imageStyle}
            />
          ) : (
            <div style={imageFallbackStyle}>Ingen bild</div>
          )}
        </div>

        <div style={mediaShadowStyle} />
      </div>

      <div style={contentStyle}>
        <div>
          <div style={titleStyle}>{title}</div>

          <div style={descWrapStyle}>
            <div style={descStyle}>{description}</div>

            {badge?.extraLine ? (
              <div style={extraLineStyle}>{badge.extraLine}</div>
            ) : null}

            {format ? (
              <div style={formatStyle}>Format {format}</div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAction}
          style={ctaStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          {resolvedCtaLabel}
          <span style={arrowStyle}>→</span>
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 22,
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
  transition:
    "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
  display: "flex",
  flexDirection: "column",
  minHeight: "100%",
};

const mediaAreaStyle = {
  position: "relative",
  height: 250,
  padding: "18px 16px 6px",
  background: "#f6f7f8",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const mediaStageStyle = {
  width: "100%",
  height: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 2,
};

const imageStyle = {
  maxWidth: "100%",
  maxHeight: 170,
  objectFit: "contain",
  display: "block",
  filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.08))",
};

const imageFallbackStyle = {
  color: "#6b7280",
  fontSize: 14,
};

const mediaShadowStyle = {
  width: "55%",
  height: 14,
  marginTop: 6,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.10)",
  filter: "blur(10px)",
};

const contentStyle = {
  padding: 18,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 16,
  flex: 1,
};

const titleStyle = {
  fontWeight: 700,
  fontSize: 18,
  lineHeight: 1.3,
  marginBottom: 8,
  color: "#111111",
};

const descWrapStyle = {
  display: "grid",
  gap: 4,
};

const descStyle = {
  color: "#5f6368",
  lineHeight: 1.55,
  fontSize: 14,
};

const extraLineStyle = {
  color: "#374151",
  lineHeight: 1.5,
  fontSize: 14,
};

const formatStyle = {
  color: "#6b7280",
  lineHeight: 1.45,
  fontSize: 13,
};

const ctaStyle = {
  marginTop: 2,
  fontSize: 14,
  fontWeight: 700,
  color: "#009846",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  width: "fit-content",
  padding: 0,
  transition: "transform 0.18s ease",
};

const arrowStyle = {
  fontSize: 18,
  lineHeight: 1,
};