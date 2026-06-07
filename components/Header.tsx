import Link from "next/link";
import { RefreshCw, Zap } from "lucide-react";
import { WorldCupLogoMark } from "@/components/WorldCupLogoMark";
import { SECTION_CONFIGS, type MarketSection } from "@/lib/categories";
import type { DashboardData } from "@/lib/polymarket";
import { formatCurrency } from "@/lib/polymarket";

type HeaderProps = {
  data: DashboardData;
  active?: "home" | MarketSection;
};

export function Header({ data, active = "home" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold text-matrix">
          <WorldCupLogoMark />
          WORLDCUP TRACKER
        </Link>

        <nav className="hidden items-center gap-1 text-xs text-emerald-100/60 md:flex">
          <NavItem href="/" active={active === "home"} icon={<Zap className="h-3.5 w-3.5" />}>
            总览
          </NavItem>
          {SECTION_CONFIGS.map((section) => (
            <NavItem key={section.id} href={section.href} active={active === section.id}>
              {section.label} {data.sections[section.id].activeCount}
            </NavItem>
          ))}
        </nav>

        <div className="flex items-center gap-3 font-mono text-[11px] text-emerald-100/60">
          <span className="hidden sm:inline">总量: {formatCurrency(data.totalVolume)}</span>
          <span className="text-amber">刚刚</span>
          <Link
            href={active === "home" ? "/" : `/markets/${active}`}
            className="inline-flex items-center gap-1 rounded border border-matrix/40 px-2 py-1 text-matrix transition hover:bg-matrix/10"
          >
            <RefreshCw className="h-3 w-3" />
            刷新
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavItem({
  href,
  active,
  icon,
  children
}: {
  href: string;
  active: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 transition ${
        active
          ? "border-matrix/50 bg-matrix/10 text-matrix"
          : "border-transparent hover:border-line hover:bg-white/5 hover:text-emerald-100"
      }`}
    >
      {icon ?? null}
      {children}
    </Link>
  );
}
