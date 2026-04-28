import TopBar from "./TopBar";

export default function AppHeader({
  cartCount,
  onCartClick,
  onLoginClick,
  onLogoClick,
  showCartButton = true,
  showLoginButton = true,
}) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#f7f7f7",
        borderBottom: "1px solid #ddd",
        marginBottom: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "12px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <TopBar
            cartCount={cartCount}
            onCartClick={showCartButton ? onCartClick : undefined}
            onLoginClick={showLoginButton ? onLoginClick : undefined}
            onLogoClick={onLogoClick}
          />
        </div>
      </div>
    </div>
  );
}