export default function InfoBar() {
  return (
    <section className="info-bar">
      <div className="wrap">
        <div className="item">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <rect x="2" y="3.5" width="16" height="14" rx="2" /><path d="M2 8h16M6 2v3M14 2v3" />
          </svg>
          <div><span className="lbl">Date</span><strong>24 – 25 Oct 2026</strong><span style={{ fontSize: ".85rem", color: "var(--muted)" }}>Sat – Sun</span></div>
        </div>
        <div className="item">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path d="M10 18s6-6.5 6-10.5A6 6 0 0 0 4 7.5C4 11.5 10 18 10 18z" /><circle cx="10" cy="7.5" r="2" />
          </svg>
          <div><span className="lbl">Location</span><strong>1A Amusa Street, Mafoluku</strong><span style={{ fontSize: ".85rem", color: "var(--muted)" }}>Oshodi, Lagos</span></div>
        </div>
        <div className="item">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path d="M10 3l1.8 4.3L16 8l-4.2.7L10 13l-1.8-4.3L4 8l4.2-.7z" />
          </svg>
          <div><span className="lbl">Who's welcome</span><strong>Members, guests &amp; visitors</strong><span style={{ fontSize: ".85rem", color: "var(--muted)" }}>Everyone is invited</span></div>
        </div>
      </div>
    </section>
  );
}
