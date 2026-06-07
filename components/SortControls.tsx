import Link from "next/link";
import type { SortKey } from "@/lib/polymarket";

const OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "volume1mo", label: "月交易量" },
  { key: "volume24hr", label: "24H量" },
  { key: "liquidity", label: "流动性" },
  { key: "priceChange", label: "概率变化" },
  { key: "signal", label: "错配度" }
];

type SortControlsProps = {
  current: SortKey;
  basePath: string;
};

export function SortControls({ current, basePath }: SortControlsProps) {
  const separator = basePath.includes("?") ? "&" : "?";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs text-emerald-100/45">排序方式:</span>
      {OPTIONS.map((option) => (
        <Link
          key={option.key}
          href={`${basePath}${separator}sort=${option.key}`}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            current === option.key
              ? "border-matrix/50 bg-matrix/10 text-matrix"
              : "border-line bg-white/[0.03] text-emerald-100/55 hover:border-matrix/30 hover:text-emerald-100"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

export function normalizeSortKey(value?: string): SortKey {
  return OPTIONS.some((option) => option.key === value) ? (value as SortKey) : "volume1mo";
}
