interface TeamStanding {
  id: number;
  name: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export default function GroupTable({ standings }: { standings: TeamStanding[] }) {
  const sorted = [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-base font-body min-w-[300px]">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["#", "Seleção", "P", "J", "V", "E", "D", "SG"].map((h) => (
              <th
                key={h}
                className={`pb-2 text-sm font-600 ${h === "Seleção" ? "text-left" : "text-center"}`}
                style={{ color: "var(--text-muted)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((team, i) => (
            <tr
              key={team.id}
              style={{ borderBottom: "1px solid rgba(30,34,51,0.5)" }}
            >
              <td className="py-2 pr-2 w-6">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded text-[12px] font-display"
                  style={{
                    background: i < 2 ? "rgba(35,253,166,0.15)" : i === 2 ? "rgba(252,211,77,0.12)" : "rgba(30,34,51,0.8)",
                    color: i < 2 ? "var(--accent)" : i === 2 ? "#FCD34D" : "var(--text-muted)",
                  }}
                >
                  {i + 1}
                </span>
              </td>
              <td className="py-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-base leading-none">{team.flag}</span>
                  <span
                    className="text-sm font-600 leading-tight"
                    style={{ color: i < 2 ? "var(--text-primary)" : "var(--text-secondary)" }}
                  >
                    {team.name}
                  </span>
                </span>
              </td>
              <td className="py-2 text-center">
                <span
                  className="font-display text-base"
                  style={{ color: i < 2 ? "var(--accent)" : "var(--text-primary)" }}
                >
                  {team.points}
                </span>
              </td>
              <td className="py-2 text-center text-sm" style={{ color: "var(--text-secondary)" }}>{team.played}</td>
              <td className="py-2 text-center text-sm" style={{ color: "var(--text-secondary)" }}>{team.won}</td>
              <td className="py-2 text-center text-sm" style={{ color: "var(--text-secondary)" }}>{team.drawn}</td>
              <td className="py-2 text-center text-sm" style={{ color: "var(--text-secondary)" }}>{team.lost}</td>
              <td className="py-2 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                {team.gd > 0 ? `+${team.gd}` : team.gd}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
