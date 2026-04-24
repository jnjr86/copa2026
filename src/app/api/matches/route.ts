import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phase = searchParams.get("phase");
  const group = searchParams.get("group");

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
