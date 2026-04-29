export default function Field({ label, htmlFor, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={htmlFor}>{label}:</label>
      <br />
      {children}
    </div>
  );
}