import type { Trade } from "@/lib/types";
import { TRADE_CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export const trades: Trade[] = TRADE_CATEGORIES.map((name) => ({
  id: `trade-${slugify(name)}`,
  name,
  slug: slugify(name),
}));

export const tradeById = new Map(trades.map((t) => [t.id, t]));
export const tradeBySlug = new Map(trades.map((t) => [t.slug, t]));
