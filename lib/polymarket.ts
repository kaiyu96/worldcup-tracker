import {
  SECTION_CONFIGS,
  detectContinent,
  classifyWorldCupSections,
  isWorldCupMarket,
  type Continent,
  type MarketSection
} from "./categories";
import { scoreMarket, type MispricingSignal } from "./signals";

const GAMMA_MARKETS_URL = "https://gamma-api.polymarket.com/markets";
const PAGE_SIZE = 100;
const MAX_PAGES = 60;
const BATCH_SIZE = 8;
const REVALIDATE_SECONDS = 300;

export type SortKey = "volume1mo" | "volume" | "liquidity" | "volume24hr" | "priceChange" | "signal";

export type GammaMarket = {
  id: string;
  question?: string;
  slug?: string;
  description?: string;
  outcomes?: string;
  outcomePrices?: string;
  volume?: string;
  liquidity?: string;
  endDate?: string;
  endDateIso?: string;
  active?: boolean;
  closed?: boolean;
  image?: string;
  icon?: string;
  volumeNum?: number;
  liquidityNum?: number;
  volume24hr?: number;
  volume1wk?: number;
  volume1mo?: number;
  volume1yr?: number;
  spread?: number;
  oneDayPriceChange?: number;
  oneHourPriceChange?: number;
  oneWeekPriceChange?: number;
  oneMonthPriceChange?: number;
  lastTradePrice?: number;
  bestBid?: number;
  bestAsk?: number;
  events?: Array<{
    title?: string;
    slug?: string;
    description?: string;
    volume?: number;
    liquidity?: number;
    volume24hr?: number;
    volume1mo?: number;
  }>;
};

export type OutcomePrice = {
  label: string;
  price: number;
};

export type TrackedMarket = {
  id: string;
  question: string;
  slug?: string;
  sections: MarketSection[];
  primarySection: MarketSection;
  continent: Continent;
  outcomes: OutcomePrice[];
  volume: number;
  volume24hr: number;
  volume1mo: number;
  liquidity: number;
  spread: number;
  lastTradePrice?: number;
  bestBid?: number;
  bestAsk?: number;
  priceChange: {
    hour?: number;
    day?: number;
    week?: number;
    month?: number;
  };
  endDate?: string;
  image?: string;
  eventTitle?: string;
  signal: MispricingSignal;
};

export type CategorySummary = {
  section: MarketSection;
  label: string;
  description: string;
  markets: TrackedMarket[];
  topMarkets: TrackedMarket[];
  activeCount: number;
  totalVolume: number;
  volume24hr: number;
  monthlyVolume: number;
  totalLiquidity: number;
  signalCount: number;
};

export type DashboardData = {
  sections: Record<MarketSection, CategorySummary>;
  allMarkets: TrackedMarket[];
  totalVolume: number;
  totalLiquidity: number;
  volume24hr: number;
  signalCount: number;
  lastUpdated: string;
};

export async function fetchGammaPage(offset = 0, limit = PAGE_SIZE): Promise<GammaMarket[]> {
  const url = new URL(GAMMA_MARKETS_URL);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("active", "true");
  url.searchParams.set("closed", "false");
  url.searchParams.set("offset", String(offset));

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: {
      accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Gamma API request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;
  return Array.isArray(data) ? (data as GammaMarket[]) : [];
}

export async function fetchAllGammaMarkets(): Promise<GammaMarket[]> {
  const markets: GammaMarket[] = [];

  for (let page = 0; page < MAX_PAGES; page += BATCH_SIZE) {
    const batch = Array.from({ length: Math.min(BATCH_SIZE, MAX_PAGES - page) }, (_, index) =>
      fetchGammaPage((page + index) * PAGE_SIZE, PAGE_SIZE)
    );
    const pages = await Promise.all(batch);
    markets.push(...pages.flat());

    if (pages.some((pageMarkets) => pageMarkets.length < PAGE_SIZE)) {
      break;
    }
  }

  return markets;
}

export async function getDashboardData(): Promise<DashboardData> {
  const gammaMarkets = await fetchAllGammaMarkets();
  const tracked = gammaMarkets
    .filter(isWorldCupMarket)
    .map(toTrackedMarket)
    .filter((market): market is TrackedMarket => Boolean(market));

  const champion = buildSummary("champion", tracked);
  const advancement = buildSummary("advancement", tracked);
  const team = buildSummary("team", tracked);
  const player = buildSummary("player", tracked);
  const movement = buildSummary("movement", tracked);

  return {
    sections: { champion, advancement, team, player, movement },
    allMarkets: tracked,
    totalVolume: sum(tracked, "volume"),
    totalLiquidity: sum(tracked, "liquidity"),
    volume24hr: sum(tracked, "volume24hr"),
    signalCount: movement.activeCount,
    lastUpdated: new Date().toISOString()
  };
}

export function getSortedMarkets(markets: TrackedMarket[], sortKey: SortKey = "volume1mo"): TrackedMarket[] {
  return [...markets].sort((a, b) => getSortValue(b, sortKey) - getSortValue(a, sortKey));
}

export function filterByContinent(markets: TrackedMarket[], continent: Continent): TrackedMarket[] {
  if (continent === "all") {
    return markets;
  }

  return markets.filter((market) => market.continent === continent);
}

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "$0";
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }

  return `$${value.toFixed(0)}`;
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) {
    return "0.0%";
  }

  return `${(value * 100).toFixed(value >= 0.01 ? 1 : 2)}%`;
}

function buildSummary(section: MarketSection, markets: TrackedMarket[]): CategorySummary {
  const categoryMarkets =
    section === "movement"
      ? markets.filter(isMovementMarket)
      : markets.filter((market) => market.sections.includes(section));
  const sorted = getSortedMarkets(categoryMarkets, "volume1mo");
  const config = SECTION_CONFIGS.find((item) => item.id === section);

  return {
    section,
    label: config?.label ?? section,
    description: config?.description ?? "",
    markets: categoryMarkets,
    topMarkets: sorted.slice(0, 20),
    activeCount: categoryMarkets.length,
    totalVolume: sum(categoryMarkets, "volume"),
    volume24hr: sum(categoryMarkets, "volume24hr"),
    monthlyVolume: sum(categoryMarkets, "volume1mo"),
    totalLiquidity: sum(categoryMarkets, "liquidity"),
    signalCount: categoryMarkets.filter((market) => market.signal.level !== "none").length
  };
}

function toTrackedMarket(market: GammaMarket): TrackedMarket | null {
  const sections = classifyWorldCupSections(market);

  if (!sections.length) {
    return null;
  }

  const outcomes = parseOutcomes(market.outcomes, market.outcomePrices);
  const tracked: TrackedMarket = {
    id: market.id,
    question: market.question?.trim() || "Untitled market",
    slug: market.slug,
    sections,
    primarySection: sections[0],
    continent: detectContinent(market),
    outcomes,
    volume: numberFrom(market.volumeNum, market.volume),
    volume24hr: numberFrom(market.volume24hr),
    volume1mo: numberFrom(market.volume1mo),
    liquidity: numberFrom(market.liquidityNum, market.liquidity),
    spread: numberFrom(market.spread),
    lastTradePrice: optionalNumber(market.lastTradePrice),
    bestBid: optionalNumber(market.bestBid),
    bestAsk: optionalNumber(market.bestAsk),
    priceChange: {
      hour: optionalNumber(market.oneHourPriceChange),
      day: optionalNumber(market.oneDayPriceChange),
      week: optionalNumber(market.oneWeekPriceChange),
      month: optionalNumber(market.oneMonthPriceChange)
    },
    endDate: market.endDateIso || market.endDate,
    image: market.image || market.icon,
    eventTitle: market.events?.[0]?.title,
    signal: { level: "none", score: 0, reasons: [] }
  };

  tracked.signal = scoreMarket(tracked);
  return tracked;
}

function parseOutcomes(outcomesValue?: string, pricesValue?: string): OutcomePrice[] {
  const outcomes = parseStringArray(outcomesValue);
  const prices = parseStringArray(pricesValue).map((price) => Number(price));

  if (!outcomes.length || outcomes.length !== prices.length) {
    return [];
  }

  return outcomes.map((label, index) => ({
    label,
    price: Number.isFinite(prices[index]) ? prices[index] : 0
  }));
}

function parseStringArray(value?: string): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function getSortValue(market: TrackedMarket, sortKey: SortKey): number {
  switch (sortKey) {
    case "volume":
      return market.volume;
    case "liquidity":
      return market.liquidity;
    case "volume24hr":
      return market.volume24hr;
    case "priceChange":
      return getPriceChangeMagnitude(market);
    case "signal":
      return market.signal.score;
    case "volume1mo":
    default:
      return market.volume1mo;
  }
}

function isMovementMarket(market: TrackedMarket): boolean {
  const turnover = market.liquidity > 0 ? market.volume24hr / market.liquidity : 0;

  return (
    market.signal.level !== "none" ||
    getPriceChangeMagnitude(market) >= 0.08 ||
    turnover >= 0.35 ||
    market.spread >= 0.035
  );
}

function getPriceChangeMagnitude(market: TrackedMarket): number {
  return Math.max(
    Math.abs(market.priceChange.hour ?? 0),
    Math.abs(market.priceChange.day ?? 0),
    Math.abs(market.priceChange.week ?? 0),
    Math.abs(market.priceChange.month ?? 0)
  );
}

function sum(markets: TrackedMarket[], key: "volume" | "volume1mo" | "liquidity" | "volume24hr"): number {
  return markets.reduce((total, market) => total + market[key], 0);
}

function numberFrom(primary?: number, fallback?: string): number {
  if (typeof primary === "number" && Number.isFinite(primary)) {
    return primary;
  }

  const parsed = Number(fallback);
  return Number.isFinite(parsed) ? parsed : 0;
}

function optionalNumber(value?: number): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
