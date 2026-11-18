import { motion, useReducedMotion } from 'framer-motion';

// Escala de 100 a 109 MHz, 100 unidades por MHz. A agulha fica fixa no centro (200).
const FREQ = 104.7;
const START = 100;
const END = 109;
const PX_PER_MHZ = 100;
const VIEW_W = 400;
const TARGET_X = VIEW_W / 2 - (FREQ - START) * PX_PER_MHZ;

const ticks = Array.from({ length: (END - START) * 10 + 1 }, (_, i) => {
  const major = i % 10 === 0;
  const half = i % 5 === 0;
  return { x: i * 10, major, h: major ? 34 : half ? 24 : 14, label: START + i / 10 };
});

/** Escala de sintonia: ao abrir, a agulha "sintoniza" 104.7. Decorativa. */
export function Dial({ playing }) {
  const reduce = useReducedMotion();

  return (
    <div className="dial-window w-full" aria-hidden="true">
      <svg viewBox={`0 0 ${VIEW_W} 84`} className="w-full h-auto block" role="presentation">
        <motion.g
          initial={{ x: reduce ? TARGET_X : TARGET_X - 380 }}
          animate={{ x: TARGET_X }}
          transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {ticks.map((t) => (
            <g key={t.x}>
              <line
                x1={t.x}
                x2={t.x}
                y1={10}
                y2={10 + t.h}
                stroke={t.major ? '#EEF2FF' : '#A3AFCB'}
                strokeWidth={t.major ? 2.5 : 1.5}
                strokeLinecap="round"
              />
              {t.major && (
                <text
                  x={t.x}
                  y={72}
                  textAnchor="middle"
                  fill="#A3AFCB"
                  fontSize="18"
                  fontWeight="700"
                  fontFamily="'Big Shoulders Display', 'Arial Narrow', sans-serif"
                >
                  {t.label}
                </text>
              )}
            </g>
          ))}
        </motion.g>

        {/* Agulha */}
        <g
          style={{
            filter: playing ? 'drop-shadow(0 0 5px rgba(255,69,56,0.9))' : 'none',
            transition: 'filter 0.4s',
          }}
        >
          <line x1={VIEW_W / 2} x2={VIEW_W / 2} y1={0} y2={60} stroke="#FF4538" strokeWidth={3} strokeLinecap="round" />
          <circle cx={VIEW_W / 2} cy={3} r={4} fill="#FF4538" />
        </g>
      </svg>
    </div>
  );
}
