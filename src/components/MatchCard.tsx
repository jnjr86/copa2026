"use client";

import { useState } from "react";

interface Team {
  name: string;
  flag: string;
}

interface Match {
  id: number;
  matchNumber: number;
  phase: string;
  group: string | null;
  date: string;
  homeTeam: Team | null;
  awayTeam: Team | null;
  homeScore: number | null;
  awayScore: number | null;
  stadium: { name: string; city: string };
  status: string;
  tbd1: string | null;
  tbd2: string | null;
}

interface MatchCardProps {
  match: Match;
  onScoreUpdate?: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PHASE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  Grupo:    { bg: "rgba(79,156,249,0.12)",  color: "#4F9CF9", label: "Grupo" },
  "16avos": { bg: "rgba(192,132,252,0.12)", color: "#C084FC", label: "16 avos" },
  Oitavas:  { bg: "rgba(129,140,248,0.12)", color: "#818CF8", label: "Oitavas" },
  Quartas:  { bg: "rgba(251,146,60,0.12)",  color: "#FB923C", label: "Quartas" },
  Semi:     { bg: "rgba(248,113,113,0.12)", color: "#F87171", label: "Semifinal" },
  "3lugar": { bg: "rgba(148,163,184,0.10)", color: "#94A3B8", label: "3º lugar" },
  Final:    { bg: "rgba(252,211,77,0.12)",  color: "#FCD34D", label: "FINAL" },
};

export default function MatchCard({ match, onScoreUpdate }: MatchCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [homeScore, setHomeScore] = useState(match.homeScore?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(match.awayScore?.toString() ?? "");
  const [saving, setSaving] = useState(false);

  const isBrasil =
    match.homeTeam?.name === "Brasil" || match.awayTeam?.name === "Brasil";

  const phase = PHASE_STYLES[match.phase] ?? {
    bg: "rgba(72,85,104,0.15)",
    color: "#8892A4",
    label: match.phase,
  };

  const hasScore = match.homeScore !== null && match.awayScore !== null;
  const homeName = match.homeTeam?.name ?? match.tbd1 ?? "A definir";
  const awayName = match.awayTeam?.name ?? match.tbd2 ?? "A definir";
  const homeFlag = match.homeTeam?.flag ?? "—";
  const awayFlag = match.awayTeam?.flag ?? "—";

  async function saveScore() {
    setSaving(true);
    try {
      await fetch(`/api/matches/${match.id}/score`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore),
        }),
      });
      setShowModal(false);
      onScoreUpdate?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div
        className="rounded-2xl p-4 transition-all duration-200 cursor-default group"
        style={{
          background: "var(--bg-card)",
          border: isBrasil
            ? "1px solid rgba(35,253,166,0.35)"
            : "1px solid var(--border)",
          boxShadow: isBrasil
            ? "0 0 20px rgba(35,253,166,0.1), 0 2px 8px rgba(0,0,0,0.4)"
            : "0 2px 8px rgba(0,0,0,0.3)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* Top row: badge + match number */}
        <div className="flex items-center justify-between mb-3.5">
          <span
            className="badge"
            style={{ background: phase.bg, color: phase.color }}
          >
            {phase.label}
            {match.group ? ` · ${match.group}` : ""}
          </span>
          <div className="flex items-center gap-2">
            {isBrasil && (
              <span
                className="badge"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                🇧🇷
              </span>
            )}
            <span
              className="text-sm font-body tabular-nums"
              style={{ color: "var(--text-muted)" }}
            >
              #{match.matchNumber}
            </span>
          </div>
        </div>

        {/* Teams + score */}
        <div className="flex items-center gap-3">
          {/* Home */}
          <div className="flex-1 flex flex-col items-end gap-1">
            <span className="text-2xl leading-none">{homeFlag}</span>
            <span
              className="text-sm font-body font-600 text-right leading-tight"
              style={{ color: hasScore && match.homeScore! > match.awayScore! ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {homeName}
            </span>
          </div>

          {/* Center: score or time */}
          <div className="flex flex-col items-center justify-center min-w-[72px]">
            {hasScore ? (
              <div
                className="font-display text-2xl leading-none tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {match.homeScore}
                <span style={{ color: "var(--text-muted)" }} className="mx-1">
                  ×
                </span>
                {match.awayScore}
              </div>
            ) : (
              <>
                <span
                  className="font-display text-base leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {formatTime(match.date)}
                </span>
                <span
                  className="text-[12px] font-body mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {formatDate(match.date)}
                </span>
              </>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-start gap-1">
            <span className="text-2xl leading-none">{awayFlag}</span>
            <span
              className="text-sm font-body font-600 leading-tight"
              style={{ color: hasScore && match.awayScore! > match.homeScore! ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {awayName}
            </span>
          </div>
        </div>

        {/* Bottom row: stadium + button */}
        <div className="flex items-center justify-between mt-3.5 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <span
            className="text-sm font-body flex items-center gap-1"
            style={{ color: "var(--text-muted)" }}
          >
            <span>📍</span> {match.stadium.city}
          </span>
          {(match.homeTeam || match.awayTeam) && (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm font-body font-600 px-3 py-1 rounded-lg transition-all duration-150"
              style={{
                border: "1px solid rgba(35,253,166,0.3)",
                color: "var(--accent)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {hasScore ? "Editar" : "Placar"}
            </button>
          )}
        </div>
      </div>

      {/* Score modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#141720", border: "1px solid var(--border)" }}
          >
            <h3
              className="font-display text-xl mb-5 text-center"
              style={{ color: "var(--text-primary)" }}
            >
              Registrar Placar
            </h3>

            <div className="flex items-center justify-center gap-5 mb-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">{homeFlag}</span>
                <span className="text-sm font-body text-center max-w-[80px] leading-tight" style={{ color: "var(--text-secondary)" }}>
                  {homeName}
                </span>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  className="w-16 h-14 text-center font-display text-2xl rounded-xl focus:outline-none transition-all"
                  style={{
                    background: "#1A1F2E",
                    border: "1.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }}
                />
              </div>

              <span className="font-display text-2xl mt-8" style={{ color: "var(--text-muted)" }}>×</span>

              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">{awayFlag}</span>
                <span className="text-sm font-body text-center max-w-[80px] leading-tight" style={{ color: "var(--text-secondary)" }}>
                  {awayName}
                </span>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  className="w-16 h-14 text-center font-display text-2xl rounded-xl focus:outline-none transition-all"
                  style={{
                    background: "#1A1F2E",
                    border: "1.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl font-body font-600 text-base transition-all"
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }}
              >
                Cancelar
              </button>
              <button
                onClick={saveScore}
                disabled={saving || homeScore === "" || awayScore === ""}
                className="flex-1 py-2.5 rounded-xl font-body font-700 text-base transition-all disabled:opacity-40"
                style={{
                  background: "var(--accent)",
                  color: "#0C0E15",
                }}
                onMouseEnter={(e) => {
                  if (!(e.currentTarget as HTMLButtonElement).disabled)
                    (e.currentTarget as HTMLElement).style.opacity = "0.88";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
