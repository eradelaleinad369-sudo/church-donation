"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DonationsPage() {
  const donations = useQuery(api.donations.listForAdmin) ?? [];
  return (
    <div>
      <h1>Donations</h1>
      <table cellPadding={8} style={{ width: "100%", background: "#fff", borderCollapse: "collapse", marginTop: 12 }}>
        <thead><tr><th align="left">Reference</th><th align="left">Amount</th><th align="left">Donor</th><th align="left">Status</th></tr></thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d._id} style={{ borderTop: "1px solid #eee" }}>
              <td>{d.reference}</td>
              <td>{d.currency === "NGN" ? "₦" : "$"}{d.amount.toLocaleString()}</td>
              <td>{d.donorName || "—"} ({d.donorEmail})</td>
              <td style={{ color: d.status === "paid" ? "green" : d.status === "failed" ? "crimson" : "#888" }}>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
