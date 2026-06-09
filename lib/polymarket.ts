export type MarketPoint = {
  label: string;
  probability: number;
};

export type PolymarketSnapshot = {
  fetchedAt: string;
  fedJune: MarketPoint[];
  coreCpiMay: MarketPoint[];
};

const FED_EVENT_SLUG = "fed-decision-in-june-825";
const CPI_EVENT_SLUG = "core-cpi-yoy-may-2026";

function titleCaseLabel(label: string): string {
  return label
    .replace("no change", "No Change")
    .replace("25 bps cut", "25 bps Cut")
    .replace("25 bps hike", "25 bps Hike")
    .replace("50+ bps cut", "50+ bps Cut")
    .replace("50+ bps hike", "50+ bps Hike");
}

function parsePrices(outcomesRaw: string, pricesRaw: string): number | null {
  try {
    const outcomes = JSON.parse(outcomesRaw) as string[];
    const prices = JSON.parse(pricesRaw) as string[];
    const yesIndex = outcomes.findIndex((o) => o.toLowerCase() === "yes");
    if (yesIndex === -1) return null;
    return Math.round(parseFloat(prices[yesIndex]) * 1000) / 10;
  } catch {
    return null;
  }
}

const FALLBACK: PolymarketSnapshot = {
  fetchedAt: new Date().toISOString(),
  fedJune: [
    { label: "No Change", probability: 99.1 },
    { label: "25 bps Cut", probability: 0.5 },
    { label: "25 bps Hike", probability: 0.6 },
    { label: "50+ bps Cut", probability: 0.2 },
    { label: "50+ bps Hike", probability: 0.1 },
  ],
  coreCpiMay: [
    { label: "≤2.4%", probability: 1.5 },
    { label: "2.5%", probability: 3.6 },
    { label: "2.6%", probability: 3.4 },
    { label: "2.7%", probability: 3.4 },
    { label: "2.8%", probability: 51.5 },
    { label: "2.9%", probability: 31.5 },
    { label: "3.0%", probability: 3.3 },
    { label: "3.1%", probability: 3.2 },
    { label: "3.2%", probability: 1.9 },
    { label: "≥3.3%", probability: 2.9 },
  ],
};

async function fetchEvent(slug: string) {
  const res = await fetch(`https://gamma-api.polymarket.com/events/slug/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getPolymarketSnapshot(): Promise<PolymarketSnapshot> {
  try {
    const [fedEvent, cpiEvent] = await Promise.all([
      fetchEvent(FED_EVENT_SLUG),
      fetchEvent(CPI_EVENT_SLUG),
    ]);

    const fedJune: MarketPoint[] = [];
    if (fedEvent?.markets) {
      for (const market of fedEvent.markets) {
        const probability = parsePrices(market.outcomes, market.outcomePrices);
        const label = (market.groupItemTitle || market.question || "")
          .toLowerCase()
          .replace("25 bps decrease", "25 bps cut")
          .replace("25 bps increase", "25 bps hike")
          .replace("50+ bps decrease", "50+ bps cut")
          .replace("50+ bps increase", "50+ bps hike");
        if (probability !== null && label) {
          fedJune.push({ label: titleCaseLabel(label), probability });
        }
      }
      fedJune.sort((a, b) => b.probability - a.probability);
    }

    const coreCpiMay: MarketPoint[] = [];
    if (cpiEvent?.markets) {
      const bucketOrder = ["≤2.4%", "2.5%", "2.6%", "2.7%", "2.8%", "2.9%", "3.0%", "3.1%", "3.2%", "≥3.3%"];
      const byLabel = new Map<string, number>();
      for (const market of cpiEvent.markets) {
        const probability = parsePrices(market.outcomes, market.outcomePrices);
        const label = market.groupItemTitle || "";
        if (probability !== null && label) {
          byLabel.set(label, probability);
        }
      }
      for (const label of bucketOrder) {
        const probability = byLabel.get(label);
        if (probability !== undefined) {
          coreCpiMay.push({ label, probability });
        }
      }
    }

    if (!fedJune.length && !coreCpiMay.length) {
      return { ...FALLBACK, fetchedAt: new Date().toISOString() };
    }

    return {
      fetchedAt: new Date().toISOString(),
      fedJune: fedJune.length ? fedJune : FALLBACK.fedJune,
      coreCpiMay: coreCpiMay.length ? coreCpiMay : FALLBACK.coreCpiMay,
    };
  } catch {
    return { ...FALLBACK, fetchedAt: new Date().toISOString() };
  }
}
