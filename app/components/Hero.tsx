import Countdown from "./Countdown";

export default function Hero({ eventStart }: { eventStart: string }) {
  return (
    <section className="hero2" id="top">
      <svg className="art" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="500" height="600" fill="#0c2140" />
        <circle cx="380" cy="150" r="120" fill="#1b3f68" opacity=".6" />
        <rect x="200" y="120" width="26" height="300" fill="#13294a" />
        <rect x="120" y="220" width="180" height="26" fill="#13294a" />
      </svg>
      <div className="wrap">
        <p className="eyebrow" style={{ color: "var(--gold)" }}>Youth Day 2026</p>
        <h1>A Life Of<br />True Worship</h1>
        <p className="lead2">
          Two days of charity, worship and fellowship for the youth — 24 and 25 October 2026 at
          1A Amusa Street, Mafoluku-Oshodi, Lagos. Members, guests and visitors are all welcome.
        </p>
        <Countdown eventStart={eventStart} />
        <div className="row">
          <a className="btn" href="#donate">Donate Now →</a>
          <a className="btn ghost" href="#program">See the Program</a>
        </div>
      </div>
    </section>
  );
}
