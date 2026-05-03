import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

function formatDateBR(dateStr: Date | string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatTimeBR(dateStr: Date | string) {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CountdownDisplay({ targetDate }: { targetDate: Date }) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
        <span className="font-display text-xl" style={{ color: "var(--accent)" }}>Jogo em andamento!</span>
      </div>
    );
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="flex gap-3 justify-center">
      {[
        { value: days, label: "dias" },
        { value: hours, label: "horas" },
        { value: minutes, label: "min" },
      ].map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="text-center">
            <div
              className="font-display text-4xl sm:text-5xl rounded-2xl px-4 py-3 min-w-[70px] tabular-nums"
              style={{
                background: "#1A1F2E",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-sm font-body mt-1.5" style={{ color: "var(--text-muted)" }}>
              {label}
            </div>
          </div>
          {i < 2 && (
            <span className="font-display text-2xl mb-5" style={{ color: "var(--text-muted)" }}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const now = new Date();

  const nextBrasil = await prisma.match.findFirst({
    where: {
      date: { gt: now },
      OR: [
        { homeTeam: { name: "Brasil" } },
        { awayTeam: { name: "Brasil" } },
      ],
    },
    orderBy: { date: "asc" },
    include: { homeTeam: true, awayTeam: true, stadium: true },
  });

  const nextMatches = await prisma.match.findMany({
    where: { date: { gt: now } },
    orderBy: { date: "asc" },
    take: 6,
    include: { homeTeam: true, awayTeam: true, stadium: true },
  });

  const totalMatches = await prisma.match.count();
  const finishedMatches = await prisma.match.count({ where: { homeScore: { not: null } } });
  const teamCount = await prisma.team.count();
  const stadiumCount = await prisma.stadium.count();

  return (
    <div className="space-y-8">
      {/* Hero header */}
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <Image
            src="/trofeu.png"
            alt="Troféu Copa do Mundo"
            width={80}
            height={100}
            className="drop-shadow-lg"
          />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-2">
          <span style={{ color: "var(--accent)" }}>Copa do Mundo</span>
          <br />
          <span style={{ color: "var(--text-primary)" }}>FIFA 2026™</span>
        </h1>
        <p className="font-body text-base mt-2" style={{ color: "var(--text-secondary)" }}>
          EUA · Canadá · México &nbsp;·&nbsp; 11 Jun — 19 Jul 2026
        </p>
      </div>

      {/* Brasil countdown */}
      {nextBrasil && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(35,253,166,0.08) 0%, #131620 100%)",
            border: "1px solid rgba(35,253,166,0.25)",
            boxShadow: "0 0 32px rgba(35,253,166,0.08)",
          }}
        >
          <div className="text-center mb-4">
            <span
              className="badge mb-3"
              style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
            >
              🇧🇷 Próximo jogo do Brasil
            </span>
            <div
              className="font-display text-xl mt-2"
              style={{ color: "var(--text-primary)" }}
            >
              {nextBrasil.homeTeam?.flag} {nextBrasil.homeTeam?.name ?? nextBrasil.tbd1}
              <span style={{ color: "var(--text-muted)" }} className="mx-2">×</span>
              {nextBrasil.awayTeam?.name ?? nextBrasil.tbd2} {nextBrasil.awayTeam?.flag}
            </div>
            <p className="font-body text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {formatDateBR(nextBrasil.date)} às {formatTimeBR(nextBrasil.date)} (Brasília) · {nextBrasil.stadium.city}
            </p>
          </div>
          <CountdownDisplay targetDate={nextBrasil.date} />
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Seleções", value: teamCount, icon: "/camisa.png", accent: false, size: 44 },
          { label: "Jogos", value: totalMatches, icon: "/campo.png", accent: false, size: 52 },
          { label: "Cidades-sede", value: stadiumCount, icon: "/estadio.png", accent: false, size: 52 },
          { label: "Jogos registrados", value: finishedMatches, icon: "/placar.png", accent: true, size: 52 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: stat.accent ? "var(--accent-dim)" : "var(--bg-card)",
              border: `1px solid ${stat.accent ? "rgba(35,253,166,0.25)" : "var(--border)"}`,
            }}
          >
            <div className="shrink-0">
              <Image src={stat.icon} alt={stat.label} width={stat.size} height={stat.size} style={{ objectFit: "contain" }} />
            </div>
            <div>
              <div
                className="font-display text-3xl leading-none"
                style={{ color: stat.accent ? "var(--accent)" : "var(--text-primary)" }}
              >
                {stat.value}
              </div>
              <div className="text-sm font-body mt-1" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next matches list */}
      <div>
        <h2 className="font-display text-2xl mb-4" style={{ color: "var(--text-primary)" }}>
          Próximos jogos
        </h2>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {nextMatches.map((match, i) => {
            const isBrasil =
              match.homeTeam?.name === "Brasil" || match.awayTeam?.name === "Brasil";
            const homeName = match.homeTeam?.name ?? match.tbd1 ?? "A definir";
            const awayName = match.awayTeam?.name ?? match.tbd2 ?? "A definir";

            return (
              <div
                key={match.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors"
                style={{
                  background: isBrasil ? "rgba(35,253,166,0.05)" : i % 2 === 0 ? "var(--bg-card)" : "#111420",
                  borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  borderLeft: isBrasil ? "3px solid var(--accent)" : "3px solid transparent",
                }}
              >
                <div className="w-20 shrink-0">
                  <div className="font-display text-base" style={{ color: "var(--text-primary)" }}>
                    {formatTimeBR(match.date)}
                  </div>
                  <div className="text-[12px] font-body mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {formatDateBR(match.date)}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center gap-2 text-base font-body font-600">
                  <span>{match.homeTeam?.flag ?? "—"}</span>
                  <span style={{ color: "var(--text-primary)" }}>{homeName}</span>
                  <span style={{ color: "var(--text-muted)" }}>×</span>
                  <span style={{ color: "var(--text-primary)" }}>{awayName}</span>
                  <span>{match.awayTeam?.flag ?? "—"}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-body" style={{ color: "var(--text-muted)" }}>
                    {match.stadium.city}
                  </span>
                  {isBrasil && (
                    <span
                      className="badge"
                      style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                    >
                      BRA
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick navigation cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/grupos", label: "Grupos", desc: "12 grupos · 48 seleções", color: "#4F9CF9", bg: "rgba(79,156,249,0.08)" },
          { href: "/jogos", label: "Jogos", desc: "104 partidas completas", color: "#818CF8", bg: "rgba(129,140,248,0.08)" },
          { href: "/matamata", label: "Mata-mata", desc: "16 avos até a Final", color: "#FCD34D", bg: "rgba(252,211,77,0.08)" },
          { href: "/brasil", label: "Brasil 🇧🇷", desc: "Grupo C · 5x campeão", color: "var(--accent)", bg: "var(--accent-dim)" },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl p-4 quick-nav-card"
            style={{
              background: card.bg,
              border: `1px solid ${card.color}30`,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div
              className="font-display text-lg mb-1"
              style={{ color: card.color }}
            >
              {card.label}
            </div>
            <div
              className="text-sm font-body"
              style={{ color: "var(--text-muted)" }}
            >
              {card.desc}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
