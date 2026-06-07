import type { TrackedMarket } from "./polymarket";

export type SignalLevel = "none" | "low" | "medium" | "high";

export type MispricingSignal = {
  level: SignalLevel;
  score: number;
  reasons: string[];
};

export function scoreMarket(market: TrackedMarket): MispricingSignal {
  let score = 0;
  const reasons: string[] = [];

  if (market.spread >= 0.06 && market.liquidity >= 1_000) {
    score += 24;
    reasons.push("买卖价差偏大");
  } else if (market.spread >= 0.035) {
    score += 12;
    reasons.push("价差高于常规水平");
  }

  const turnover = market.liquidity > 0 ? market.volume24hr / market.liquidity : 0;
  if (turnover >= 0.75 && market.volume24hr >= 10_000) {
    score += 22;
    reasons.push("24H 成交相对流动性过热");
  } else if (turnover >= 0.35 && market.volume24hr >= 5_000) {
    score += 10;
    reasons.push("短期成交活跃");
  }

  const monthChange = Math.abs(market.priceChange.month ?? 0);
  const weekChange = Math.abs(market.priceChange.week ?? 0);
  const dayChange = Math.abs(market.priceChange.day ?? 0);
  if (monthChange >= 0.18 || weekChange >= 0.12 || dayChange >= 0.08) {
    score += 18;
    reasons.push("近期概率变化较大");
  }

  const primary = market.outcomes[0]?.price;
  if (typeof primary === "number" && market.volume24hr >= 5_000) {
    if (primary <= 0.04 || primary >= 0.96) {
      score += 14;
      reasons.push("极端概率仍有活跃成交");
    }
  }

  if (
    typeof market.bestBid === "number" &&
    typeof market.bestAsk === "number" &&
    typeof market.lastTradePrice === "number"
  ) {
    const midpoint = (market.bestBid + market.bestAsk) / 2;
    if (Math.abs(market.lastTradePrice - midpoint) >= 0.04) {
      score += 16;
      reasons.push("最新成交偏离盘口中值");
    }
  }

  if (market.volume1mo >= 500_000 && market.liquidity < 10_000) {
    score += 12;
    reasons.push("月成交高但当前池子较浅");
  }

  return {
    level: getLevel(score),
    score,
    reasons: reasons.slice(0, 3)
  };
}

function getLevel(score: number): SignalLevel {
  if (score >= 50) {
    return "high";
  }

  if (score >= 30) {
    return "medium";
  }

  if (score >= 14) {
    return "low";
  }

  return "none";
}
