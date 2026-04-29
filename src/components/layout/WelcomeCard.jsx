export default function WelcomeCard() {
  return (
    <div
      style={{
        position: "relative",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 18,
          lineHeight: 1.5,
        }}
      >
        Välkommen, här kan du beställa skyltar till Region Jönköpings län, RJL
      </div>

      <img
        src="/logoRJL.jpg"
        alt="Region Jönköpings län"
        style={{
          position: "absolute",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          height: 42,
          objectFit: "contain",
        }}
      />
    </div>
  );
}