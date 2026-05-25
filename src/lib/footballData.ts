import { prisma } from "@/lib/prisma";

const API_BASE = "https://api.football-data.org/v4";
const COMPETITION_CODE = "WC";
const SEASON = 2026;
const SYNC_COOLDOWN_MS = 30_000;

// Football-Data uses English team names; map them to our Portuguese names.
const TEAM_NAME_MAP: Record<string, string> = {
  Mexico: "México",
  "South Africa": "África do Sul",
  "South Korea": "Coreia do Sul",
  "Korea Republic": "Coreia do Sul",
  Czechia: "República Tcheca",
  "Czech Republic": "República Tcheca",
  Canada: "Canadá",
  "Bosnia-Herzegovina": "Bósnia e Herzegovina",
  "Bosnia and Herzegovina": "Bósnia e Herzegovina",
  Switzerland: "Suíça",
  Qatar: "Catar",
  Brazil: "Brasil",
  Morocco: "Marrocos",
  Scotland: "Escócia",
  Haiti: "Haiti",
  USA: "Estados Unidos",
  "United States": "Estados Unidos",
  Australia: "Austrália",
  Turkey: "Turquia",
  Türkiye: "Turquia",
  Paraguay: "Paraguai",
  Germany: "Alemanha",
  "Ivory Coast": "Costa do Marfim",
  "Côte d'Ivoire": "Costa do Marfim",
  Ecuador: "Equador",
  Curaçao: "Curaçao",
  Curacao: "Curaçao",
  Netherlands: "Países Baixos",
  Japan: "Japão",
  Sweden: "Suécia",
  Tunisia: "Tunísia",
  Belgium: "Bélgica",
  Iran: "Irã",
  "New Zealand": "Nova Zelândia",
  Egypt: "Egito",
  Spain: "Espanha",
  "Saudi Arabia": "Arábia Saudita",
  Uruguay: "Uruguai",
  "Cape Verde": "Cabo Verde",
  France: "França",
  Senegal: "Senegal",
  Argentina: "Argentina",
  Croatia: "Croácia",
  Colombia: "Colômbia",
  Portugal: "Portugal",
  Norway: "Noruega",
  "DR Congo": "RD Congo",
  "Democratic Republic of the Congo": "RD Congo",
  Congo: "RD Congo",
  Algeria: "Argélia",
  Ghana: "Gana",
  England: "Inglaterra",
  Iraq: "Iraque",
  Jordan: "Jordânia",
  Panama: "Panamá",
  Austria: "Áustria",
  Uzbekistan: "Uzbequistão",
};

type ApiScore = { home: number | null; away: number | null };
type ApiTeam = { id: number | null; name: string | null };
type ApiMatch = {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
  score: { fullTime: ApiScore };
};
type ApiResponse = { matches: ApiMatch[] };

function mapStatus(apiStatus: string): string {
  switch (apiStatus) {
    case "IN_PLAY":
    case "PAUSED":
      return "live";
    case "FINISHED":
    case "AWARDED":
      return "finished";
    default:
      return "scheduled";
  }
}

function translate(name: string | null): string | null {
  if (!name) return null;
  return TEAM_NAME_MAP[name] ?? name;
}

let lastSyncAt = 0;
let inFlight: Promise<SyncResult> | null = null;

export type SyncResult = {
  ok: boolean;
  reason?: string;
  updated: number;
  liveCount: number;
  fetchedAt: string;
};

export async function syncMatchesFromFootballData(
  force = false
): Promise<SyncResult> {
  const now = Date.now();
  if (!force && now - lastSyncAt < SYNC_COOLDOWN_MS) {
    return {
      ok: true,
      reason: "cooldown",
      updated: 0,
      liveCount: 0,
      fetchedAt: new Date(lastSyncAt).toISOString(),
    };
  }
  if (inFlight) return inFlight;

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      reason: "missing_api_key",
      updated: 0,
      liveCount: 0,
      fetchedAt: new Date().toISOString(),
    };
  }

  inFlight = (async () => {
    try {
      const res = await fetch(
        `${API_BASE}/competitions/${COMPETITION_CODE}/matches?season=${SEASON}`,
        {
          headers: { "X-Auth-Token": apiKey },
          cache: "no-store",
        }
      );
      if (!res.ok) {
        return {
          ok: false,
          reason: `http_${res.status}`,
          updated: 0,
          liveCount: 0,
          fetchedAt: new Date().toISOString(),
        };
      }
      const data = (await res.json()) as ApiResponse;
      let updated = 0;
      let liveCount = 0;

      for (const m of data.matches) {
        const homePt = translate(m.homeTeam?.name);
        const awayPt = translate(m.awayTeam?.name);
        if (!homePt || !awayPt) continue;

        const status = mapStatus(m.status);
        if (status === "live") liveCount++;

        const matchDate = new Date(m.utcDate);
        const windowStart = new Date(matchDate.getTime() - 6 * 60 * 60 * 1000);
        const windowEnd = new Date(matchDate.getTime() + 6 * 60 * 60 * 1000);

        const dbMatch = await prisma.match.findFirst({
          where: {
            homeTeam: { name: homePt },
            awayTeam: { name: awayPt },
            date: { gte: windowStart, lte: windowEnd },
          },
          select: {
            id: true,
            status: true,
            homeScore: true,
            awayScore: true,
          },
        });
        if (!dbMatch) continue;

        const home = m.score.fullTime.home;
        const away = m.score.fullTime.away;
        const changed =
          dbMatch.status !== status ||
          dbMatch.homeScore !== home ||
          dbMatch.awayScore !== away;
        if (!changed) continue;

        await prisma.match.update({
          where: { id: dbMatch.id },
          data: { status, homeScore: home, awayScore: away },
        });
        updated++;
      }

      lastSyncAt = Date.now();
      return {
        ok: true,
        updated,
        liveCount,
        fetchedAt: new Date(lastSyncAt).toISOString(),
      };
    } catch (err) {
      return {
        ok: false,
        reason: err instanceof Error ? err.message : "unknown_error",
        updated: 0,
        liveCount: 0,
        fetchedAt: new Date().toISOString(),
      };
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
