import React from 'react';

const CATEGORY_STYLES = {
  Wine: {
    glow: 'from-rose-500/20 via-rose-900/10 to-transparent',
    stroke: '#fb7185',
    liquid: '#881337',
    badge: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
  },
  Whisky: {
    glow: 'from-amber-500/25 via-amber-900/10 to-transparent',
    stroke: '#f59e0b',
    liquid: '#92400e',
    badge: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  },
  Vodka: {
    glow: 'from-sky-400/20 via-slate-800/10 to-transparent',
    stroke: '#7dd3fc',
    liquid: '#1e3a5f',
    badge: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
  },
  Brandy: {
    glow: 'from-orange-500/20 via-amber-900/10 to-transparent',
    stroke: '#fb923c',
    liquid: '#7c2d12',
    badge: 'text-orange-300 bg-orange-500/10 border-orange-500/20',
  },
  'Gin & Tequila': {
    glow: 'from-emerald-400/20 via-teal-900/10 to-transparent',
    stroke: '#34d399',
    liquid: '#064e3b',
    badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  },
  'Arrack & Rum': {
    glow: 'from-yellow-500/20 via-amber-950/15 to-transparent',
    stroke: '#eab308',
    liquid: '#713f12',
    badge: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20',
  },
};

export function getCategoryBadgeClass(category) {
  return (
    CATEGORY_STYLES[category]?.badge ||
    'text-amber-300 bg-amber-500/10 border-amber-500/20'
  );
}

export default function BottleSilhouette({ category, volumeMl }) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Whisky;

  const renderShape = () => {
    switch (category) {
      case 'Wine':
        return (
          <g>
            {/* Tall Bordeaux/Burgundy wine silhouette */}
            <rect x="43" y="10" width="14" height="10" rx="2" fill={style.stroke} opacity="0.85" />
            <path
              d="M44 20 L44 46 C44 55 31 60 31 74 L31 142 C31 146 34 148 38 148 L62 148 C66 148 69 146 69 142 L69 74 C69 60 56 55 56 46 L56 20 Z"
              fill="#0f172a"
              stroke={style.stroke}
              strokeWidth="2"
            />
            <path
              d="M33 88 L67 88 L67 141 C67 144 65 146 61 146 L39 146 C35 146 33 144 33 141 Z"
              fill={style.liquid}
              opacity="0.7"
            />
            <rect x="35" y="96" width="30" height="24" rx="2" fill="#1e293b" stroke={style.stroke} strokeWidth="0.8" opacity="0.9" />
            <line x1="41" y1="104" x2="59" y2="104" stroke={style.stroke} strokeWidth="1.2" opacity="0.7" />
            <line x1="44" y1="111" x2="56" y2="111" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />
          </g>
        );
      case 'Whisky':
        return (
          <g>
            {/* Square-shouldered whisky bottle */}
            <rect x="41" y="12" width="18" height="10" rx="2" fill={style.stroke} opacity="0.9" />
            <path
              d="M43 22 L43 44 L28 54 L28 142 C28 146 31 148 35 148 L65 148 C69 148 72 146 72 142 L72 54 L57 44 L57 22 Z"
              fill="#0f172a"
              stroke={style.stroke}
              strokeWidth="2"
            />
            <path
              d="M30 84 L70 84 L70 140 C70 144 68 146 64 146 L36 146 C32 146 30 144 30 140 Z"
              fill={style.liquid}
              opacity="0.75"
            />
            <rect x="33" y="88" width="34" height="28" rx="2" fill="#1e293b" stroke={style.stroke} strokeWidth="0.9" opacity="0.95" />
            <line x1="39" y1="98" x2="61" y2="98" stroke={style.stroke} strokeWidth="1.4" />
            <line x1="42" y1="106" x2="58" y2="106" stroke="#94a3b8" strokeWidth="1" />
          </g>
        );
      case 'Brandy':
        return (
          <g>
            {/* Curved cognac/brandy silhouette */}
            <rect x="42" y="14" width="16" height="9" rx="2" fill={style.stroke} opacity="0.85" />
            <path
              d="M44 23 L44 45 C44 52 26 62 27 86 C28 112 31 132 32 143 C32 146 35 148 39 148 L61 148 C65 148 68 146 68 143 C69 132 72 112 73 86 C74 62 56 52 56 45 L56 23 Z"
              fill="#0f172a"
              stroke={style.stroke}
              strokeWidth="2"
            />
            <path
              d="M29 90 C30 112 32 132 33 142 C33 145 35 146 39 146 L61 146 C65 146 67 145 67 142 C68 132 70 112 71 90 Z"
              fill={style.liquid}
              opacity="0.72"
            />
            <ellipse cx="50" cy="106" rx="14" ry="12" fill="#1e293b" stroke={style.stroke} strokeWidth="0.9" />
            <line x1="42" y1="106" x2="58" y2="106" stroke={style.stroke} strokeWidth="1.2" />
          </g>
        );
      case 'Vodka':
        return (
          <g>
            {/* Sleek tall cylinder vodka silhouette */}
            <rect x="43" y="8" width="14" height="10" rx="1.5" fill={style.stroke} opacity="0.9" />
            <path
              d="M44 18 L44 38 C44 46 33 50 33 62 L33 142 C33 146 36 148 40 148 L60 148 C64 148 67 146 67 142 L67 62 C67 50 56 46 56 38 L56 18 Z"
              fill="#0f172a"
              stroke={style.stroke}
              strokeWidth="2"
            />
            <path
              d="M35 80 L65 80 L65 141 C65 144 63 146 59 146 L41 146 C37 146 35 144 35 141 Z"
              fill={style.liquid}
              opacity="0.55"
            />
            <rect x="37" y="86" width="26" height="30" rx="2" fill="#1e293b" stroke={style.stroke} strokeWidth="0.8" />
            <line x1="42" y1="97" x2="58" y2="97" stroke={style.stroke} strokeWidth="1.2" />
            <line x1="45" y1="105" x2="55" y2="105" stroke="#94a3b8" strokeWidth="1" />
          </g>
        );
      case 'Gin & Tequila':
        return (
          <g>
            {/* Broad apothecary gin/tequila silhouette */}
            <rect x="40" y="14" width="20" height="9" rx="2" fill={style.stroke} opacity="0.85" />
            <path
              d="M43 23 L43 42 C32 45 27 52 27 64 L27 140 C27 145 31 148 36 148 L64 148 C69 148 73 145 73 140 L73 64 C73 52 68 45 57 42 L57 23 Z"
              fill="#0f172a"
              stroke={style.stroke}
              strokeWidth="2"
            />
            <path
              d="M29 88 L71 88 L71 139 C71 143 68 146 63 146 L37 146 C32 146 29 143 29 139 Z"
              fill={style.liquid}
              opacity="0.65"
            />
            <rect x="33" y="84" width="34" height="32" rx="3" fill="#1e293b" stroke={style.stroke} strokeWidth="0.9" />
            <circle cx="50" cy="100" r="6" fill="none" stroke={style.stroke} strokeWidth="1.1" />
          </g>
        );
      default:
        // Arrack & Rum
        return (
          <g>
            {/* Classic rounded-shoulder Ceylon arrack/rum bottle */}
            <rect x="42" y="11" width="16" height="9" rx="2" fill={style.stroke} opacity="0.9" />
            <path
              d="M44 20 L44 43 C44 50 30 56 30 68 L30 142 C30 146 33 148 37 148 L63 148 C67 148 70 146 70 142 L70 68 C70 56 56 50 56 43 L56 20 Z"
              fill="#0f172a"
              stroke={style.stroke}
              strokeWidth="2"
            />
            <path
              d="M32 82 L68 82 L68 141 C68 144 66 146 62 146 L38 146 C34 146 32 144 32 141 Z"
              fill={style.liquid}
              opacity="0.78"
            />
            <rect x="34" y="90" width="32" height="28" rx="2" fill="#1e293b" stroke={style.stroke} strokeWidth="0.9" />
            <line x1="40" y1="100" x2="60" y2="100" stroke={style.stroke} strokeWidth="1.3" />
            <line x1="43" y1="108" x2="57" y2="108" stroke="#cbd5e1" strokeWidth="1" opacity="0.7" />
          </g>
        );
    }
  };

  return (
    <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-950/70 border border-slate-800/70">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${style.glow}`} />
      <svg
        viewBox="0 0 100 156"
        className="relative z-10 h-28 w-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        {renderShape()}
      </svg>
      {volumeMl >= 1000 && (
        <span className="absolute bottom-2 left-2.5 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-300 border border-amber-500/25">
          LARGE {(volumeMl / 1000).toFixed(volumeMl % 1000 === 0 ? 0 : 1)}L
        </span>
      )}
    </div>
  );
}
