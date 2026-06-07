import { formatPercent, type OutcomePrice } from "@/lib/polymarket";

type ProbabilityBarProps = {
  outcomes: OutcomePrice[];
};

export function ProbabilityBar({ outcomes }: ProbabilityBarProps) {
  if (!outcomes.length) {
    return <p className="text-xs text-emerald-100/45">暂无概率数据</p>;
  }

  const total = outcomes.reduce((sum, outcome) => sum + Math.max(outcome.price, 0), 0) || 1;

  return (
    <div className="space-y-2">
      <div className="flex overflow-hidden rounded-full border border-line bg-black/30">
        {outcomes.map((outcome, index) => (
          <div
            key={`${outcome.label}-${index}`}
            className={index === 0 ? "h-2 bg-matrix" : "h-2 bg-cyan/70"}
            style={{ width: `${Math.max((outcome.price / total) * 100, 1)}%` }}
          />
        ))}
      </div>
      <div className="grid gap-1 text-xs text-emerald-100/70 sm:grid-cols-2">
        {outcomes.slice(0, 4).map((outcome) => (
          <div key={outcome.label} className="flex items-center justify-between gap-2">
            <span className="truncate">{outcome.label}</span>
            <span className="font-mono text-emerald-50">{formatPercent(outcome.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
