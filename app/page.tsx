import { AlertTriangle, Database, Trophy, Users, Waves } from "lucide-react";
import { CategorySection } from "@/components/CategorySection";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { WorldCupHeroVisual } from "@/components/WorldCupHeroVisual";
import { formatCurrency, getDashboardData } from "@/lib/polymarket";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <>
      <Header data={data} active="home" />
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-line bg-panel/60 p-6 shadow-glow md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-mono text-sm text-matrix">&gt; worldcup-tracker / polymarket radar</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-emerald-50 md:text-6xl">
                2026 世界杯预测市场追踪
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-emerald-100/60">
                专注追踪 Polymarket 上 2026 FIFA World Cup 的冠军、晋级、球队、球员和交易异动市场，聚合概率分布、资金池、
                成交变化与错配观察信号。
              </p>
              <div className="mt-6 rounded-2xl border border-matrix/20 bg-black/30 p-4 font-mono text-xs text-emerald-100/55">
                <p>&gt; 获取世界杯相关活跃市场</p>
                <p>&gt; 分类冠军、晋级、球队与球员主题</p>
                <p>&gt; 运行交易异动与错配检测</p>
                <p className="mt-3 text-matrix">last_update: {new Date(data.lastUpdated).toLocaleString("zh-CN")}</p>
              </div>
            </div>
            <WorldCupHeroVisual />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="世界杯市场" value={String(data.allMarkets.length)} helper="Gamma API 公开市场" />
          <StatCard label="总交易量" value={formatCurrency(data.totalVolume)} helper="世界杯相关市场合计" />
          <StatCard label="24H交易量" value={formatCurrency(data.volume24hr)} helper="短期资金热度" />
          <StatCard label="交易异动" value={String(data.signalCount)} helper="错配与异常观察信号" />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <PulseCard
            icon={<Trophy className="h-5 w-5" />}
            title="冠军市场"
            value={formatCurrency(data.sections.champion.monthlyVolume)}
            helper={`${data.sections.champion.activeCount} 个冠军相关盘口`}
          />
          <PulseCard
            icon={<Users className="h-5 w-5" />}
            title="球队追踪"
            value={formatCurrency(data.sections.team.monthlyVolume)}
            helper={`${data.sections.team.activeCount} 个球队表现盘口`}
          />
          <PulseCard
            icon={<AlertTriangle className="h-5 w-5" />}
            title="交易异动"
            value={formatCurrency(data.sections.movement.volume24hr)}
            helper={`${data.sections.movement.activeCount} 个异常信号`}
          />
        </section>

        <CategorySection summary={data.sections.champion} limit={20} basePath="/markets/champion" />
        <CategorySection summary={data.sections.movement} limit={10} sortKey="signal" basePath="/markets/movement" />
      </main>
    </>
  );
}

function PulseCard({
  icon,
  title,
  value,
  helper
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel/70 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-matrix">
          {icon}
          <span className="font-mono text-xs uppercase tracking-[0.2em]">{title}</span>
        </div>
        <Waves className="h-4 w-4 text-emerald-100/30" />
      </div>
      <p className="mt-5 text-3xl font-semibold text-emerald-50">{value}</p>
      <p className="mt-2 text-sm text-emerald-100/50">{helper}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100/45">
        <Database className="h-3.5 w-3.5" />
        <span>Gamma API 月交易量</span>
        <AlertTriangle className="ml-auto h-3.5 w-3.5 text-amber" />
      </div>
    </div>
  );
}
