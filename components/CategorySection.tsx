import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CategorySummary, SortKey } from "@/lib/polymarket";
import { formatCurrency, getSortedMarkets } from "@/lib/polymarket";
import { MarketCard } from "./MarketCard";
import { SortControls } from "./SortControls";

type CategorySectionProps = {
  summary: CategorySummary;
  limit?: number;
  sortKey?: SortKey;
  showSort?: boolean;
  basePath: string;
};

export function CategorySection({
  summary,
  limit = 20,
  sortKey = "volume1mo",
  showSort = false,
  basePath
}: CategorySectionProps) {
  const markets = getSortedMarkets(summary.markets, sortKey).slice(0, limit);

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs text-matrix">&gt; {summary.description}</p>
          <h2 className="mt-2 text-2xl font-semibold text-emerald-50">{summary.label} Top {limit}</h2>
          <p className="mt-2 text-sm text-emerald-100/50">
            {summary.activeCount} 个活跃市场 · 月交易量 {formatCurrency(summary.monthlyVolume)} · 流动性{" "}
            {formatCurrency(summary.totalLiquidity)}
          </p>
        </div>
        {showSort ? (
          <SortControls current={sortKey} basePath={basePath} />
        ) : (
          <Link href={basePath} className="inline-flex items-center gap-1 text-sm text-matrix hover:text-emerald-50">
            查看全部
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {markets.length ? (
        <div className="grid gap-4">
          {markets.map((market, index) => (
            <MarketCard key={market.id} market={market} rank={index + 1} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-panel/70 p-8 text-center text-emerald-100/50">
          暂未从 Gamma API 匹配到该分类市场。
        </div>
      )}
    </section>
  );
}
