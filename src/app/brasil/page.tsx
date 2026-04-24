import { prisma } from "@/lib/prisma";

function formatDateBR(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function formatTimeBR(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PHASE_LABELS: Record<string, string> = {
  Grupo: "Fase de Grupos",
  "16avos": "16 avos de final",
  Oitavas: "Oitavas de final",
  Quartas: "Quartas de final",
  Semi: "Semifinal",
  "3lugar": "3º lugar",
  Final: "FINAL",
};

export default async function BrasilPage() {
  const brasilMatches = await prisma.match.findMany({
    where: {
      OR: [
        { homeTeam: { name: "Brasil" } },
        { awayTeam: { name: "Brasil" } },
      ],
    },
    orderBy: { date: "asc" },
    include: { homeTeam: true, awayTeam: true, stadium: true },
  });

  const groupCTeams = await prisma.team.findMany({
    where: { group: "C" },
    orderBy: { name: "asc" },
  });

  const groupCFinished = await prisma.match.findMany({
    where: { phase: "Grupo", group: "C", homeScore: { not: null } },
    include: { homeTeam: true, awayTeam: true },
  });

  const standingsMap = new Map<number, {
    id: number; name: string; flag: string;
    played: number; won: number; drawn: number; lost: number;
    gf: number; ga: number; gd: number; points: number;
  }>();

  for (const team of groupCTeams) {
    standingsMap.set(team.id, {
      id: team.id, name: team.name, flag: team.flag,
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0,
    });
  }

  for (const match of groupCFinished) {
    if (match.homeTeamId && match.awayTeamId && match.homeScore !== null && match.awayScore !== null) {
      const home = standingsMap.get(match.homeTeamId);
      const away = standingsMap.get(match.awayTeamId);
      if (!home || !away) continue;
      home.played++; away.played++;
      home.gf += match.homeScore; home.ga += match.awayScore;
      away.gf += match.awayScore; away.ga += match.homeScore;
      home.gd = home.gf - home.ga; away.gd = away.gf - away.ga;
      if (match.homeScore > match.awayScore) {
        home.won++; home.points += 3; away.lost++;
      } else if (match.homeScore < match.awayScore) {
        away.won++; away.points += 3; home.lost++;
      } else {
        home.drawn++; away.drawn++; home.points++; away.points++;
      }
    }
  }

  const standings = Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(35,253,166,0.1) 0%, rgba(19,22,32,0) 60%, rgba(252,211,77,0.06) 100%)",
          border: "1px solid rgba(35,253,166,0.2)",
        }}
      >
        {/* Background watermark */}
        <div
          className="absolute right-6 top-4 font-display text-8xl sm:text-9xl opacity-5 select-none pointer-events-none"
          style={{ color: "var(--accent)" }}
        >
          🇧🇷
        </div>

        <div className="relative z-10">
          <span
            className="badge mb-3"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            ⭐⭐⭐⭐⭐ · 5x Campeão Mundial
          </span>
          <h1 className="font-display text-4xl sm:text-5xl mt-2" style={{ color: "var(--text-primary)" }}>
            🇧🇷 Brasil
          </h1>
          <div className="flex flex-wrap gap-4 mt-4 text-base font-body">
            <div>
              <span style={{ color: "var(--text-muted)" }}>Grupo · </span>
              <span
                className="font-700"
                style={{ color: "var(--accent)" }}
              >
                C
              </span>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Confederação · </span>
              <span style={{ color: "var(--text-primary)" }}>CONMEBOL</span>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Títulos · </span>
              <span style={{ color: "#FCD34D" }}>1958, 1962, 1970, 1994, 2002</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grupo C standings */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h2 className="font-display text-xl mb-4" style={{ color: "var(--text-primary)" }}>
          Classificação — Grupo C
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-base font-body">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["#", "Seleção", "P", "J", "V", "E", "D", "GP", "GC", "SG"].map((h) => (
                  <th
                    key={h}
                    className={`pb-2 text-sm font-700 ${h === "Seleção" ? "text-left" : "text-center"}`}
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standings.map((team, i) => {
                const isBrasil = team.name === "Brasil";
                return (
                  <tr
                    key={team.id}
                    style={{
                      borderBottom: "1px solid rgba(30,34,51,0.5)",
                      background: isBrasil ? "rgba(35,253,166,0.05)" : "transparent",
                      borderLeft: isBrasil ? "2px solid var(--accent)" : "2px solid transparent",
                    }}
                  >
                    <td className="py-2.5 pl-2">
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded text-[12px] font-display"
                        style={{
                          background: i < 2 ? "rgba(35,253,166,0.15)" : "rgba(30,34,51,0.8)",
                          color: i < 2 ? "var(--accent)" : "var(--text-muted)",
                        }}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{team.flag}</span>
                        <span
                          className="font-600"
                          style={{ color: isBrasil ? "var(--accent)" : "var(--text-primary)" }}
                        >
                          {team.name}
                        </span>
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className="font-display text-base"
                        style={{ color: i < 2 ? "var(--accent)" : "var(--text-primary)" }}
                      >
                        {team.points}
                      </span>
                    </td>
                    {[team.played, team.won, team.drawn, team.lost, team.gf, team.ga].map((v, j) => (
                      <td key={j} className="py-2.5 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                        {v}
                      </td>
                    ))}
                    <td className="py-2.5 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                      {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brasil matches */}
      <div>
        <h2 className="font-display text-xl mb-4" style={{ color: "var(--text-primary)" }}>
          Jogos do Brasil
        </h2>
        <div className="space-y-3">
          {brasilMatches.map((match) => {
            const isBrasilHome = match.homeTeam?.name === "Brasil";
            const opponent = isBrasilHome ? match.awayTeam : match.homeTeam;
            const brasilScore = isBrasilHome ? match.homeScore : match.awayScore;
            const opponentScore = isBrasilHome ? match.awayScore : match.homeScore;
            const hasScore = brasilScore !== null && opponentScore !== null;

            let resultLabel = "";
            let resultColor = "var(--text-muted)";
            let resultBg = "transparent";
            if (hasScore) {
              if (brasilScore! > opponentScore!) {
                resultLabel = "Vitória"; resultColor = "var(--accent)"; resultBg = "var(--accent-dim)";
              } else if (brasilScore! < opponentScore!) {
                resultLabel = "Derrota"; resultColor = "#F87171"; resultBg = "rgba(248,113,113,0.1)";
              } else {
                resultLabel = "Empate"; resultColor = "#FCD34D"; resultBg = "rgba(252,211,77,0.1)";
              }
            }

            return (
              <div
                key={match.id}
                className="rounded-2xl p-5"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(35,253,166,0.25)",
                  boxShadow: "0 2px 12px rgba(35,253,166,0.06)",
                }}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="badge"
                    style={{ background: "rgba(79,156,249,0.12)", color: "#4F9CF9" }}
                  >
                    {PHASE_LABELS[match.phase] ?? match.phase}
                    {match.group ? ` · Grupo ${match.group}` : ""}
                  </span>
                  {resultLabel && (
                    <span
                      className="badge font-display"
                      style={{ background: resultBg, color: resultColor }}
                    >
                      {resultLabel}
                    </span>
                  )}
                </div>

                {/* Match display */}
                <div className="flex items-center justify-center gap-6 sm:gap-10">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🇧🇷</div>
                    <div
                      className="font-display text-base"
                      style={{ color: "var(--accent)" }}
                    >
                      Brasil
                    </div>
                  </div>

                  <div className="text-center">
                    {hasScore ? (
                      <div
                        className="font-display text-4xl sm:text-5xl"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {brasilScore}
                        <span style={{ color: "var(--text-muted)" }} className="mx-2 text-3xl">×</span>
                        {opponentScore}
                      </div>
                    ) : (
                      <>
                        <div
                          className="font-display text-2xl"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {formatTimeBR(match.date)}
                        </div>
                        <div
                          className="font-body text-base mt-1 capitalize"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {formatDateBR(match.date)}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="text-center">
                    <div className="text-5xl mb-2">{opponent?.flag ?? "❓"}</div>
                    <div
                      className="font-display text-base"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {opponent?.name ?? match.tbd1 ?? "A definir"}
                    </div>
                  </div>
                </div>

                {/* Stadium */}
                <div
                  className="mt-4 pt-3 text-center font-body text-sm"
                  style={{
                    borderTop: "1px solid var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  📍 {match.stadium.name} · {match.stadium.city}
                  {!hasScore && (
                    <span className="ml-3" style={{ color: "var(--text-secondary)" }}>
                      {formatDateBR(match.date)} · {formatTimeBR(match.date)} (Brasília)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
