export default function PaymentCompletePage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 560,
          textAlign: "center",
        }}
      >
        <h1>
          Thank You for Your Donation
        </h1>

        <p
          style={{
            marginTop: 12,
            lineHeight: 1.6,
          }}
        >
          Your payment has been received.
          Thank you for supporting Youth Day.
        </p>

        <p
          style={{
            marginTop: 12,
            color: "var(--muted)",
            lineHeight: 1.6,
          }}
        >
          Your donation will be confirmed
          automatically. You can safely return
          to the main website.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: 24,
            padding: "12px 20px",
            borderRadius: 6,
            background: "var(--navy)",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Return to Website
        </a>
      </div>
    </main>
  );
}
