"use client";

const GREEN  = "#2ffe1d";
const DIM    = "#666666";
const BODY   = "#333333";
const STROKE = "#aaaaaa";

// ── Bench Press (Supino) ───────────────────────────────────────────────────
function BenchPressAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <rect x="22" y="86" width="76" height="9" rx="4" fill={DIM} />
      <rect x="28" y="73" width="56" height="15" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <circle cx="88" cy="71" r="9" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <line x1="34" y1="74" x2="24" y2="63" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      <line x1="76" y1="74" x2="86" y2="63" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-16; 0,0" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <rect x="18" y="58" width="84" height="6" rx="3" fill={GREEN} />
        <rect x="9" y="51" width="11" height="20" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="100" y="51" width="11" height="20" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="18" y="58" width="84" height="6" rx="3" fill={GREEN} opacity="0.3" style={{ filter: "blur(5px)" }} />
      </g>
      <path d="M54 22 L60 13 L66 22" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// ── Fly / Crucifixo ────────────────────────────────────────────────────────
function FlyAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      {/* Bench */}
      <rect x="22" y="86" width="76" height="9" rx="4" fill={DIM} />
      {/* Body */}
      <rect x="30" y="73" width="54" height="15" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <circle cx="88" cy="71" r="9" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      {/* Animated arms going wide then together */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-4; 0,0" dur="1.8s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        {/* Left arm */}
        <line x1="34" y1="76" x2="10" y2="60" stroke={STROKE} strokeWidth="4" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate"
            values="0 34 76; -22 34 76; 0 34 76" dur="1.8s" repeatCount="indefinite"
            calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        </line>
        {/* Right arm */}
        <line x1="76" y1="76" x2="100" y2="60" stroke={STROKE} strokeWidth="4" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate"
            values="0 76 76; 22 76 76; 0 76 76" dur="1.8s" repeatCount="indefinite"
            calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        </line>
        {/* Left dumbbell */}
        <circle cx="10" cy="60" r="7" fill={GREEN} opacity="0.85">
          <animateTransform attributeName="transform" type="rotate"
            values="0 34 76; -22 34 76; 0 34 76" dur="1.8s" repeatCount="indefinite"
            calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        </circle>
        {/* Right dumbbell */}
        <circle cx="100" cy="60" r="7" fill={GREEN} opacity="0.85">
          <animateTransform attributeName="transform" type="rotate"
            values="0 76 76; 22 76 76; 0 76 76" dur="1.8s" repeatCount="indefinite"
            calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        </circle>
      </g>
    </svg>
  );
}

// ── Lat Pulldown (Puxada Frontal) ──────────────────────────────────────────
function PulldownAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <line x1="60" y1="8" x2="28" y2="55" stroke={DIM} strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="8" x2="92" y2="55" stroke={DIM} strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="8" r="6" fill={DIM} />
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,18; 0,0" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <rect x="20" y="50" width="80" height="6" rx="3" fill={GREEN} />
        <rect x="12" y="46" width="10" height="14" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="98" y="46" width="10" height="14" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="20" y="50" width="80" height="6" rx="3" fill={GREEN} opacity="0.25" style={{ filter: "blur(5px)" }} />
      </g>
      <circle cx="60" cy="80" r="10" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <rect x="40" y="89" width="40" height="18" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <line x1="44" y1="90" x2="30" y2="62" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      <line x1="76" y1="90" x2="90" y2="62" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      <path d="M54 36 L60 45 L66 36" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// ── Bent Over Row (Remada Curvada / Unilateral) ───────────────────────────
function RowAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      {/* Floor */}
      <rect x="10" y="108" width="100" height="4" rx="2" fill={DIM} />
      {/* Torso bent over */}
      <rect x="30" y="48" width="50" height="16" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5"
        transform="rotate(-30 55 56)" />
      {/* Head */}
      <circle cx="84" cy="38" r="10" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      {/* Legs */}
      <line x1="36" y1="70" x2="34" y2="108" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <line x1="54" y1="70" x2="58" y2="108" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      {/* Animated arm pulling bar up */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-18; 0,0" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <line x1="36" y1="64" x2="36" y2="88" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        {/* Bar */}
        <rect x="22" y="84" width="28" height="6" rx="3" fill={GREEN} />
        <rect x="16" y="79" width="8" height="14" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="48" y="79" width="8" height="14" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="22" y="84" width="28" height="6" rx="3" fill={GREEN} opacity="0.3" style={{ filter: "blur(4px)" }} />
      </g>
      <path d="M30 50 L26 42 L34 44" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// ── Squat (Agachamento) ────────────────────────────────────────────────────
function SquatAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <rect x="10" y="108" width="100" height="4" rx="2" fill={DIM} />
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,20; 0,0" dur="1.8s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <rect x="15" y="34" width="90" height="6" rx="3" fill={GREEN} />
        <rect x="8" y="27" width="10" height="20" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="102" y="27" width="10" height="20" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="15" y="34" width="90" height="6" rx="3" fill={GREEN} opacity="0.25" style={{ filter: "blur(5px)" }} />
        <circle cx="60" cy="24" r="10" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <rect x="42" y="40" width="36" height="28" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <line x1="46" y1="44" x2="28" y2="40" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        <line x1="74" y1="44" x2="92" y2="40" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        <line x1="52" y1="68" x2="38" y2="92" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        <line x1="68" y1="68" x2="82" y2="92" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        <rect x="28" y="90" width="18" height="7" rx="3" fill={DIM} />
        <rect x="74" y="90" width="18" height="7" rx="3" fill={DIM} />
      </g>
    </svg>
  );
}

// ── Leg Press ──────────────────────────────────────────────────────────────
function LegPressAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      {/* Seat / machine */}
      <rect x="70" y="70" width="40" height="12" rx="4" fill={DIM} />
      <rect x="100" y="20" width="10" height="62" rx="4" fill={DIM} />
      {/* Body seated */}
      <rect x="70" y="50" width="28" height="22" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <circle cx="84" cy="42" r="10" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      {/* Animated legs pressing plate */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -20,0; 0,0" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        {/* Upper legs */}
        <line x1="70" y1="65" x2="44" y2="58" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        <line x1="70" y1="72" x2="44" y2="78" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        {/* Lower legs */}
        <line x1="44" y1="58" x2="18" y2="60" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        <line x1="44" y1="78" x2="18" y2="76" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        {/* Plate */}
        <rect x="8" y="52" width="12" height="32" rx="3" fill={GREEN} opacity="0.9" />
        <rect x="6" y="48" width="6" height="40" rx="2" fill={GREEN} />
        <rect x="8" y="52" width="12" height="32" rx="3" fill={GREEN} opacity="0.25" style={{ filter: "blur(5px)" }} />
      </g>
      <path d="M16 46 L8 50 L16 54" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// ── Leg Extension / Mesa Flexora ───────────────────────────────────────────
function LegMachineAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      {/* Machine seat */}
      <rect x="10" y="60" width="50" height="12" rx="4" fill={DIM} />
      <rect x="10" y="48" width="12" height="24" rx="4" fill={DIM} />
      {/* Body seated */}
      <rect x="28" y="38" width="30" height="24" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <circle cx="43" cy="30" r="10" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      {/* Upper leg (static, on seat) */}
      <line x1="55" y1="62" x2="92" y2="62" stroke={STROKE} strokeWidth="7" strokeLinecap="round" />
      {/* Animated lower leg */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="0 92 62; -60 92 62; 0 92 62" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <line x1="92" y1="62" x2="112" y2="96" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        {/* Pad / weight */}
        <rect x="104" y="90" width="16" height="10" rx="3" fill={GREEN} />
        <rect x="104" y="90" width="16" height="10" rx="3" fill={GREEN} opacity="0.25" style={{ filter: "blur(4px)" }} />
      </g>
    </svg>
  );
}

// ── Calf Raise (Panturrilha) ───────────────────────────────────────────────
function CalfRaiseAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <rect x="10" y="108" width="100" height="4" rx="2" fill={DIM} />
      {/* Dumbbell in hands */}
      <rect x="18" y="58" width="10" height="28" rx="3" fill={GREEN} opacity="0.8" />
      <rect x="92" y="58" width="10" height="28" rx="3" fill={GREEN} opacity="0.8" />
      <circle cx="23" cy="56" r="6" fill={GREEN} />
      <circle cx="97" cy="56" r="6" fill={GREEN} />
      <circle cx="23" cy="88" r="6" fill={GREEN} />
      <circle cx="97" cy="88" r="6" fill={GREEN} />
      {/* Animated body (goes up on toes) */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-14; 0,0" dur="1.4s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <circle cx="60" cy="18" r="11" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <rect x="46" y="29" width="28" height="30" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <line x1="50" y1="59" x2="46" y2="82" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        <line x1="70" y1="59" x2="74" y2="82" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        {/* Calves (highlighted) */}
        <rect x="38" y="80" width="16" height="24" rx="6" fill={BODY} stroke={GREEN} strokeWidth="2.5">
          <animate attributeName="stroke" values={`${STROKE};${GREEN};${STROKE}`} dur="1.4s" repeatCount="indefinite" />
        </rect>
        <rect x="66" y="80" width="16" height="24" rx="6" fill={BODY} stroke={GREEN} strokeWidth="2.5">
          <animate attributeName="stroke" values={`${STROKE};${GREEN};${STROKE}`} dur="1.4s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* Toes pivot */}
      <ellipse cx="46" cy="107" rx="8" ry="4" fill={DIM} />
      <ellipse cx="74" cy="107" rx="8" ry="4" fill={DIM} />
    </svg>
  );
}

// ── Bicep Curl ─────────────────────────────────────────────────────────────
function CurlAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <circle cx="60" cy="14" r="10" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <rect x="46" y="24" width="28" height="34" rx="8" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      {/* Other arm static */}
      <rect x="34" y="28" width="12" height="28" rx="6" fill={BODY} stroke={STROKE} strokeWidth="2" />
      <rect x="30" y="54" width="12" height="22" rx="6" fill={BODY} stroke={STROKE} strokeWidth="2" />
      <rect x="24" y="72" width="22" height="6" rx="3" fill={DIM} />
      <rect x="74" y="28" width="12" height="28" rx="6" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      {/* Animated forearm */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="0 80 56; -100 80 56; 0 80 56" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <rect x="74" y="56" width="12" height="28" rx="6" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <rect x="66" y="81" width="28" height="7" rx="3" fill={GREEN} />
        <rect x="62" y="76" width="10" height="16" rx="3" fill={GREEN} opacity="0.8" />
        <rect x="84" y="76" width="10" height="16" rx="3" fill={GREEN} opacity="0.8" />
        <rect x="66" y="81" width="28" height="7" rx="3" fill={GREEN} opacity="0.3" style={{ filter: "blur(4px)" }} />
      </g>
    </svg>
  );
}

// ── Tricep Pushdown (Pulley) ───────────────────────────────────────────────
function PushdownAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <line x1="60" y1="4" x2="60" y2="32" stroke={DIM} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="60" cy="4" r="5" fill={DIM} />
      <circle cx="60" cy="20" r="10" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <rect x="46" y="30" width="28" height="28" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <line x1="52" y1="58" x2="46" y2="96" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <line x1="68" y1="58" x2="74" y2="96" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <rect x="34" y="32" width="12" height="22" rx="6" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <rect x="74" y="32" width="12" height="22" rx="6" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,22; 0,0" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <rect x="34" y="54" width="12" height="22" rx="6" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <rect x="74" y="54" width="12" height="22" rx="6" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <rect x="30" y="72" width="60" height="6" rx="3" fill={GREEN} />
        <rect x="23" y="67" width="9" height="14" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="88" y="67" width="9" height="14" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="30" y="72" width="60" height="6" rx="3" fill={GREEN} opacity="0.25" style={{ filter: "blur(5px)" }} />
      </g>
      <path d="M54 98 L60 107 L66 98" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// ── Tricep Francês (Lying Extension) ──────────────────────────────────────
function LyingExtensionAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <rect x="10" y="82" width="100" height="9" rx="4" fill={DIM} />
      {/* Body lying */}
      <rect x="20" y="70" width="68" height="14" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <circle cx="96" cy="68" r="9" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      {/* Upper arms pointing up (fixed) */}
      <line x1="38" y1="70" x2="42" y2="46" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      <line x1="54" y1="70" x2="58" y2="46" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      {/* Animated forearms + bar swinging */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="0 50 46; 50 50 46; 0 50 46" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <line x1="42" y1="46" x2="38" y2="24" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        <line x1="58" y1="46" x2="62" y2="24" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        <rect x="26" y="18" width="48" height="6" rx="3" fill={GREEN} />
        <rect x="18" y="13" width="10" height="16" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="72" y="13" width="10" height="16" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="26" y="18" width="48" height="6" rx="3" fill={GREEN} opacity="0.3" style={{ filter: "blur(4px)" }} />
      </g>
    </svg>
  );
}

// ── Dips / Fundos ──────────────────────────────────────────────────────────
function DipsAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      {/* Parallel bars */}
      <rect x="8"  y="48" width="8"  height="60" rx="3" fill={DIM} />
      <rect x="104" y="48" width="8" height="60" rx="3" fill={DIM} />
      <rect x="8"  y="44" width="34" height="8" rx="3" fill={DIM} />
      <rect x="78" y="44" width="34" height="8" rx="3" fill={DIM} />
      {/* Animated body going up and down */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,18; 0,0" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <circle cx="60" cy="14" r="11" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <rect x="46" y="25" width="28" height="32" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        {/* Arms on bars */}
        <line x1="46" y1="32" x2="16" y2="46" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        <line x1="74" y1="32" x2="104" y2="46" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
        {/* Legs hanging */}
        <line x1="52" y1="57" x2="48" y2="88" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
        <line x1="68" y1="57" x2="72" y2="88" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      </g>
      <path d="M54 10 L60 2 L66 10" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// ── Overhead Press ─────────────────────────────────────────────────────────
function OverheadAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <circle cx="60" cy="38" r="11" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <rect x="46" y="49" width="28" height="30" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <line x1="52" y1="79" x2="46" y2="112" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <line x1="68" y1="79" x2="74" y2="112" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-18; 0,0" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <line x1="50" y1="52" x2="26" y2="46" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        <line x1="70" y1="52" x2="94" y2="46" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        <rect x="18" y="38" width="84" height="6" rx="3" fill={GREEN} />
        <rect x="9" y="31" width="11" height="20" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="100" y="31" width="11" height="20" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="18" y="38" width="84" height="6" rx="3" fill={GREEN} opacity="0.25" style={{ filter: "blur(5px)" }} />
      </g>
      <path d="M54 14 L60 5 L66 14" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// ── Crunch ─────────────────────────────────────────────────────────────────
function CrunchAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <rect x="8" y="100" width="104" height="7" rx="3" fill={DIM} />
      <line x1="42" y1="92" x2="36" y2="100" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <line x1="78" y1="92" x2="84" y2="100" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <line x1="42" y1="92" x2="54" y2="72" stroke={STROKE} strokeWidth="7" strokeLinecap="round" />
      <line x1="78" y1="92" x2="66" y2="72" stroke={STROKE} strokeWidth="7" strokeLinecap="round" />
      <circle cx="54" cy="72" r="6" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <circle cx="66" cy="72" r="6" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <line x1="54" y1="72" x2="52" y2="100" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <line x1="66" y1="72" x2="68" y2="100" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="0 60 92; 32 60 92; 0 60 92" dur="1.8s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <rect x="36" y="78" width="48" height="16" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <rect x="40" y="56" width="40" height="24" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5">
          <animate attributeName="stroke" values={`${STROKE};${GREEN};${STROKE}`} dur="1.8s" repeatCount="indefinite" />
        </rect>
        <circle cx="60" cy="46" r="11" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
        <path d="M40 58 Q26 50 32 40" fill="none" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        <path d="M80 58 Q94 50 88 40" fill="none" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ── Default ────────────────────────────────────────────────────────────────
function DefaultAnimation() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      <circle cx="60" cy="22" r="11" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <rect x="48" y="33" width="24" height="32" rx="7" fill={BODY} stroke={STROKE} strokeWidth="2.5" />
      <line x1="50" y1="65" x2="40" y2="100" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <line x1="70" y1="65" x2="80" y2="100" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-12; 0,0" dur="1.6s" repeatCount="indefinite"
          calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
        <line x1="48" y1="36" x2="24" y2="44" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        <line x1="72" y1="36" x2="96" y2="44" stroke={STROKE} strokeWidth="4" strokeLinecap="round" />
        <rect x="20" y="36" width="80" height="6" rx="3" fill={GREEN} />
        <rect x="12" y="29" width="10" height="20" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="98" y="29" width="10" height="20" rx="2" fill={GREEN} opacity="0.8" />
        <rect x="20" y="36" width="80" height="6" rx="3" fill={GREEN} opacity="0.25" style={{ filter: "blur(5px)" }} />
      </g>
    </svg>
  );
}

// ── Mapeamento por nome de exercício ───────────────────────────────────────

const EXERCISE_NAME_MAP: Record<string, JSX.Element> = {
  // Peito
  "supino reto":           <BenchPressAnimation />,
  "supino inclinado":      <BenchPressAnimation />,
  "supino declinado":      <BenchPressAnimation />,
  "crucifixo":             <FlyAnimation />,
  "crucifixo inclinado":   <FlyAnimation />,
  "crossover":             <FlyAnimation />,
  "flexão":                <BenchPressAnimation />,
  "flexão de braço":       <BenchPressAnimation />,
  // Costas
  "puxada frontal":        <PulldownAnimation />,
  "barra fixa":            <PulldownAnimation />,
  "remada curvada":        <RowAnimation />,
  "remada unilateral":     <RowAnimation />,
  "remada sentado":        <RowAnimation />,
  "remada alta":           <RowAnimation />,
  "levantamento terra":    <RowAnimation />,
  // Ombros
  "desenvolvimento":       <OverheadAnimation />,
  "desenvolvimento com halteres": <OverheadAnimation />,
  "elevação lateral":      <OverheadAnimation />,
  "elevação frontal":      <OverheadAnimation />,
  "crucifixo inverso":     <FlyAnimation />,
  // Bíceps
  "rosca direta":          <CurlAnimation />,
  "rosca alternada":       <CurlAnimation />,
  "rosca martelo":         <CurlAnimation />,
  "rosca concentrada":     <CurlAnimation />,
  "rosca inclinada":       <CurlAnimation />,
  // Tríceps
  "tríceps pulley":        <PushdownAnimation />,
  "tríceps na polia":      <PushdownAnimation />,
  "tríceps francês":       <LyingExtensionAnimation />,
  "tríceps testa":         <LyingExtensionAnimation />,
  "tríceps coice":         <PushdownAnimation />,
  "fundos":                <DipsAnimation />,
  // Pernas
  "agachamento":           <SquatAnimation />,
  "agachamento livre":     <SquatAnimation />,
  "leg press":             <LegPressAnimation />,
  "cadeira extensora":     <LegMachineAnimation />,
  "mesa flexora":          <LegMachineAnimation />,
  "afundo":                <SquatAnimation />,
  "stiff":                 <RowAnimation />,
  "levantamento terra romeno": <RowAnimation />,
  "panturrilha em pé":     <CalfRaiseAnimation />,
  "panturrilha sentado":   <CalfRaiseAnimation />,
  // Abdômen
  "abdominal":             <CrunchAnimation />,
  "prancha":               <CrunchAnimation />,
  "abdominal remador":     <CrunchAnimation />,
  "elevação de pernas":    <CrunchAnimation />,
  "abdominal oblíquo":     <CrunchAnimation />,
};

// Fallback por grupo muscular
const MUSCLE_MAP: Record<string, JSX.Element> = {
  "Peito":    <BenchPressAnimation />,
  "Costas":   <PulldownAnimation />,
  "Pernas":   <SquatAnimation />,
  "Ombros":   <OverheadAnimation />,
  "Bíceps":   <CurlAnimation />,
  "Tríceps":  <PushdownAnimation />,
  "Abdômen":  <CrunchAnimation />,
};

interface ExerciseAnimationProps {
  exerciseName?: string;
  muscleGroup?: string;
  label?: string;
}

export default function ExerciseAnimation({ exerciseName, muscleGroup, label }: ExerciseAnimationProps) {
  // Tenta por nome primeiro, depois grupo muscular, depois default
  const byName = exerciseName
    ? EXERCISE_NAME_MAP[exerciseName.toLowerCase().trim()]
    : undefined;
  const byGroup = muscleGroup ? MUSCLE_MAP[muscleGroup] : undefined;
  const anim = byName ?? byGroup ?? <DefaultAnimation />;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
      {anim}
      <span style={{ fontSize: 12, fontWeight: 700, color: "#2ffe1d", opacity: 0.8 }}>
        {label ?? exerciseName ?? muscleGroup ?? "Exercício"}
      </span>
    </div>
  );
}
