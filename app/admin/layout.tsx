import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/adminSession";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // /admin/login itself renders through this layout too, so only gate the rest.
  const session = await getSession();

  return (
    <div style={{ fontFamily: "system-ui", minHeight: "100vh", background: "#f5f5f3" }}>
      {session && (
        <nav style={{ background: "#0F2A4A", color: "#fff", padding: "14px 20px", display: "flex", gap: 18, alignItems: "center" }}>
          <b>Youth Day Admin</b>
          <Link href="/admin" style={{ color: "#fff" }}>Overview</Link>
          <Link href="/admin/schedule" style={{ color: "#fff" }}>Schedule</Link>
          <Link href="/admin/meetings" style={{ color: "#fff" }}>Meetings</Link>
          <Link href="/admin/past-events" style={{ color: "#fff" }}>Past Events</Link>
          <Link href="/admin/gallery" style={{ color: "#fff" }}>Gallery</Link>
          <Link href="/admin/media" style={{ color: "#fff" }}>Site Images</Link>
          <Link href="/admin/donations" style={{ color: "#fff" }}>Donations</Link>
          <Link href="/admin/settings" style={{ color: "#fff" }}>Settings</Link>
          <form action="/api/admin/logout" method="post" style={{ marginLeft: "auto" }}>
            <button formAction="/api/admin/logout">Sign out</button>
          </form>
        </nav>
      )}
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}
