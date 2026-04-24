interface KnockoutMatch {
  id: number;
  matchNumber: number;
  phase: string;
  homeTeam: { name: string; flag: string } | null;
  awayTeam: { name: string; flag: string } | null;
  homeScore: number | null;
  awayScore: number | null;
  tbd1: string | null;
  tbd2: string | null;
  stadium: { city: string };
  date: string;
}

const PHASE_ACCENT: Record<string, string> = {
  "16avos": "#C084FC",
  Oitavas:  "#818CF8",
  Quartas:  "#FB923C",
  Semi:     "#F87171",
  "3lugar": "#94A3B8",
  Final:    "#FCD34D",
};

function MatchSlot({ match }: { match: KnockoutMatch }) {
  const home = match.homeTeam;
  const away = match.awayTeam;
  const homeName = home?.name ?? match.tbd1 ?? "A definir";
  const awayName = away?.name ?? match.tbd2 ?? "A definir";
  const homeFlag = home?.flag ?? "—";
  const awayFlag = away?.flag ?? "—";
  const accentColor = PHASE_ACCENT[match.phase] ?? "var(--accent)";

  const hasScore = match.homeScore !== null && match.awayScore !== null;
  const homeWon = hasScore && match.homeScore! > match.awayScore!;
  const awayWon = hasScore && match.awayScore! > match.homeScore!;

  return (
    <div
      className="rounded-xl p-3 w-48"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${match.phase === "Final" ? "rgba(252,211,77,0.3)" : "var(--border)"}`,
        boxShadow: match.phase === "Final" ? "0 0 20px rgba(252,211,77,0.1)" : "none",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[12px] font-body font-700 uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          J{match.matchNumber}
        </span>
        <span className="text-[12px] font-body" style={{ color: "var(--text-muted)" }}>
          {match.stadium.city}
        </span>
      </div>

      <div className="space-y-1.5">
        {/* Home team row */}
        <div
          className="flex items-center justify-between gap-2 rounded-lg px-2 py-1"
          style={{
            background: homeWon ? "rgba(35,253,166,0.08)" : "transparent",
          }}
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="text-base leading-none">{homeFlag}</span>
            <span
              className="text-sm font-body font-600 truncate"
              style={{ color: homeWon ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {homeName}
            </span>
          </span>
          <span
            className="font-display text-base shrink-0"
            style={{ color: homeWon ? "var(--accent)" : "var(--text-muted)" }}
          >
            {match.homeScore ?? "—"}
          </span>
        </div>

        {/* Away team row */}
        <div
          className="flex items-center justify-between gap-2 rounded-lg px-2 py-1"
          style={{
            background: awayWon ? "rgba(35,253,166,0.08)" : "transparent",
          }}
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="text-base leading-none">{awayFlag}</span>
            <span
              className="text-sm font-body font-600 truncate"
              style={{ color: awayWon ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {awayName}
            </span>
          </span>
          <span
            className="font-display text-base shrink-0"
            style={{ color: awayWon ? "var(--accent)" : "var(--text-muted)" }}
          >
            {match.awayScore ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

interface Props {
  rounds: {
    label: string;
    matches: KnockoutMatch[];
  }[];
}

export default function KnockoutBracket({ rounds }: Props) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-5 min-w-max items-start">
        {rounds.map((round) => (
          <div key={round.label} className="flex flex-col">
            <div
              className="text-center text-sm font-body font-700 uppercase tracking-widest mb-4 pb-2"
              style={{
                color: "var(--text-muted)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {round.label}
            </div>
            <div
              className="flex flex-col gap-3 justify-around"
              style={{ flex: 1 }}
            >
              {round.matches.map((match) => (
                <MatchSlot key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
