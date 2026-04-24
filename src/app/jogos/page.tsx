"use client";

import { useEffect, useState, useCallback } from "react";
import MatchCard from "@/components/MatchCard";

interface Team { name: string; flag: string; }
interface Match {
  id: number; matchNumber: number; phase: string; group: string | null;
  date: string; homeTeam: Team | null; awayTeam: Team | null;
  homeScore: number | null; awayScore: number | null;
  stadium: { name: string; city: string }; status: string;
  tbd1: string | null; tbd2: string | null;
}

const PHASES = [
  { value: "", label: "Todas as fases" },
  { value: "Grupo", label: "Fase de grupos" },
  { value: "16avos", label: "16 avos" },
  { value: "Oitavas", label: "Oitavas" },
  { value: "Quartas", label: "Quartas" },
  { value: "Semi", label: "Semifinais" },
  { value: "Final", label: "Final" },
];

const GROUPS = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export default function JogosPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("");
  const [group, setGroup] = useState("");
  const [search, setSearch] = useState("");

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (phase) params.set("phase", phase);
    if (group) params.set("group", group);
    const res = await fetch(`/api/matches?${params}`);
    setMatches(await res.json());
    setLoading(false);
  }, [phase, group]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const filtered = matches.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.homeTeam?.name.toLowerCase().includes(q) ||
      m.awayTeam?.name.toLowerCase().includes(q) ||
      m.stadium.city.toLowerCase().includes(q)
    );
  });

  const selectStyle: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: "10px",
    padding: "8px 12px",
    fontSize: "1rem",
    fontFamily: "Manrope, system-ui, sans-serif",
    outline: "none",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          Todos os Jogos
        </h1>
        <p className="font-body text-base mt-1" style={{ color: "var(--text-secondary)" }}>
          104 jogos · Registre placares em qualquer partida
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <input
          type="text"
          placeholder="Buscar seleção ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 text-base font-body rounded-xl px-3 py-2 focus:outline-none transition-all"
          style={{
            background: "#1A1F2E",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => { (e.currentTarget).style.borderColor = "var(--accent)"; }}
          onBlur={(e) => { (e.currentTarget).style.borderColor = "var(--border)"; }}
        />
        <select
          value={phase}
          onChange={(e) => { setPhase(e.target.value); setGroup(""); }}
          style={selectStyle}
        >
          {PHASES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        {(phase === "Grupo" || phase === "") && (
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            style={selectStyle}
          >
            {GROUPS.map((g) => (
              <option key={g} value={g}>{g ? `Grupo ${g}` : "Todos os grupos"}</option>
            ))}
          </select>
        )}
      </div>

      {/* Count */}
      <div className="font-body text-base" style={{ color: "var(--text-muted)" }}>
        {loading ? "Carregando..." : `${filtered.length} jogo${filtered.length !== 1 ? "s" : ""}`}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} onScoreUpdate={fetchMatches} />
          ))}
        </div>
      )}
    </div>
  );
}
