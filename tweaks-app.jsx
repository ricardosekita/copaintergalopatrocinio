/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSlider, TweakToggle */
const { useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "atmosfera": "noir",
  "densidade": "cinematico",
  "tipografia": "editorial",
  "brilho": 6,
  "vinheta": true
}/*EDITMODE-END*/;

const PALETTES = {
  noir: {
    vars: {
      "--black-abyss": "#000000",
      "--black-deep":  "#05060a",
      "--black-rich":  "#0a0b12",
      "--black-elev":  "#12131c",
      "--ink-900":     "#191a24",
      "--ink-700":     "#262735",
      "--gold-core":   "#D4AF37",
      "--gold-bright": "#F2D57A",
      "--gold-hi":     "#FFF1BF",
      "--gold-deep":   "#8E6B1E",
      "--gold-dark":   "#6B4F12",
      "--text-primary":"#F5F0E1",
      "--text-soft":   "#C9C4B5",
      "--text-mute":   "#6E6A5C",
      "--accent-rgb":  "212, 175, 55",
    }
  },
  aurora: {
    vars: {
      "--black-abyss": "#02030a",
      "--black-deep":  "#040716",
      "--black-rich":  "#070b22",
      "--black-elev":  "#0c1230",
      "--ink-900":     "#141a3a",
      "--ink-700":     "#1f2750",
      "--gold-core":   "#9BB8FF",
      "--gold-bright": "#C8D9FF",
      "--gold-hi":     "#EAF1FF",
      "--gold-deep":   "#3D5BB0",
      "--gold-dark":   "#26397A",
      "--text-primary":"#EEF1FF",
      "--text-soft":   "#B8C2DD",
      "--text-mute":   "#5C6586",
      "--accent-rgb":  "155, 184, 255",
    }
  },
  brasa: {
    vars: {
      "--black-abyss": "#0a0303",
      "--black-deep":  "#13070a",
      "--black-rich":  "#1a0a0e",
      "--black-elev":  "#220e14",
      "--ink-900":     "#2a1418",
      "--ink-700":     "#3a1c22",
      "--gold-core":   "#E8A24A",
      "--gold-bright": "#FFC97A",
      "--gold-hi":     "#FFE4B5",
      "--gold-deep":   "#A85A18",
      "--gold-dark":   "#6B3508",
      "--text-primary":"#FFF2E0",
      "--text-soft":   "#D9C4A8",
      "--text-mute":   "#8A6B55",
      "--accent-rgb":  "232, 162, 74",
    }
  },
};

const DENSITY_CSS = {
  cinematico: ``,
  editorial: `
    .bg-grid { display: none !important; }
    .bg-orb { opacity: 0.45 !important; filter: blur(20px); }
    .bg-orb.bl { opacity: 0.3 !important; }
    .bg-particles { opacity: 0.55 !important; }
    .bg-constellation { opacity: 0.18 !important; }
    .bg-vignette { opacity: 0.6 !important; }
  `,
  plano: `
    .bg-grid, .bg-orb, .bg-particles, .bg-constellation { display: none !important; }
    .bg-lines { opacity: 0.35 !important; }
    .bg-vignette { display: none !important; }
    .bg-base {
      background:
        linear-gradient(180deg, var(--black-deep) 0%, var(--black-abyss) 100%) !important;
    }
    .corners { opacity: 0.4 !important; }
    .gold {
      animation: none !important;
      background: var(--gold-core) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
    }
    .giant-number {
      filter: none !important;
    }
    .illus { filter: none !important; }
  `,
};

const TYPOGRAPHY = {
  editorial: {
    googleHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap",
    css: `
      html, body, .slide { font-family: 'Manrope', sans-serif !important; }
      .title-serif { font-family: 'Cormorant Garamond', serif !important; font-weight: 400 !important; letter-spacing: -0.015em !important; }
      .giant-number { font-family: 'Cormorant Garamond', serif !important; font-weight: 500 !important; letter-spacing: -0.03em !important; }
    `
  },
  esporte: {
    googleHref: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap",
    css: `
      html, body, .slide { font-family: 'Manrope', sans-serif !important; }
      .title-serif {
        font-family: 'Bebas Neue', 'Manrope', sans-serif !important;
        font-weight: 400 !important;
        letter-spacing: 0.02em !important;
        font-style: normal !important;
        text-transform: uppercase;
      }
      .title-serif em, .title-serif [style*="italic"] { font-style: normal !important; }
      .giant-number {
        font-family: 'Bebas Neue', 'Manrope', sans-serif !important;
        font-weight: 400 !important;
        letter-spacing: 0 !important;
      }
    `
  },
  digital: {
    googleHref: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
    css: `
      html, body, .slide { font-family: 'Space Grotesk', sans-serif !important; font-weight: 400 !important; }
      .title-serif {
        font-family: 'Space Grotesk', sans-serif !important;
        font-weight: 500 !important;
        letter-spacing: -0.035em !important;
        font-style: normal !important;
      }
      .title-serif [style*="italic"] { font-style: normal !important; }
      .giant-number {
        font-family: 'JetBrains Mono', monospace !important;
        font-weight: 700 !important;
        letter-spacing: -0.05em !important;
      }
    `
  },
};

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const styleRef = useRef(null);
  const fontLinkRef = useRef(null);

  useEffect(() => {
    const palette = PALETTES[tweaks.atmosfera] || PALETTES.noir;
    const density = DENSITY_CSS[tweaks.densidade] ?? DENSITY_CSS.cinematico;
    const typography = TYPOGRAPHY[tweaks.tipografia] || TYPOGRAPHY.editorial;

    const paletteVars = Object.entries(palette.vars)
      .map(([k, v]) => `${k}: ${v};`)
      .join("\n  ");

    const accentRGB = palette.vars["--accent-rgb"];
    const lineVars = `
  --line-subtle: rgba(${accentRGB}, 0.12);
  --line-mid: rgba(${accentRGB}, 0.28);
  --line-strong: rgba(${accentRGB}, 0.55);
    `;

    const bgRebuild = `
.bg-base {
  background:
    radial-gradient(ellipse 120% 80% at 50% 100%, rgba(${accentRGB}, 0.10) 0%, transparent 55%),
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(${accentRGB}, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse 120% 120% at 50% 50%, var(--black-rich) 0%, var(--black-deep) 70%, var(--black-abyss) 100%);
}
.bg-grid::before {
  background-image:
    linear-gradient(to right, rgba(${accentRGB}, 0.45) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(${accentRGB}, 0.45) 1px, transparent 1px);
}
.bg-lines {
  background-image:
    linear-gradient(to right, rgba(${accentRGB}, 0.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(${accentRGB}, 0.055) 1px, transparent 1px);
}
.bg-orb {
  background: radial-gradient(circle, rgba(${accentRGB}, 0.22) 0%, rgba(${accentRGB}, 0.06) 35%, transparent 65%);
}
.bg-orb.bl {
  background: radial-gradient(circle, rgba(${accentRGB}, 0.15) 0%, rgba(${accentRGB}, 0.04) 40%, transparent 70%);
}
.bg-particles .dot {
  background: var(--gold-hi);
  box-shadow: 0 0 8px var(--gold-core), 0 0 16px rgba(${accentRGB}, 0.4);
}
.chip { background: rgba(${accentRGB}, 0.04); }
.card {
  background: linear-gradient(160deg, rgba(${accentRGB}, 0.05) 0%, rgba(${accentRGB}, 0.01) 100%);
}
    `;

    const speed = Math.max(1.5, Math.min(20, 12 - tweaks.brilho));
    const shimmerCSS = `
.gold { animation-duration: ${speed}s !important; }
[data-deck-active] .fx-glow {
  animation:
    fxGlow 2500ms ease-out both,
    goldPulse ${Math.max(2, speed * 0.7)}s ease-in-out 2.5s infinite !important;
}
.giant-number {
  filter: drop-shadow(0 0 ${20 + tweaks.brilho * 4}px rgba(${accentRGB}, ${0.2 + tweaks.brilho * 0.04}));
}
.bg-orb { animation-duration: ${Math.max(4, 14 - tweaks.brilho)}s !important; }
    `;

    const vignetteCSS = tweaks.vinheta ? "" : `.bg-vignette { display: none !important; }`;

    const fullCSS = `
:root {
  ${paletteVars}
  ${lineVars}
}
${bgRebuild}
${density}
${typography.css}
${shimmerCSS}
${vignetteCSS}
    `;

    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      styleRef.current.id = "tweaks-style";
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = fullCSS;

    if (!fontLinkRef.current) {
      fontLinkRef.current = document.createElement("link");
      fontLinkRef.current.rel = "stylesheet";
      fontLinkRef.current.id = "tweaks-fonts";
      document.head.appendChild(fontLinkRef.current);
    }
    if (fontLinkRef.current.href !== typography.googleHref) {
      fontLinkRef.current.href = typography.googleHref;
    }
  }, [tweaks]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Atmosfera" />
      <TweakRadio
        label="Paleta"
        value={tweaks.atmosfera}
        onChange={(v) => setTweak("atmosfera", v)}
        options={[
          { value: "noir",   label: "Noir" },
          { value: "aurora", label: "Aurora" },
          { value: "brasa",  label: "Brasa" },
        ]}
      />

      <TweakSection label="Densidade" />
      <TweakRadio
        label="Cenário"
        value={tweaks.densidade}
        onChange={(v) => setTweak("densidade", v)}
        options={[
          { value: "cinematico", label: "Cine" },
          { value: "editorial",  label: "Editorial" },
          { value: "plano",      label: "Plano" },
        ]}
      />

      <TweakSection label="Tipografia" />
      <TweakRadio
        label="Voz"
        value={tweaks.tipografia}
        onChange={(v) => setTweak("tipografia", v)}
        options={[
          { value: "editorial", label: "Editorial" },
          { value: "esporte",   label: "Esporte" },
          { value: "digital",   label: "Digital" },
        ]}
      />

      <TweakSection label="Detalhes" />
      <TweakSlider
        label="Brilho do ouro"
        value={tweaks.brilho}
        onChange={(v) => setTweak("brilho", v)}
        min={0}
        max={10}
        step={1}
      />
      <TweakToggle
        label="Vinheta"
        value={tweaks.vinheta}
        onChange={(v) => setTweak("vinheta", v)}
      />
    </TweaksPanel>
  );
}

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.createRoot(root).render(<App />);
