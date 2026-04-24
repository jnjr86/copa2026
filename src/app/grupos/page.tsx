import { prisma } from "@/lib/prisma";
import GroupTable from "@/components/GroupTable";

async function getGroupData() {
  const teams = await prisma.team.findMany({
    where: { group: { not: null } },
    orderBy: [{ group: "asc" }, { name: "asc" }],
  });

  const matches = await prisma.match.findMany({
    where: { phase: "Grupo", homeScore: { not: null } },
    include: { homeTeam: true, awayTeam: true },
  });

  const standingsMap = new Map<number, {
    id: number; name: string; flag: string;
    played: number; won: number; drawn: number; lost: number;
    gf: number; ga: number; gd: number; points: number;
  }>();

  for (const team of teams) {
    standingsMap.set(team.id, {
      id: team.id, name: team.name, flag: team.flag,
      played: 0, won: 0, drawn: 0, lost: 0,
      gf: 0, ga: 0, gd: 0, points: 0,
    });
  }

  for (const match of matches) {
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

  return "ABCDEFGHIJKL".split("").map((g) => ({
    group: g,
    standings: teams
      .filter((t) => t.group === g)
      .map((t) => standingsMap.get(t.id)!)
      .filter(Boolean),
  }));
}

export default async function GruposPage() {
  const groupData = await getGroupData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          Fase de Grupos
        </h1>
        <p className="font-body text-base mt-1" style={{ color: "var(--text-secondary)" }}>
          12 grupos · 48 seleções · 72 jogos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {groupData.map(({ group, standings }) => (
          <div
            key={group}
            className="rounded-2xl p-4 transition-all duration-200"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {/* Group header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="font-display text-sm px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(79,156,249,0.12)",
                    color: "#4F9CF9",
                  }}
                >
                  GRUPO
                </span>
                <span className="font-display text-2xl" style={{ color: "var(--text-primary)" }}>
                  {group}
                </span>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                {standings.map((team) => (
                  <span key={team.id} className="text-lg leading-none" title={team.name}>
                    {team.flag}
                  </span>
                ))}
              </div>
            </div>

            <GroupTable standings={standings} />
          </div>
        ))}
      </div>
    </div>
  );
}
