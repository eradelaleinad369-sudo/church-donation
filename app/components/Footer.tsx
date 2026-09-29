export default function Footer() {
  return (
    <footer className="f2" id="footer">
      <div className="top">
        <div className="brand2">
          <span className="mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F2A4A" strokeWidth={2}>
              <path d="M12 2v20M4 8h16" />
            </svg>
          </span>
          <b>Apostolic Faith Church<br />Mafoluku Branch</b>
        </div>
        <p className="tag">&ldquo;Two days set apart to seek Him — together.&rdquo;</p>
        <div className="soc" aria-label="Social links">
          <a href="#" aria-label="Facebook">
            <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1z" /></svg>
          </a>
          <a href="https://www.instagram.com/afmmafoluku?stkn=MTlieXF4aHFtbmF2cQ==" aria-label="Instagram">
            <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth={1.7} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth={1.7} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l6 3-6 3V9z" fill="#fff" stroke="none" /></svg>
          </a>
        </div>
      </div>
      <div className="bottom">
        <div className="wrap">
          <span>© 2026 Apostolic Faith Church, Mafoluku. All rights reserved.</span>
          <span><a href="#top">Home</a><a href="#about">About</a><a href="#program">Program</a><a href="#donate">Donate</a></span>
        </div>
      </div>
    </footer>
  );
}
