/* Ilustrasi karakter SVG ekspresif Koki Moomoo (Sapi bertopi koki putih besar) dan gelembung suara interaktif */
import { Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { audioEngine } from '../lib/audioEngine';
import type { MascotExpression } from '../types';

interface KokiMoomooSvgProps {
  expression: MascotExpression;
  isSpeaking?: boolean;
  isCooking?: boolean;
  size?: number;
}

export function KokiMoomooSvg({
  expression,
  isSpeaking = false,
  isCooking = false,
  size = 132,
}: KokiMoomooSvgProps) {
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(false);
      return;
    }
    const timer = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 190);
    return () => clearInterval(timer);
  }, [isSpeaking]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Koki Moomoo sedang ${expression}`}
      className={`select-none transition-transform duration-200 motion-reduce:transition-none ${
        isSpeaking ? '-translate-y-1 scale-[1.03]' : ''
      } ${isCooking ? 'animate-float' : ''}`}
    >
      {/* Latar lingkaran lembut di belakang Koki Moomoo */}
      <circle cx="90" cy="100" r="74" fill="#FEF3C7" />

      {/* Telinga kiri & kanan sapi */}
      <ellipse cx="36" cy="92" rx="18" ry="11" transform="rotate(-18 36 92)" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
      <ellipse cx="37" cy="93" rx="10" ry="5.5" transform="rotate(-18 37 93)" fill="#FBCFE8" />
      <ellipse cx="144" cy="92" rx="18" ry="11" transform="rotate(18 144 92)" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />
      <ellipse cx="143" cy="93" rx="10" ry="5.5" transform="rotate(18 143 93)" fill="#FBCFE8" />

      {/* Tanduk kecil lucu */}
      <path d="M54 68 C47 55, 55 48, 62 58" fill="#FDE68A" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M126 68 C133 55, 125 48, 118 58" fill="#FDE68A" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />

      {/* Badan baju koki putih & syal oranye */}
      <path
        d="M48 164 C50 138, 66 130, 90 130 C114 130, 130 138, 132 164 Z"
        fill="#FFFFFF"
        stroke="#334155"
        strokeWidth="3.5"
      />
      <path d="M70 134 L90 148 L110 134 L90 139 Z" fill="#F97316" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="90" cy="156" r="2.6" fill="#94A3B8" />

      {/* Kepala sapi */}
      <rect x="44" y="64" width="92" height="76" rx="38" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />

      {/* Bintik sapi khas */}
      <path d="M53 76 C66 72, 74 82, 68 92 C61 98, 49 92, 53 76 Z" fill="#334155" />
      <circle cx="122" cy="86" r="9" fill="#334155" />

      {/* Topi koki putih besar (Toque) */}
      <path
        d="M58 66 C44 58, 44 36, 62 32 C68 18, 112 18, 118 32 C136 36, 136 58, 122 66 Z"
        fill="#FFFFFF"
        stroke="#334155"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="57" y="57" width="66" height="14" rx="5" fill="#F8FAFC" stroke="#334155" strokeWidth="3.2" />
      <path d="M77 33 V51 M90 29 V51 M103 33 V51" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

      {/* Mata sesuai ekspresi */}
      {expression === 'bersorak' ? (
        <>
          <path d="M64 95 Q71 86 78 95" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M102 95 Q109 86 116 95" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : expression === 'berpikir' ? (
        <>
          <circle cx="71" cy="92" r="6" fill="#1E293B" />
          <circle cx="73" cy="90" r="2.2" fill="#FFFFFF" />
          <circle cx="109" cy="92" r="6" fill="#1E293B" />
          <circle cx="111" cy="90" r="2.2" fill="#FFFFFF" />
          <path d="M63 81 Q71 78 78 82" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <path d="M102 80 Q110 74 118 79" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="71" cy="93" r="6" fill="#1E293B" />
          <circle cx="73" cy="90.5" r="2.2" fill="#FFFFFF" />
          <circle cx="109" cy="93" r="6" fill="#1E293B" />
          <circle cx="111" cy="90.5" r="2.2" fill="#FFFFFF" />
        </>
      )}

      {/* Pipi merona */}
      <ellipse cx="57" cy="107" rx="7" ry="4.2" fill="#FDA4AF" opacity="0.8" />
      <ellipse cx="123" cy="107" rx="7" ry="4.2" fill="#FDA4AF" opacity="0.8" />

      {/* Moncong merah muda */}
      <rect x="58" y="104" width="64" height="34" rx="17" fill="#FBCFE8" stroke="#334155" strokeWidth="3.2" />
      {/* Lubang hidung */}
      <ellipse cx="76" cy="115" rx="3.8" ry="2.6" fill="#BE185D" />
      <ellipse cx="104" cy="115" rx="3.8" ry="2.6" fill="#BE185D" />

      {/* Mulut dinamis saat berbicara & ekspresi */}
      {isSpeaking && mouthOpen ? (
        <ellipse cx="90" cy="127" rx="9" ry="6.5" fill="#9F1239" stroke="#334155" strokeWidth="2.4" />
      ) : expression === 'bersorak' ? (
        <path d="M77 123 Q90 136 103 123 Z" fill="#9F1239" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
      ) : expression === 'berpikir' ? (
        <path d="M83 127 Q90 124 97 127" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M79 124 Q90 133 101 124" stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}

      {/* Tangan / kuku ekspresif */}
      {expression === 'bersorak' && (
        <>
          <circle cx="34" cy="134" r="10" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <circle cx="146" cy="134" r="10" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <path d="M26 42 L30 34 L34 42 L42 46 L34 50 L30 58 L26 50 L18 46 Z" fill="#FBBF24" />
          <path d="M146 38 L149 32 L152 38 L158 41 L152 44 L149 50 L146 44 L140 41 Z" fill="#FBBF24" />
        </>
      )}

      {expression === 'berpikir' && (
        <>
          <circle cx="129" cy="134" r="9.5" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
          <circle cx="149" cy="52" r="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
          <circle cx="159" cy="40" r="6" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

interface MoomooBannerProps {
  expression: MascotExpression;
  message: string;
  isSpeaking: boolean;
  isCooking?: boolean;
  onRepeatSpeech?: () => void;
}

export function MoomooBanner({
  expression,
  message,
  isSpeaking,
  isCooking = false,
  onRepeatSpeech,
}: MoomooBannerProps) {
  const handleRepeat = () => {
    audioEngine.playPop();
    if (onRepeatSpeech) {
      onRepeatSpeech();
    } else {
      audioEngine.speak(message);
    }
  };

  return (
    <section
      aria-label="Pesan Koki Moomoo"
      className="flex flex-col sm:flex-row items-center gap-4 bg-white border-2 border-amber-200 rounded-3xl p-4 sm:p-5 shadow-sm"
    >
      <div className="shrink-0 flex flex-col items-center">
        <KokiMoomooSvg
          expression={expression}
          isSpeaking={isSpeaking}
          isCooking={isCooking}
          size={116}
        />
        <span className="font-display text-sm font-bold text-amber-800 -mt-1">
          Koki Moomoo
        </span>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full">
        <div className="flex-1 bg-amber-50 border-2 border-amber-200 rounded-2xl px-5 py-4 text-center sm:text-left">
          <p className="text-lg sm:text-xl font-semibold text-slate-800 leading-snug">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRepeat}
          aria-label="Dengar lagi suara Koki Moomoo"
          className="shrink-0 min-w-[68px] min-h-[68px] px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-display font-bold text-base flex items-center justify-center gap-2 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 cursor-pointer shadow-sm"
        >
          <Volume2 className="w-7 h-7 shrink-0" />
          <span className="whitespace-nowrap">Dengar Lagi</span>
        </button>
      </div>
    </section>
  );
}
