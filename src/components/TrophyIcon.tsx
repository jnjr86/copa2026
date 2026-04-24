import type { CSSProperties } from "react";

export default function TrophyIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Base plate */}
      <rect x="8" y="64" width="40" height="5" rx="2.5" fill="currentColor" opacity="0.9" />
      {/* Middle tier */}
      <rect x="14" y="57" width="28" height="9" rx="2" fill="currentColor" />
      {/* Stem */}
      <rect x="22" y="44" width="12" height="15" rx="3" fill="currentColor" />
      {/* Cup body */}
      <path
        d="M14 18 C14 18 11 28 13 37 C15 44 21 47 28 47 C35 47 41 44 43 37 C45 28 42 18 42 18 Z"
        fill="currentColor"
      />
      {/* Left handle */}
      <path
        d="M14 21 C7 23 5 31 7 37 C9 41 14 42 14 42"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right handle */}
      <path
        d="M42 21 C49 23 51 31 49 37 C47 41 42 42 42 42"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Globe */}
      <circle cx="28" cy="13" r="9" fill="currentColor" />
      {/* Globe lines */}
      <ellipse
        cx="28" cy="13"
        rx="4.5" ry="9"
        stroke="#0C0E15"
        strokeWidth="0.9"
        fill="none"
      />
      <line x1="19" y1="13" x2="37" y2="13" stroke="#0C0E15" strokeWidth="0.9" />
      <ellipse
        cx="28" cy="13"
        rx="9" ry="4.5"
        stroke="#0C0E15"
        strokeWidth="0.9"
        fill="none"
      />
    </svg>
  );
}
