export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toDbName } from "@/lib/team-name-map";

const API_HOST = "api-football-v1.p.rapidapi.com";
const WC_LEAGUE = 1;   // FIFA World Cup
const WC_SEASON = 2026;

interface ApiFixture {
  fixture: { id: number; date: string; status: { short: string } };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: { home: number | null; away: number | null };
}

async function fetchFinishedFixtures(apiKey: string): Promise<ApiFixture[]> {
  const url = `https://${API_HOST}/v3/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}&status=FT`;
  const res = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": API_HOST,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  return json.response as ApiFixture[];
}

export async function GET(req: NextRequest) {
  // Validate cron secret so only Vercel (or you) can trigger this
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RAPIDAPI_KEY not configured" }, { status: 500 });
  }

  let fixtures: ApiFixture[];
  try {
    fixtures = await fetchFinishedFixtures(apiKey);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }

  if (!fixtures.length) {
    return NextResponse.json({ synced: 0, message: "No finished fixtures yet" });
  }

  // Load all DB matches with their teams
  const dbMatches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
  });

  let synced = 0;
  let skipped = 0;

  for (const fix of fixtures) {
    const homeDb = toDbName(fix.teams.home.name);
    const awayDb = toDbName(fix.teams.away.name);
    const homeGoals = fix.goals.home;
    const awayGoals = fix.goals.away;

    if (homeGoals === null || awayGoals === null) { skipped++; continue; }

    const match = dbMatches.find(
      (m) => m.homeTeam?.name === homeDb && m.awayTeam?.name === awayDb
    );

    if (!match) { skipped++; continue; }

    // Skip if score is already correct
    if (match.homeScore === homeGoals && match.awayScore === awayGoals) { skipped++; continue; }

    await prisma.match.update({
      where: { id: match.id },
      data: { homeScore: homeGoals, awayScore: awayGoals, status: "finished" },
    });
    synced++;
  }

  return NextResponse.json({
    synced,
    skipped,
    total: fixtures.length,
    timestamp: new Date().toISOString(),
  });
}
