import { MENU_CATEGORIES } from "../../data/categories";

export default function CategorySideMenu({
  activeCategoryId,
  onSelectCategory,
}) {
  return (
    <aside style={asideStyle}>
      <div style={panelStyle}>
        <div style={sectionStyle}>
          <div style={sectionLabelStyle}>Kategorier</div>

          <div style={listStyle}>
            {MENU_CATEGORIES.map((category) => {
              const isActive = activeCategoryId === category.id;
              const isImplemented = category.isImplemented;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectCategory(category)}
                  style={{
                    ...itemStyle,
                    ...(!isImplemented ? unimplementedItemStyle : {}),
                    ...(isActive ? activeItemStyle : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = isImplemented
                        ? "#f7f8f9"
                        : "#f8f8f8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span
                    style={{
                      ...itemIndicatorStyle,
                      ...(isImplemented
                        ? implementedIndicatorStyle
                        : unimplementedIndicatorStyle),
                      ...(isActive ? activeItemIndicatorStyle : {}),
                    }}
                  />

                  <span
                    style={{
                      ...itemTextStyle,
                      ...(!isImplemented ? unimplementedItemTextStyle : {}),
                    }}
                  >
                    {category.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

const asideStyle = {
  position: "sticky",
  top: 24,
};

const panelStyle = {
  background: "white",
  border: "1px solid #ececec",
  borderRadius: 22,
  padding: 18,
  boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
};

const sectionStyle = {
  display: "grid",
  gap: 12,
};

const sectionLabelStyle = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#6b7280",
  padding: "4px 8px 0",
};

const listStyle = {
  display: "grid",
  gap: 4,
};

const itemStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 14px",
  border: "none",
  borderRadius: 14,
  background: "transparent",
  textAlign: "left",
  cursor: "pointer",
  transition: "background 0.15s ease, transform 0.15s ease",
};

const activeItemStyle = {
  background: "#eef8f1",
};

const itemIndicatorStyle = {
  width: 8,
  height: 8,
  borderRadius: 999,
  flexShrink: 0,
};

const implementedIndicatorStyle = {
  background: "#d1d5db",
};

const unimplementedIndicatorStyle = {
  background: "#e5e7eb",
};

const activeItemIndicatorStyle = {
  background: "#009846",
  boxShadow: "0 0 0 4px rgba(0,152,70,0.12)",
};

const itemTextStyle = {
  fontSize: 15,
  fontWeight: 600,
  lineHeight: 1.35,
  color: "#111827",
};

const unimplementedItemStyle = {
  opacity: 0.68,
};

const unimplementedItemTextStyle = {
  fontWeight: 500,
  color: "#6b7280",
};