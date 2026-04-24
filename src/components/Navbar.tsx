"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const links = [
  { href: "/", label: "Dashboard", mobileLabel: "Home", icon: "⊞" },
  { href: "/grupos", label: "Grupos", mobileLabel: "Grupos", icon: "◫" },
  { href: "/jogos", label: "Jogos", mobileLabel: "Jogos", icon: "◉" },
  { href: "/matamata", label: "Mata-mata", mobileLabel: "Bracket", icon: "◈" },
  { href: "/brasil", label: "Brasil 🇧🇷", mobileLabel: "Brasil", icon: "★" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top navbar */}
      <nav
        className="hidden sm:flex sticky top-0 z-50 items-center justify-between px-6 h-16 border-b"
        style={{
          background: "#0E1018",
          borderColor: "var(--border)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/trofeu.png"
            alt="Troféu Copa do Mundo"
            width={28}
            height={74}
            className="transition-all duration-300 group-hover:scale-110"
          />
          <div className="leading-none">
            <span
              className="font-display text-xl tracking-tight"
              style={{ color: "var(--accent)" }}
            >
              Copa
            </span>
            <span className="font-display text-xl tracking-tight text-white"> 2026</span>
          </div>
          <span
            className="text-sm font-body font-600 px-2 py-0.5 rounded-full border ml-1"
            style={{
              color: "var(--accent)",
              borderColor: "var(--accent-dim)",
              background: "var(--accent-dim)",
            }}
          >
            FIFA World Cup™
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 rounded-lg text-base font-body font-600 transition-all duration-200"
                style={{
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  background: active ? "var(--accent-dim)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLElement).style.background = "#1A1F2E";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right badge */}
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "var(--accent)" }}
          />
          <span className="font-body" style={{ color: "var(--text-secondary)" }}>
            11 Jun – 19 Jul 2026
          </span>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div
        className="sm:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-50 border-b"
        style={{ background: "#0E1018", borderColor: "var(--border)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image src="/trofeu.png" alt="Troféu" width={20} height={53} />
          <span className="font-display text-lg" style={{ color: "var(--accent)" }}>
            Copa
          </span>
          <span className="font-display text-lg text-white">2026</span>
        </Link>
        <span
          className="text-sm font-body px-2 py-1 rounded-full"
          style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
        >
          FIFA WC™
        </span>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t"
        style={{ background: "#0E1018", borderColor: "var(--border)" }}
      >
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all"
              style={{
                color: active ? "var(--accent)" : "var(--text-secondary)",
                background: active ? "var(--accent-dim)" : "transparent",
              }}
            >
              <span className="text-base leading-none">{link.icon}</span>
              <span className="text-[12px] font-body font-600 leading-none mt-1">
                {link.mobileLabel}
              </span>
              {active && (
                <span
                  className="absolute top-0 w-8 h-0.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
