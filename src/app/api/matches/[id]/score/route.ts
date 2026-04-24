import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json();
  const { homeScore, awayScore } = body;

  if (typeof homeScore !== "number" || typeof awayScore !== "number") {
    return NextResponse.json({ error: "Invalid scores" }, { status: 400 });
  }

  if (homeScore < 0 || awayScore < 0 || homeScore > 99 || awayScore > 99) {
    return NextResponse.json({ error: "Scores out of range" }, { status: 400 });
  }

  const match = await prisma.match.update({
    where: { id },
    data: {
      homeScore,
      awayScore,
      status: "finished",
    },
  });

  return NextResponse.json(match);
}
