import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncMatchesFromFootballData } from "@/lib/footballData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phase = searchParams.get("phase");
  const group = searchParams.get("group");

  syncMatchesFromFootballData().catch(() => {});

  const matches = await prisma.match.findMany({
    where: {
      ...(phase ? { phase } : {}),
      ...(group ? { group } : {}),
    },
    orderBy: { date: "asc" },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
  });

  return NextResponse.json(
    matches.map((m) => ({
      ...m,
      date: m.date.toISOString(),
    }))
  );
}
