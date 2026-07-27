const ESCALA_COMPLETA = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

export default function SizeRun({ sizes, compact = false }) {
  const disponibles = new Set(
    (sizes || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
  );

  return (
    <div className={`flex flex-wrap gap-1 ${compact ? "gap-1" : "gap-1.5"}`}>
      {ESCALA_COMPLETA.map((talla) => {
        const activo = disponibles.has(talla);
        return (
          <span
            key={talla}
            className={[
              "flex items-center justify-center rounded-sm border font-body text-[10px] font-semibold",
              compact ? "h-6 w-6" : "h-8 w-8 text-xs",
              activo
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted/40 line-through",
            ].join(" ")}
          >
            {talla}
          </span>
        );
      })}
    </div>
  );
}
