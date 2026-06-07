import type { GammaMarket } from "./polymarket";

export type MarketSection = "champion" | "advancement" | "team" | "player" | "movement";
export type Continent = "all" | "europe" | "south-america" | "asia" | "africa" | "north-america";

export type SectionConfig = {
  id: MarketSection;
  label: string;
  description: string;
  href: string;
};

export type ContinentConfig = {
  id: Continent;
  label: string;
};

export const SECTION_CONFIGS: SectionConfig[] = [
  {
    id: "champion",
    label: "冠军市场",
    description: "追踪 2026 FIFA World Cup 冠军相关预测市场",
    href: "/markets/champion"
  },
  {
    id: "advancement",
    label: "晋级市场",
    description: "追踪出线、晋级、淘汰赛路径和具体赛程相关预测市场",
    href: "/markets/advancement"
  },
  {
    id: "team",
    label: "球队追踪",
    description: "追踪国家队表现、排名、进球、爆冷和出局相关预测市场",
    href: "/markets/team"
  },
  {
    id: "player",
    label: "球员相关",
    description: "追踪球员奖项、进球助攻、伤病、阵容和教练相关预测市场",
    href: "/markets/player"
  },
  {
    id: "movement",
    label: "交易异动",
    description: "追踪成交激增、概率大幅变化、流动性变浅和价差扩大等市场信号",
    href: "/markets/movement"
  }
];

export const CONTINENT_CONFIGS: ContinentConfig[] = [
  { id: "all", label: "全部球队" },
  { id: "europe", label: "欧洲" },
  { id: "south-america", label: "南美" },
  { id: "asia", label: "亚洲" },
  { id: "africa", label: "非洲" },
  { id: "north-america", label: "北美" }
];

const WORLDCUP_KEYWORDS = [
  "2026 fifa world cup",
  "fifa world cup",
  "world cup winner",
  "world cup champion",
  "world cup",
  "fifa"
];

const CHAMPION_KEYWORDS = [
  "win the 2026 fifa world cup",
  "win the fifa world cup",
  "world cup winner",
  "world cup champion",
  "winner of the 2026 fifa world cup"
];

const ADVANCEMENT_KEYWORDS = [
  "qualify",
  "advance",
  "advancement",
  "round of 16",
  "quarterfinal",
  "quarter-final",
  "semifinal",
  "semi-final",
  "final",
  "knockout",
  "group stage",
  "win group",
  "top group",
  "finish first",
  "reach the",
  "make the"
];

const TEAM_KEYWORDS = [
  "team",
  "country",
  "national team",
  "points",
  "goals",
  "goal difference",
  "clean sheet",
  "unbeaten",
  "upset",
  "eliminated",
  "group",
  "finish"
];

const PLAYER_KEYWORDS = [
  "ballon d'or",
  "golden boot",
  "golden ball",
  "best young player",
  "top scorer",
  "score",
  "assist",
  "starter",
  "start",
  "injury",
  "injured",
  "squad",
  "lineup",
  "coach",
  "manager",
  "red card",
  "yellow card",
  "penalty",
  "mvp",
  "ronaldo",
  "messi",
  "mbappe",
  "haaland",
  "vinicius",
  "bellingham",
  "yamal",
  "salah",
  "kane",
  "neymar"
];

const CONTINENT_TEAMS: Record<Exclude<Continent, "all">, string[]> = {
  europe: [
    "france",
    "england",
    "spain",
    "germany",
    "portugal",
    "netherlands",
    "croatia",
    "belgium",
    "italy",
    "denmark",
    "switzerland",
    "austria",
    "norway",
    "scotland",
    "turkiye",
    "turkey",
    "serbia",
    "poland",
    "ukraine"
  ],
  "south-america": [
    "argentina",
    "brazil",
    "uruguay",
    "colombia",
    "ecuador",
    "chile",
    "peru",
    "paraguay",
    "bolivia",
    "venezuela"
  ],
  asia: [
    "japan",
    "south korea",
    "korea",
    "australia",
    "iran",
    "saudi arabia",
    "qatar",
    "iraq",
    "uzbekistan",
    "china",
    "new zealand"
  ],
  africa: [
    "morocco",
    "senegal",
    "egypt",
    "nigeria",
    "ghana",
    "ivory coast",
    "cote d'ivoire",
    "algeria",
    "tunisia",
    "cameroon",
    "south africa",
    "cape verde",
    "congo dr"
  ],
  "north-america": [
    "usa",
    "united states",
    "mexico",
    "canada",
    "costa rica",
    "panama",
    "jamaica",
    "honduras",
    "haiti"
  ]
};

export function isWorldCupMarket(market: GammaMarket): boolean {
  const text = getMarketText(market);

  return scoreKeywords(text, WORLDCUP_KEYWORDS) > 0 && !text.includes("club world cup");
}

export function classifyWorldCupSections(market: GammaMarket): MarketSection[] {
  const text = getMarketText(market);
  const listingText = getMarketListingText(market);
  const sections = new Set<MarketSection>();

  if (scoreKeywords(listingText, CHAMPION_KEYWORDS) > 0) {
    sections.add("champion");
  }

  if (scoreKeywords(text, ADVANCEMENT_KEYWORDS) > 0) {
    sections.add("advancement");
  }

  if (scoreKeywords(text, PLAYER_KEYWORDS) > 0) {
    sections.add("player");
  }

  if (scoreKeywords(text, TEAM_KEYWORDS) > 0 || detectContinent(market) !== "all") {
    sections.add("team");
  }

  if (!sections.size) {
    sections.add("team");
  }

  return Array.from(sections);
}

export function detectContinent(market: GammaMarket): Continent {
  const text = getMarketListingText(market);
  const matches = Object.entries(CONTINENT_TEAMS)
    .map(([continent, teams]) => ({
      continent: continent as Exclude<Continent, "all">,
      score: scoreKeywords(text, teams)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return matches[0]?.continent ?? "all";
}

export function getSectionConfig(id: string): SectionConfig | undefined {
  return SECTION_CONFIGS.find((section) => section.id === id);
}

export function getContinentConfig(id: string): ContinentConfig | undefined {
  return CONTINENT_CONFIGS.find((continent) => continent.id === id);
}

function getMarketListingText(market: GammaMarket): string {
  return [market.question, market.slug, market.events?.[0]?.title, market.events?.[0]?.slug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getMarketText(market: GammaMarket): string {
  return [
    market.question,
    market.slug,
    market.description,
    market.events?.[0]?.title,
    market.events?.[0]?.slug,
    market.events?.[0]?.description
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function scoreKeywords(text: string, keywords: string[]): number {
  return keywords.reduce((score, keyword) => {
    const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(keyword)}([^a-z0-9]|$)`, "i");

    if (!pattern.test(text)) {
      return score;
    }

    return score + (keyword.length <= 3 ? 1 : 2);
  }, 0);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
