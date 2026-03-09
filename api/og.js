export default function handler(req, res) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d1d1f"/>
      <stop offset="100%" stop-color="#2c2c2e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#007AFF"/>
      <stop offset="100%" stop-color="#5856D6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)"/>
  <g opacity="0.04">
    <line x1="200" y1="0" x2="200" y2="630" stroke="white" stroke-width="1"/>
    <line x1="400" y1="0" x2="400" y2="630" stroke="white" stroke-width="1"/>
    <line x1="600" y1="0" x2="600" y2="630" stroke="white" stroke-width="1"/>
    <line x1="800" y1="0" x2="800" y2="630" stroke="white" stroke-width="1"/>
    <line x1="1000" y1="0" x2="1000" y2="630" stroke="white" stroke-width="1"/>
    <line x1="0" y1="126" x2="1200" y2="126" stroke="white" stroke-width="1"/>
    <line x1="0" y1="252" x2="1200" y2="252" stroke="white" stroke-width="1"/>
    <line x1="0" y1="378" x2="1200" y2="378" stroke="white" stroke-width="1"/>
    <line x1="0" y1="504" x2="1200" y2="504" stroke="white" stroke-width="1"/>
  </g>
  <rect x="80" y="200" width="64" height="64" rx="16" fill="url(#accent)"/>
  <text x="112" y="243" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="32" font-weight="700" fill="white">B</text>
  <text x="168" y="228" font-family="system-ui,-apple-system,sans-serif" font-size="54" font-weight="700" fill="white" letter-spacing="-2">Web Project Brief</text>
  <text x="170" y="262" font-family="system-ui,-apple-system,sans-serif" font-size="21" fill="#8e8e93">Tell us about your vision. We'll build it.</text>
  <g transform="translate(80,320)">
    <rect width="230" height="110" rx="14" fill="#2c2c2e" stroke="#3a3a3c" stroke-width="1"/>
    <circle cx="24" cy="24" r="5" fill="#007AFF"/><text x="38" y="28" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#6e6e73">GOALS</text>
    <rect x="18" y="44" width="140" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="59" width="100" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="74" width="170" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="89" width="80" height="7" rx="3.5" fill="#3a3a3c"/>
  </g>
  <g transform="translate(330,320)">
    <rect width="230" height="110" rx="14" fill="#2c2c2e" stroke="#3a3a3c" stroke-width="1"/>
    <circle cx="24" cy="24" r="5" fill="#AF52DE"/><text x="38" y="28" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#6e6e73">AUDIENCE</text>
    <rect x="18" y="44" width="160" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="59" width="110" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="74" width="140" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="89" width="90" height="7" rx="3.5" fill="#3a3a3c"/>
  </g>
  <g transform="translate(580,320)">
    <rect width="230" height="110" rx="14" fill="#2c2c2e" stroke="#3a3a3c" stroke-width="1"/>
    <circle cx="24" cy="24" r="5" fill="#FF2D55"/><text x="38" y="28" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#6e6e73">IDENTITY</text>
    <rect x="18" y="44" width="120" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="59" width="170" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="74" width="90" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="89" width="140" height="7" rx="3.5" fill="#3a3a3c"/>
  </g>
  <g transform="translate(830,320)">
    <rect width="230" height="110" rx="14" fill="#2c2c2e" stroke="#3a3a3c" stroke-width="1"/>
    <circle cx="24" cy="24" r="5" fill="#34C759"/><text x="38" y="28" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#6e6e73">DESIGN</text>
    <rect x="18" y="44" width="150" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="59" width="100" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="74" width="180" height="7" rx="3.5" fill="#3a3a3c"/>
    <rect x="18" y="89" width="110" height="7" rx="3.5" fill="#3a3a3c"/>
  </g>
  <rect x="0" y="626" width="1200" height="4" fill="url(#accent)"/>
  <text x="1120" y="590" text-anchor="end" font-family="system-ui,sans-serif" font-size="14" font-weight="500" fill="#3a3a3c">formulario-webs.vercel.app</text>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.status(200).send(svg);
}
