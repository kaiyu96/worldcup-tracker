import { notFound } from "next/navigation";
import { CategorySection } from "@/components/CategorySection";
import { Header } from "@/components/Header";
import { MarketFilters, normalizeContinent, normalizeSortKey } from "@/components/MarketFilters";
import { StatCard } from "@/components/StatCard";
import { getSectionConfig, type MarketSection } from "@/lib/categories";
import {
  filterByContinent,
  formatCurrency,
  getDashboardData,
  type CategorySummary,
  type TrackedMarket
} from "@/lib/polymarket";

export const revalidate = 300;
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    section: string;
  }>;
  searchParams?: Promise<{
    continent?: string;
    sort?: string;
  }>;
};

export default async function MarketSectionPage({ params, searchParams }: PageProps) {
  const [{ section }, resolvedSearchParams, data] = await Promise.all([params, searchParams, getDashboardData()]);
  const config = getSectionConfig(section);

  if (!config) {
    notFound();
  }

  const continent = normalizeContinent(resolvedSearchParams?.continent);
  const sortKey = normalizeSortKey(resolvedSearchParams?.sort);
  const filteredMarkets = filterByContinent(data.sections[config.id].markets, continent);
  const summary = buildFilteredSummary(config.id, config.label, config.description, filteredMarkets);

  return (
    <>
      <Header data={data} active={config.id} />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <p className="font-mono text-sm text-matrix">&gt; markets / {config.id}</p>
          <h1 className="mt-3 text-4xl font-semibold text-emerald-50">{config.label}</h1>
          <p className="mt-3 max-w-3xl text-emerald-100/55">{config.description}。</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="活跃市场" value={String(summary.activeCount)} />
          <StatCard label="月交易量" value={formatCurrency(summary.monthlyVolume)} />
          <StatCard label="24H交易量" value={formatCurrency(summary.volume24hr)} />
          <StatCard label="错配信号" value={String(summary.signalCount)} />
        </section>

        <MarketFilters basePath={config.href} currentContinent={continent} currentSort={sortKey} />
        <CategorySection summary={summary} limit={20} sortKey={sortKey} showSort={false} basePath={config.href} />
      </main>
    </>
  );
}

function buildFilteredSummary(
  section: MarketSection,
  label: string,
  description: string,
  markets: TrackedMarket[]
): CategorySummary {
  return {
    section,
    label,
    description,
    markets,
    topMarkets: markets.slice(0, 20),
    activeCount: markets.length,
    totalVolume: sum(markets, "volume"),
    volume24hr: sum(markets, "volume24hr"),
    monthlyVolume: sum(markets, "volume1mo"),
    totalLiquidity: sum(markets, "liquidity"),
    signalCount: markets.filter((market) => market.signal.level !== "none").length
  };
}

function sum(markets: TrackedMarket[], key: "volume" | "volume1mo" | "liquidity" | "volume24hr"): number {
  return markets.reduce((total, market) => total + market[key], 0);
}
