import Link from "next/link";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { CONTINENT_CONFIGS, SECTION_CONFIGS } from "@/lib/categories";
import { formatCurrency, type TrackedMarket } from "@/lib/polymarket";
import { ProbabilityBar } from "./ProbabilityBar";

type MarketCardProps = {
  market: TrackedMarket;
  rank: number;
};

const signalStyles = {
  none: "border-emerald-100/10 bg-white/[0.03] text-emerald-100/45",
  low: "border-cyan/30 bg-cyan/10 text-cyan",
  medium: "border-amber/40 bg-amber/10 text-amber",
  high: "border-red-400/40 bg-red-400/10 text-red-200"
};

export function MarketCard({ market, rank }: MarketCardProps) {
  const href = `https://polymarket.com/search?query=${encodeURIComponent(market.question)}`;
  const endDate = market.endDate ? new Date(market.endDate).toLocaleDateString("zh-CN") : "未公布";
  const sectionLabel = SECTION_CONFIGS.find((section) => section.id === market.primarySection)?.label ?? "世界杯";
  const continentLabel = CONTINENT_CONFIGS.find((continent) => continent.id === market.continent)?.label;

  return (
    <article className="group rounded-2xl border border-line bg-panel/80 p-4 shadow-glow transition hover:border-matrix/40 hover:bg-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-matrix">#{rank}</span>
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-100/55">
              {sectionLabel}
            </span>
            {continentLabel && market.continent !== "all" ? (
              <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-emerald-100/45">
                {continentLabel}
              </span>
            ) : null}
            <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${signalStyles[market.signal.level]}`}>
              {market.signal.level === "none" ? "无明显错配" : `错配 ${market.signal.score}`}
            </span>
          </div>
          <h3 className="text-base font-semibold leading-snug text-emerald-50">{market.question}</h3>
          {market.eventTitle ? <p className="mt-1 text-xs text-emerald-100/45">{market.eventTitle}</p> : null}
        </div>
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-line p-2 text-emerald-100/50 transition group-hover:border-matrix/40 group-hover:text-matrix"
          aria-label="Open on Polymarket"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4">
        <ProbabilityBar outcomes={market.outcomes} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <Metric label="月交易量" value={formatCurrency(market.volume1mo)} />
        <Metric label="总交易量" value={formatCurrency(market.volume)} />
        <Metric label="流动性" value={formatCurrency(market.liquidity)} />
        <Metric label="24小时" value={formatCurrency(market.volume24hr)} />
      </dl>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-3 text-xs text-emerald-100/45">
        <span>截止 {endDate}</span>
        {market.signal.reasons.length ? (
          <span className="inline-flex items-center gap-1 text-amber">
            <AlertTriangle className="h-3.5 w-3.5" />
            {market.signal.reasons.join(" / ")}
          </span>
        ) : (
          <span>盘口暂无异常信号</span>
        )}
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-emerald-100/40">{label}</dt>
      <dd className="mt-1 font-mono text-emerald-50">{value}</dd>
    </div>
  );
}
