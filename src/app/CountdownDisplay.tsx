"use client";

import { useState, useEffect } from "react";

export default function CountdownDisplay({ targetDate }: { targetDate: string }) {
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      setDiff(new Date(targetDate).getTime() - Date.now());
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const labels = ["dias", "horas", "min"] as const;

  if (diff === null) {
    return (
      <div className="flex gap-3 justify-center">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="text-center">
              <div
                className="font-display text-4xl sm:text-5xl rounded-2xl px-4 py-3 min-w-[70px] tabular-nums"
                style={{ background: "#1A1F2E", color: "var(--text-primary)", border: "1px solid var(--border)" }}
              >
                --
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
              style={{ background: "#1A1F2E", color: "var(--text-primary)", border: "1px solid var(--border)" }}
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
