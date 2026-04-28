import AppHeader from "../components/layout/AppHeader";
import Field from "../components/forms/Field";
import PageContainer from "../components/layout/PageContainer";

export default function AdminLoginPage({
  getHeaderProps,
  goBackToLanding,
  backButtonStyle,
  cardStyle,
  adminPassword,
  setAdminPassword,
  inputStyle,
  adminError,
  handleAdminLogin,
  primaryButtonStyle,
}) {
  return (
    <PageContainer>
      <AppHeader {...getHeaderProps({ showLoginButton: false })} />

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <button type="button" onClick={goBackToLanding} style={backButtonStyle}>
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