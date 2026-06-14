const DarkStyle: string = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  body {
    background: #07070f;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 0;
    color: #e2e8f0;
    -webkit-font-smoothing: antialiased;
  }

  .container {
    max-width: 620px;
    margin: 40px auto;
    background: #0f0f1c;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(124, 58, 237, 0.2);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.03),
      0 24px 64px rgba(0,0,0,0.7),
      0 0 80px rgba(124,58,237,0.08);
    animation: fadeUp 0.5s ease-out;
  }

  /* ── Header ───────────────────────────────────── */
  .header {
    background: linear-gradient(135deg, #1e0a3c 0%, #0f0f1c 60%, #0a0a18 100%);
    padding: 36px 30px 28px;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid rgba(124,58,237,0.25);
  }

  /* Film grain texture overlay */
  .header::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.35) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Decorative film strip dots */
  .header::after {
    content: "● ● ● ● ● ● ● ● ● ● ● ● ● ● ●";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 6px;
    letter-spacing: 6px;
    color: rgba(124,58,237,0.4);
    padding: 5px 0;
    text-align: center;
  }

  .header.error {
    background: linear-gradient(135deg, #2d0a0a 0%, #0f0f1c 60%, #0a0a18 100%);
    border-bottom-color: rgba(239,68,68,0.3);
  }
  .header.error::before {
    background-image: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(239,68,68,0.3) 0%, transparent 70%);
  }

  .header.warning {
    background: linear-gradient(135deg, #2d1a0a 0%, #0f0f1c 60%, #0a0a18 100%);
    border-bottom-color: rgba(245,158,11,0.3);
  }
  .header.warning::before {
    background-image: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245,158,11,0.25) 0%, transparent 70%);
  }

  .header img {
    width: 130px;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 4px 20px rgba(124,58,237,0.4));
  }

  .header-text {
    position: relative;
    z-index: 1;
    margin-top: 14px;
  }

  .header h1, .header h2 {
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.3px;
  }

  .header p {
    margin: 0;
    font-size: 13px;
    color: rgba(203,213,225,0.7);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(124,58,237,0.2);
    border: 1px solid rgba(124,58,237,0.4);
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 600;
    color: #a78bfa;
    margin-top: 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* ── Content ──────────────────────────────────── */
  .content {
    padding: 32px 30px;
    font-size: 15px;
    line-height: 1.7;
    color: #cbd5e1;
  }

  .content h1 {
    font-size: 24px;
    font-weight: 800;
    color: #f1f5f9;
    margin: 0 0 12px;
    letter-spacing: -0.4px;
  }

  .content p { margin: 10px 0; }

  h3 {
    margin-top: 24px;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #7c3aed;
  }

  code {
    background: rgba(124,58,237,0.12);
    border: 1px solid rgba(124,58,237,0.2);
    color: #a78bfa;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 13px;
    font-family: 'Courier New', monospace;
  }

  a { color: #8b5cf6; text-decoration: none; }
  a:hover { text-decoration: underline; }

  ul { list-style: none; padding-left: 0; margin: 0; }

  /* ── Info box ─────────────────────────────────── */
  .info {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 20px;
    margin: 20px 0;
  }

  .info p { margin: 10px 0; font-size: 14px; }

  .info strong {
    color: #a78bfa;
    display: inline-block;
    min-width: 130px;
  }

  /* ── OTP box ──────────────────────────────────── */
  .otp-wrapper {
    text-align: center;
    margin: 28px 0;
  }

  .otp {
    display: inline-block;
    font-size: 36px;
    font-weight: 800;
    letter-spacing: 10px;
    color: #f1f5f9;
    background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(109,40,217,0.1));
    border: 2px solid rgba(124,58,237,0.5);
    padding: 18px 30px;
    border-radius: 16px;
    box-shadow:
      0 0 0 4px rgba(124,58,237,0.1),
      inset 0 1px 0 rgba(255,255,255,0.05);
    animation: pulse 2s infinite;
    font-family: 'Courier New', monospace;
  }

  .otp-note {
    font-size: 12px;
    color: #64748b;
    margin-top: 10px;
  }

  /* ── Stat grid ────────────────────────────────── */
  .stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 20px 0;
  }

  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 14px 16px;
  }

  .stat-card .stat-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #475569;
    margin-bottom: 4px;
  }

  .stat-card .stat-value {
    font-size: 14px;
    font-weight: 700;
    color: #e2e8f0;
  }

  /* ── Button ───────────────────────────────────── */
  .btn-wrap { text-align: center; margin-top: 28px; }

  .button {
    display: inline-block;
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
    color: #fff !important;
    text-decoration: none !important;
    padding: 14px 36px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.2px;
    box-shadow: 0 4px 20px rgba(124,58,237,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(124,58,237,0.55);
    text-decoration: none !important;
  }

  .button.error {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    box-shadow: 0 4px 20px rgba(220,38,38,0.35);
  }

  .button.warning {
    background: linear-gradient(135deg, #d97706, #b45309);
    box-shadow: 0 4px 20px rgba(217,119,6,0.35);
  }

  /* ── Endpoint cards ───────────────────────────── */
  .endpoint-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-left: 3px solid #7c3aed;
    border-radius: 10px;
    padding: 12px 16px;
    margin: 8px 0;
    transition: background 0.2s;
  }

  .endpoint-card:hover { background: rgba(124,58,237,0.07); }

  /* ── Status indicators ────────────────────────── */
  .status-ok    { color: #34d399; font-weight: 700; }
  .status-error { color: #f87171; font-weight: 700; }
  .status-warn  { color: #fbbf24; font-weight: 700; }

  /* ── Divider ──────────────────────────────────── */
  .divider-line {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.06);
    margin: 24px 0;
  }

  /* ── Warning box ──────────────────────────────── */
  .alert-box {
    background: rgba(251,191,36,0.07);
    border: 1px solid rgba(251,191,36,0.2);
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 13px;
    color: #fde68a;
    margin: 20px 0;
  }

  /* ── Footer ───────────────────────────────────── */
  .footer {
    text-align: center;
    font-size: 12px;
    color: #475569;
    padding: 24px 20px 28px;
    background: rgba(255,255,255,0.015);
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .footer-logo {
    width: 72px;
    height: auto;
    opacity: 0.6;
    margin-bottom: 12px;
    filter: grayscale(30%);
  }

  .footer-copy { margin: 6px 0 10px; color: #334155; }
  .footer-copy strong { color: #64748b; }

  .footer-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .footer-links a { color: #475569; transition: color 0.2s; }
  .footer-links a:hover { color: #a78bfa; text-decoration: none; }
  .footer-dot { color: #1e293b; }

  /* ── Animations ───────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 4px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.05); }
    50%       { box-shadow: 0 0 0 8px rgba(124,58,237,0.18), inset 0 1px 0 rgba(255,255,255,0.05); }
  }

  /* ── Responsive ───────────────────────────────── */
  @media (max-width: 640px) {
    .container { margin: 12px; border-radius: 16px; }
    .header { padding: 28px 20px 22px; }
    .header img { width: 110px; }
    .header h1, .header h2 { font-size: 18px; }
    .content { padding: 24px 20px; font-size: 14px; }
    .content h1 { font-size: 20px; }
    .stat-grid { grid-template-columns: 1fr; }
    .otp { font-size: 28px; letter-spacing: 7px; padding: 14px 22px; }
    .button { display: block; text-align: center; padding: 14px 20px; }
    .footer { padding: 18px 16px 22px; }
    .footer-links { flex-direction: column; gap: 6px; }
    .footer-dot { display: none; }
  }

  @media (max-width: 380px) {
    .otp { font-size: 22px; letter-spacing: 5px; }
    .header h1, .header h2 { font-size: 16px; }
  }
`;
const LightStyle: string = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  body {
    background: #f8fafc;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 0;
    color: #1e293b;
    -webkit-font-smoothing: antialiased;
  }

  .container {
    max-width: 620px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    box-shadow:
      0 0 0 1px rgba(0,0,0,0.02),
      0 24px 64px rgba(0,0,0,0.08),
      0 0 80px rgba(124,58,237,0.06);
    animation: fadeUp 0.5s ease-out;
  }

  /* ── Header ───────────────────────────────────── */
  .header {
    background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 60%, #faf5ff 100%);
    padding: 36px 30px 28px;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid #e9d5ff;
  }

  /* Soft gradient overlay */
  .header::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Decorative film strip dots - lighter version */
  .header::after {
    content: "● ● ● ● ● ● ● ● ● ● ● ● ● ● ●";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 6px;
    letter-spacing: 6px;
    color: rgba(124,58,237,0.25);
    padding: 5px 0;
    text-align: center;
  }

  .header.error {
    background: linear-gradient(135deg, #fef2f2 0%, #ffffff 60%, #fef2f2 100%);
    border-bottom-color: #fecaca;
  }
  .header.error::before {
    background-image: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(239,68,68,0.06) 0%, transparent 70%);
  }

  .header.warning {
    background: linear-gradient(135deg, #fffbeb 0%, #ffffff 60%, #fffbeb 100%);
    border-bottom-color: #fde68a;
  }
  .header.warning::before {
    background-image: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245,158,11,0.06) 0%, transparent 70%);
  }

  .header img {
    width: 130px;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 4px 12px rgba(124,58,237,0.15));
  }

  .header-text {
    position: relative;
    z-index: 1;
    margin-top: 14px;
  }

  .header h1, .header h2 {
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 800;
    color: #1e1b4b;
    letter-spacing: -0.3px;
  }

  .header p {
    margin: 0;
    font-size: 13px;
    color: #64748b;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(124,58,237,0.1);
    border: 1px solid rgba(124,58,237,0.25);
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 600;
    color: #6d28d9;
    margin-top: 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* ── Content ──────────────────────────────────── */
  .content {
    padding: 32px 30px;
    font-size: 15px;
    line-height: 1.7;
    color: #334155;
  }

  .content h1 {
    font-size: 24px;
    font-weight: 800;
    color: #1e1b4b;
    margin: 0 0 12px;
    letter-spacing: -0.4px;
  }

  .content p { margin: 10px 0; }

  h3 {
    margin-top: 24px;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #6d28d9;
  }

  code {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #6d28d9;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 13px;
    font-family: 'Courier New', monospace;
  }

  a { color: #7c3aed; text-decoration: none; }
  a:hover { text-decoration: underline; }

  ul { list-style: none; padding-left: 0; margin: 0; }

  /* ── Info box ─────────────────────────────────── */
  .info {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 20px;
    margin: 20px 0;
  }

  .info p { margin: 10px 0; font-size: 14px; }

  .info strong {
    color: #6d28d9;
    display: inline-block;
    min-width: 130px;
  }

  /* ── OTP box ──────────────────────────────────── */
  .otp-wrapper {
    text-align: center;
    margin: 28px 0;
  }

  .otp {
    display: inline-block;
    font-size: 36px;
    font-weight: 800;
    letter-spacing: 10px;
    color: #1e1b4b;
    background: linear-gradient(135deg, #f5f3ff, #faf5ff);
    border: 2px solid #c4b5fd;
    padding: 18px 30px;
    border-radius: 16px;
    box-shadow:
      0 0 0 4px rgba(124,58,237,0.05),
      inset 0 1px 0 rgba(255,255,255,0.8);
    animation: pulse 2s infinite;
    font-family: 'Courier New', monospace;
  }

  .otp-note {
    font-size: 12px;
    color: #64748b;
    margin-top: 10px;
  }

  /* ── Stat grid ────────────────────────────────── */
  .stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 20px 0;
  }

  .stat-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
  }

  .stat-card .stat-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #64748b;
    margin-bottom: 4px;
  }

  .stat-card .stat-value {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }

  /* ── Button ───────────────────────────────────── */
  .btn-wrap { text-align: center; margin-top: 28px; }

  .button {
    display: inline-block;
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
    color: #fff !important;
    text-decoration: none !important;
    padding: 14px 36px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.2px;
    box-shadow: 0 4px 12px rgba(124,58,237,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(124,58,237,0.35);
    text-decoration: none !important;
  }

  .button.error {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 4px 12px rgba(239,68,68,0.25);
  }

  .button.warning {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }

  /* ── Endpoint cards ───────────────────────────── */
  .endpoint-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid #7c3aed;
    border-radius: 10px;
    padding: 12px 16px;
    margin: 8px 0;
    transition: background 0.2s;
  }

  .endpoint-card:hover { background: #f1f5f9; }

  /* ── Status indicators ────────────────────────── */
  .status-ok    { color: #10b981; font-weight: 700; }
  .status-error { color: #ef4444; font-weight: 700; }
  .status-warn  { color: #f59e0b; font-weight: 700; }

  /* ── Divider ──────────────────────────────────── */
  .divider-line {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 24px 0;
  }

  /* ── Warning box ──────────────────────────────── */
  .alert-box {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 13px;
    color: #92400e;
    margin: 20px 0;
  }

  /* ── Footer ───────────────────────────────────── */
  .footer {
    text-align: center;
    font-size: 12px;
    color: #64748b;
    padding: 24px 20px 28px;
    background: #faf9fe;
    border-top: 1px solid #e2e8f0;
  }

  .footer-logo {
    width: 72px;
    height: auto;
    opacity: 0.5;
    margin-bottom: 12px;
    filter: grayscale(20%);
  }

  .footer-copy { margin: 6px 0 10px; color: #94a3b8; }
  .footer-copy strong { color: #64748b; }

  .footer-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .footer-links a { color: #64748b; transition: color 0.2s; }
  .footer-links a:hover { color: #7c3aed; text-decoration: none; }
  .footer-dot { color: #cbd5e1; }

  /* ── Animations ───────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 4px rgba(124,58,237,0.05), inset 0 1px 0 rgba(255,255,255,0.8); }
    50%       { box-shadow: 0 0 0 8px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.8); }
  }

  /* ── Responsive ───────────────────────────────── */
  @media (max-width: 640px) {
    .container { margin: 12px; border-radius: 16px; }
    .header { padding: 28px 20px 22px; }
    .header img { width: 110px; }
    .header h1, .header h2 { font-size: 18px; }
    .content { padding: 24px 20px; font-size: 14px; }
    .content h1 { font-size: 20px; }
    .stat-grid { grid-template-columns: 1fr; }
    .otp { font-size: 28px; letter-spacing: 7px; padding: 14px 22px; }
    .button { display: block; text-align: center; padding: 14px 20px; }
    .footer { padding: 18px 16px 22px; }
    .footer-links { flex-direction: column; gap: 6px; }
    .footer-dot { display: none; }
  }

  @media (max-width: 380px) {
    .otp { font-size: 22px; letter-spacing: 5px; }
    .header h1, .header h2 { font-size: 16px; }
  }
`;


export { DarkStyle as style , LightStyle};