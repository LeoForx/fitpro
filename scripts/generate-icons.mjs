import sharp from "../node_modules/sharp/lib/index.js";

const sizes = [192, 512];

const svgIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <!-- Fundo preto -->
  <rect width="512" height="512" rx="112" fill="#000000"/>

  <!-- Círculo de destaque verde sutil -->
  <circle cx="256" cy="256" r="200" fill="none" stroke="#2ffe1d" stroke-width="6" opacity="0.15"/>

  <!-- Dumbbell: peso esquerdo -->
  <rect x="72" y="176" width="64" height="160" rx="16" fill="#2ffe1d"/>
  <!-- Brilho no peso esquerdo -->
  <rect x="80" y="184" width="18" height="144" rx="9" fill="white" opacity="0.14"/>

  <!-- Braço esquerdo -->
  <rect x="136" y="228" width="56" height="56" rx="12" fill="#2ffe1d"/>

  <!-- Barra central -->
  <rect x="192" y="240" width="128" height="32" rx="16" fill="#2ffe1d"/>

  <!-- Braço direito -->
  <rect x="320" y="228" width="56" height="56" rx="12" fill="#2ffe1d"/>

  <!-- Peso direito -->
  <rect x="376" y="176" width="64" height="160" rx="16" fill="#2ffe1d"/>
  <!-- Brilho no peso direito -->
  <rect x="384" y="184" width="18" height="144" rx="9" fill="white" opacity="0.14"/>

  <!-- Texto FitPro -->
  <text x="256" y="396" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="58" font-weight="900" fill="#2ffe1d" text-anchor="middle" letter-spacing="2">FitPro</text>
</svg>
`;

for (const size of sizes) {
  const svg = Buffer.from(svgIcon(size));
  await sharp(svg).png().toFile(`public/icon-${size}.png`);
  console.log(`✓ public/icon-${size}.png gerado`);
}
