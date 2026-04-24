import { prisma } from "@/lib/prisma";
import KnockoutBracket from "@/components/KnockoutBracket";

const PHASE_ORDER = ["16avos", "Oitavas", "Quartas", "Semi", "3lugar", "Final"];
const PHASE_LABELS: Record<string, string> = {
  "16avos": "16 Avos de Final",
  Oitavas: "Oitavas de Final",
  Quartas: "Quartas de Final",
  Semi: "Semifinais",
  "3lugar": "3º Lugar",
  Final: "🏆 Final",
};
const PHASE_COLORS: Record<string, string> = {
  "16avos": "#C084FC",
  Oitavas: "#818CF8",
  Quartas: "#FB923C",
  Semi: "#F87171",
  "3lugar": "#94A3B8",
  Final: "#FCD34D",
};

export default async function MatamataPage() {
  const matches = await prisma.match.findMany({
    where: { phase: { not: "Grupo" } },
    orderBy: [{ phase: "asc" }, { matchNumber: "asc" }],
    include: { homeTeam: true, awayTeam: true, stadium: true },
  });

  const roundMap = new Map<string, typeof matches>();
  for (const phase of PHASE_ORDER) roundMap.set(phase, []);
  for (const match of matches) roundMap.get(match.phase)?.push(match);

  const rounds = PHASE_ORDER
    .filter((p) => (roundMap.get(p)?.length ?? 0) > 0)
    .map((p) => ({
      label: PHASE_LABELS[p],
      matches: (roundMap.get(p) ?? []).map((m) => ({
        ...m,
        date: m.date.toISOString(),
      })),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          Mata-mata
        </h1>
        <p className="font-body text-base mt-1" style={{ color: "var(--text-secondary)" }}>
          Fase eliminatória · 32 jogos · do décimo-sexto à Final
        </p>
      </div>

      {/* Phase summary pills */}
      <div className="flex flex-wrap gap-2">
        {PHASE_ORDER.map((phase) => {
          const count = roundMap.get(phase)?.length ?? 0;
          if (!count) return null;
          return (
            <div
              key={phase}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: `${PHASE_COLORS[phase]}15`,
                border: `1px solid ${PHASE_COLORS[phase]}30`,
              }}
            >
              <span
                className="font-display text-base"
                style={{ color: PHASE_COLORS[phase] }}
              >
                {PHASE_LABELS[phase]}
              </span>
              <span
                className="font-body text-sm px-1.5 py-0.5 rounded-full"
                style={{
                  background: `${PHASE_COLORS[phase]}20`,
                  color: PHASE_COLORS[phase],
                }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bracket */}
      <div
        className="rounded-2xl p-4 sm:p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <KnockoutBracket rounds={rounds} />
      </div>

      {/* Legend */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <p
          className="font-body text-sm mb-3 font-700 uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Legenda de fases
        </p>
        <div className="flex flex-wrap gap-3">
          {PHASE_ORDER.map((phase) => (
            <div key={phase} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: PHASE_COLORS[phase] }}
              />
              <span
                className="font-body text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {PHASE_LABELS[phase]}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <span className="font-body text-sm" style={{ color: "var(--text-secondary)" }}>
              Vencedor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
