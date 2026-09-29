export default function PaymentCompletePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div>
        <h1>Thank You for Your Donation</h1>

        <p style={{ marginTop: 16 }}>
          Your payment has been received. Thank you for
          supporting Youth Day.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: 24,
            padding: "12px 20px",
            borderRadius: 6,
            background: "var(--navy)",
            color: "white",
            textDecoration: "none",
          }}
        >
          Return to Home
        </a>
      </div>
    </main>
  );
}

