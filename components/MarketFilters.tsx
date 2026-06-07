import Link from "next/link";
import { CONTINENT_CONFIGS, type Continent } from "@/lib/categories";
import type { SortKey } from "@/lib/polymarket";
import { SortControls, normalizeSortKey } from "./SortControls";

type MarketFiltersProps = {
  basePath: string;
  currentContinent: Continent;
  currentSort: SortKey;
};

export function MarketFilters({ basePath, currentContinent, currentSort }: MarketFiltersProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-panel/60 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-emerald-100/45">球队区域:</span>
        {CONTINENT_CONFIGS.map((continent) => (
          <Link
            key={continent.id}
            href={`${basePath}?continent=${continent.id}&sort=${currentSort}`}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              currentContinent === continent.id
                ? "border-matrix/50 bg-matrix/10 text-matrix"
                : "border-line bg-white/[0.03] text-emerald-100/55 hover:border-matrix/30 hover:text-emerald-100"
            }`}
          >
            {continent.label}
          </Link>
        ))}
      </div>
      <SortControls current={currentSort} basePath={`${basePath}?continent=${currentContinent}`} />
    </div>
  );
}

export function normalizeContinent(value?: string): Continent {
  return CONTINENT_CONFIGS.some((continent) => continent.id === value) ? (value as Continent) : "all";
}

export { normalizeSortKey };
