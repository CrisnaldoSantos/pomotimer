import "./dev-animation.css";

/** coffee = pausa curta (tomando café), break = pausa longa (recostado) */
export type DevState = "coding" | "idle" | "coffee" | "break";

// Cada linha de código: indentação + segmentos [largura, cor] (como tokens de syntax highlight)
const CODE_LINES: { indent: number; parts: [number, string][] }[] = [
  { indent: 0, parts: [[22, "var(--purple)"], [34, "var(--blue)"], [18, "var(--foreground)"]] },
  { indent: 1, parts: [[18, "var(--purple)"], [26, "var(--foreground)"], [40, "var(--orange)"]] },
  { indent: 1, parts: [[14, "var(--pink)"], [52, "var(--blue)"]] },
  { indent: 2, parts: [[30, "var(--foreground)"], [24, "var(--green)"], [16, "var(--muted)"]] },
  { indent: 2, parts: [[44, "var(--orange)"], [20, "var(--foreground)"]] },
  { indent: 1, parts: [[10, "var(--muted)"]] },
  { indent: 1, parts: [[24, "var(--pink)"], [36, "var(--green)"]] },
  { indent: 0, parts: [[8, "var(--muted)"]] },
];

const CYCLE_S = 7;
const LINE_STEP_S = 0.65;
const LINE_TYPE_S = 0.5;

// Uma keyframe por linha para que sejam "digitadas" em sequência e apagadas juntas no fim do ciclo.
const lineKeyframes = CODE_LINES.map((_, i) => {
  const start = ((i * LINE_STEP_S) / CYCLE_S) * 100;
  const end = start + (LINE_TYPE_S / CYCLE_S) * 100;
  return `@keyframes dev-type-${i}{0%,${start.toFixed(2)}%{transform:scaleX(0)}${end.toFixed(2)}%,92%{transform:scaleX(1)}100%{transform:scaleX(0)}}`;
}).join("");

const SKIN = "#e8b98a";
const HOODIE = "#6e40c9";
const HOODIE_DARK = "#4c2a92";
const JEANS = "#2f4a7a";

/** Cabeça do dev (pescoço, cabelo, óculos e fone), desenhada na posição sentada. */
function DevHead() {
  return (
    <>
      <rect x="128" y="160" width="14" height="14" rx="4" fill={SKIN} />
      <circle cx="138" cy="146" r="22" fill={SKIN} />
      <path d="M116 150 C110 126 128 116 146 120 C158 122 162 132 160 140 C148 132 132 136 126 154 Z" fill="#2b2118" />
      {/* óculos e olho */}
      <rect x="146" y="140" width="13" height="10" rx="3" fill="none" stroke="var(--background)" strokeWidth="2" />
      <circle cx="153" cy="145" r="2" fill="var(--background)" className="dev-eye" />
      {/* fone de ouvido */}
      <path d="M122 142 C118 116 154 110 158 132" fill="none" stroke="var(--background)" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="127" cy="148" rx="7" ry="9" fill="var(--background)" />
      <ellipse cx="127" cy="148" rx="3" ry="4" fill="var(--green)" />
    </>
  );
}

export function DevAnimation({
  state,
  className,
}: {
  state: DevState;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 480 340"
      className={`dev-scene ${className ?? ""}`}
      data-state={state}
      role="img"
      aria-label={
        state === "coffee"
          ? "Dev tomando café durante a pausa"
          : state === "break"
            ? "Dev levantou da cadeira e saiu para a pausa longa"
            : "Dev programando no computador"
      }
    >
      <style>{lineKeyframes}</style>
      <defs>
        <radialGradient id="dev-glow-gradient">
          <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="dev-scene-clip">
          <rect x="0" y="0" width="480" height="340" />
        </clipPath>
      </defs>

      {/* Janela com céu noturno */}
      <g>
        <rect x="40" y="28" width="96" height="72" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="3" />
        <line x1="88" y1="28" x2="88" y2="100" stroke="var(--border)" strokeWidth="3" />
        <circle cx="118" cy="46" r="8" fill="var(--yellow)" opacity="0.85" />
        <circle cx="114" cy="43" r="7" fill="var(--surface)" />
        {[
          [56, 44, 0],
          [72, 66, 1.2],
          [100, 80, 0.6],
          [60, 86, 1.8],
          [124, 72, 2.4],
        ].map(([cx, cy, delay]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="1.5"
            fill="var(--foreground)"
            className="dev-star"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </g>

      {/* Brilho do monitor */}
      <ellipse cx="328" cy="150" rx="170" ry="120" fill="url(#dev-glow-gradient)" className="dev-glow" />

      {/* Chão */}
      <line x1="20" y1="314" x2="460" y2="314" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />

      {/* Mesa */}
      <rect x="176" y="240" width="8" height="74" fill="var(--surface-2)" />
      <rect x="444" y="240" width="8" height="74" fill="var(--surface-2)" />
      <rect x="168" y="230" width="292" height="10" rx="3" fill="var(--border)" />

      {/* Monitor */}
      <rect x="320" y="214" width="16" height="12" fill="var(--surface-2)" />
      <rect x="302" y="226" width="52" height="4" rx="2" fill="var(--surface-2)" />
      <rect x="230" y="86" width="196" height="128" rx="8" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="2" />
      <rect x="238" y="94" width="180" height="112" rx="4" fill="var(--background)" />
      <circle cx="246" cy="101" r="2.5" fill="var(--pink)" />
      <circle cx="254" cy="101" r="2.5" fill="var(--orange)" />
      <circle cx="262" cy="101" r="2.5" fill="var(--green)" />

      {/* Código sendo digitado */}
      <g className="dev-code">
        {CODE_LINES.map((line, i) => {
          let x = 248 + line.indent * 10;
          return (
            <g
              key={i}
              className="dev-line dev-work"
              style={{ animation: `dev-type-${i} ${CYCLE_S}s steps(5, end) infinite` }}
            >
              {line.parts.map(([w, color], j) => {
                const part = <rect key={j} x={x} y={112 + i * 10} width={w} height="4" rx="2" fill={color} />;
                x += w + 4;
                return part;
              })}
            </g>
          );
        })}
      </g>

      {/* Telas de pausa */}
      <g className="dev-break-screen dev-screen-coffee">
        <text x="328" y="146" textAnchor="middle" fontSize="26">☕</text>
        <text x="328" y="170" textAnchor="middle" fontSize="11" fill="var(--blue)" fontFamily="var(--font-geist-mono), monospace">
          git stash &amp;&amp; relax
        </text>
      </g>
      <g className="dev-break-screen dev-screen-afk">
        <text x="328" y="146" textAnchor="middle" fontSize="26">🚶</text>
        <text x="328" y="170" textAnchor="middle" fontSize="11" fill="var(--blue)" fontFamily="var(--font-geist-mono), monospace">
          status: afk // volto já
        </text>
      </g>

      {/* Barra de status do editor */}
      <rect x="238" y="198" width="180" height="8" fill="var(--surface)" />
      <rect x="244" y="200" width="24" height="4" rx="2" fill="var(--green)" opacity="0.8" />
      <rect x="402" y="199" width="4" height="6" fill="var(--foreground)" className="dev-cursor" />

      {/* Teclado e mouse */}
      <rect x="226" y="223" width="76" height="7" rx="2" fill="var(--border)" />
      <rect x="230" y="225" width="68" height="2" rx="1" fill="var(--surface-2)" />
      <ellipse cx="376" cy="227" rx="7" ry="3.5" fill="var(--border)" />

      {/* Caneca com vapor (sai da mesa quando o dev pega o café) */}
      <g className="dev-desk-mug">
        {[402, 410, 418].map((x, i) => (
          <path
            key={x}
            d={`M${x} 200 q-4 -6 0 -12 q4 -6 0 -12`}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="2"
            strokeLinecap="round"
            className="dev-steam"
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}
        <path d="M424 211 q9 0 9 7 q0 7 -9 7" fill="none" stroke="var(--orange)" strokeWidth="3" />
        <rect x="400" y="205" width="24" height="25" rx="4" fill="var(--orange)" />
        <text x="412" y="222" textAnchor="middle" fontSize="8" fill="var(--background)" fontFamily="var(--font-geist-mono), monospace" fontWeight="700">
          {"{}"}
        </text>
      </g>

      {/* Pato de borracha */}
      <g className="dev-duck">
        <ellipse cx="446" cy="223" rx="10" ry="7" fill="var(--yellow)" />
        <circle cx="450" cy="212" r="6" fill="var(--yellow)" />
        <path d="M455 211 l6 2 l-6 2 z" fill="var(--orange)" />
        <circle cx="451" cy="210" r="1.2" fill="var(--background)" />
      </g>

      {/* Cadeira */}
      <g className="dev-chair">
        <rect x="54" y="158" width="14" height="96" rx="7" fill="var(--surface-2)" transform="rotate(-6 61 206)" />
        <rect x="58" y="248" width="84" height="10" rx="4" fill="var(--surface-2)" />
        <rect x="96" y="258" width="8" height="42" fill="var(--border)" />
        <line x1="70" y1="304" x2="130" y2="304" stroke="var(--border)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="72" cy="309" r="4" fill="var(--surface-2)" />
        <circle cx="100" cy="309" r="4" fill="var(--surface-2)" />
        <circle cx="128" cy="309" r="4" fill="var(--surface-2)" />
      </g>

      {/* Dev sentado (some na pausa longa) */}
      <g className="dev-seated">
        {/* Pernas */}
        <line x1="108" y1="244" x2="186" y2="248" stroke={JEANS} strokeWidth="22" strokeLinecap="round" />
        <line x1="188" y1="250" x2="192" y2="298" stroke={JEANS} strokeWidth="18" strokeLinecap="round" />
        <ellipse cx="200" cy="305" rx="15" ry="6" fill="var(--surface-2)" />

        {/* Tronco, braços e cabeça (inclinam juntos na pausa curta) */}
        <g className="dev-upper">
          {/* braço de trás */}
          <g className="dev-arm-typing">
            <line x1="138" y1="190" x2="174" y2="214" stroke={HOODIE_DARK} strokeWidth="13" strokeLinecap="round" />
            <g className="dev-forearm-back dev-work">
              <line x1="174" y1="214" x2="232" y2="220" stroke={HOODIE_DARK} strokeWidth="11" strokeLinecap="round" />
              <circle cx="238" cy="220" r="6" fill={SKIN} />
            </g>
          </g>
          {/* braço de trás apoiado no colo (pausa curta) */}
          <g className="dev-arm-coffee">
            <line x1="138" y1="190" x2="150" y2="226" stroke={HOODIE_DARK} strokeWidth="13" strokeLinecap="round" />
            <line x1="150" y1="226" x2="180" y2="235" stroke={HOODIE_DARK} strokeWidth="11" strokeLinecap="round" />
            <circle cx="185" cy="235" r="6" fill={SKIN} />
          </g>

          {/* tronco (moletom) */}
          <path d="M90 252 C84 216 92 186 112 172 C128 162 148 170 150 190 C152 214 146 238 140 252 Z" fill={HOODIE} />

          {/* cabeça */}
          <g className="dev-head dev-work">
            <DevHead />
          </g>

          {/* braço da frente */}
          <g className="dev-arm-typing">
            <line x1="132" y1="188" x2="178" y2="218" stroke={HOODIE} strokeWidth="14" strokeLinecap="round" />
            <g className="dev-forearm-front dev-work">
              <line x1="178" y1="218" x2="250" y2="222" stroke={HOODIE} strokeWidth="12" strokeLinecap="round" />
              <circle cx="256" cy="222" r="6.5" fill={SKIN} />
            </g>
          </g>
          {/* braço da frente segurando a caneca (pausa curta) */}
          <g className="dev-arm-coffee">
            <line x1="132" y1="188" x2="146" y2="216" stroke={HOODIE} strokeWidth="14" strokeLinecap="round" />
            <g className="dev-sip">
              <line x1="146" y1="216" x2="152" y2="178" stroke={HOODIE} strokeWidth="12" strokeLinecap="round" />
              <g className="dev-held-mug">
                <g className="dev-held-steam">
                  {[165, 172].map((x, i) => (
                    <path
                      key={x}
                      d={`M${x} 152 q-3 -5 0 -10 q3 -5 0 -10`}
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      className="dev-steam"
                      style={{ animationDelay: `${i * 0.8}s` }}
                    />
                  ))}
                </g>
                <path d="M158 159 q-10 0 -10 7.5 q0 7.5 10 7.5" fill="none" stroke="var(--orange)" strokeWidth="3" />
                <rect x="158" y="156" width="19" height="21" rx="3.5" fill="var(--orange)" />
                <text x="167.5" y="170" textAnchor="middle" fontSize="7" fill="var(--background)" fontFamily="var(--font-geist-mono), monospace" fontWeight="700">
                  {"{}"}
                </text>
              </g>
              <circle cx="151" cy="173" r="6" fill={SKIN} />
            </g>
          </g>
        </g>
      </g>

      {/* Dev em pé (pausa longa): levanta e sai andando pela esquerda */}
      <g className="dev-walker" clipPath="url(#dev-scene-clip)">
        <g className="dev-walk-path">
          {/* coordenadas locais: pés em y=0, olhando para a direita; espelhado para andar para a esquerda */}
          <g transform="translate(150 312) scale(-1 1)">
            <g className="dev-walk-bob">
              <g className="dev-leg dev-leg-back">
                <line x1="0" y1="-92" x2="0" y2="-10" stroke="#26406b" strokeWidth="17" strokeLinecap="round" />
                <ellipse cx="6" cy="-4" rx="13" ry="5.5" fill="var(--surface-2)" />
              </g>
              <g className="dev-swing-arm dev-swing-arm-back">
                <line x1="0" y1="-148" x2="0" y2="-102" stroke={HOODIE_DARK} strokeWidth="12" strokeLinecap="round" />
                <circle cx="0" cy="-97" r="6" fill={SKIN} />
              </g>
              <g className="dev-leg dev-leg-front">
                <line x1="0" y1="-92" x2="0" y2="-10" stroke={JEANS} strokeWidth="18" strokeLinecap="round" />
                <ellipse cx="6" cy="-4" rx="13" ry="5.5" fill="var(--border)" />
              </g>
              <path d="M-17 -84 C-21 -118 -17 -150 0 -158 C17 -160 22 -140 20 -118 C19 -100 18 -90 16 -84 Z" fill={HOODIE} />
              <g transform="translate(-136 -322)">
                <DevHead />
              </g>
              <g className="dev-swing-arm dev-swing-arm-front">
                <line x1="2" y1="-148" x2="2" y2="-100" stroke={HOODIE} strokeWidth="13" strokeLinecap="round" />
                <circle cx="2" cy="-95" r="6.5" fill={SKIN} />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
