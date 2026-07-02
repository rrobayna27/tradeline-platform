// SAMPLE / ILLUSTRATIVE geography seed data.
// Southeast Florida (Miami-Dade, Broward, Palm Beach, Monroe) is the launch
// metro and is marked isLive. Other metros exist as preview/sample rows so
// the app is geography-aware statewide from day one ("build national
// architecture, launch local" — see DECISIONS.md).

import type { City, County } from "@/lib/types";

export const counties: County[] = [
  { id: "county-miami-dade", name: "Miami-Dade County", slug: "miami-dade", metro: "SOUTHEAST", state: "FL", isLive: true },
  { id: "county-broward", name: "Broward County", slug: "broward", metro: "SOUTHEAST", state: "FL", isLive: true },
  { id: "county-palm-beach", name: "Palm Beach County", slug: "palm-beach", metro: "SOUTHEAST", state: "FL", isLive: true },
  { id: "county-monroe", name: "Monroe County", slug: "monroe", metro: "SOUTHEAST", state: "FL", isLive: true },
  { id: "county-martin", name: "Martin County", slug: "martin", metro: "TREASURE_COAST", state: "FL", isLive: false },
  { id: "county-st-lucie", name: "St. Lucie County", slug: "st-lucie", metro: "TREASURE_COAST", state: "FL", isLive: false },
  { id: "county-lee", name: "Lee County", slug: "lee", metro: "SOUTHWEST", state: "FL", isLive: false },
  { id: "county-collier", name: "Collier County", slug: "collier", metro: "SOUTHWEST", state: "FL", isLive: false },
  { id: "county-hillsborough", name: "Hillsborough County", slug: "hillsborough", metro: "TAMPA_BAY", state: "FL", isLive: false },
  { id: "county-orange", name: "Orange County", slug: "orange", metro: "ORLANDO_CENTRAL", state: "FL", isLive: false },
];

export const cities: (City & { name: string; lat: number; lng: number })[] = [
  // Miami-Dade
  { id: "city-miami", name: "Miami", slug: "miami", countyId: "county-miami-dade", lat: 25.7617, lng: -80.1918 },
  { id: "city-miami-beach", name: "Miami Beach", slug: "miami-beach", countyId: "county-miami-dade", lat: 25.7907, lng: -80.1300 },
  { id: "city-coral-gables", name: "Coral Gables", slug: "coral-gables", countyId: "county-miami-dade", lat: 25.7215, lng: -80.2684 },
  { id: "city-doral", name: "Doral", slug: "doral", countyId: "county-miami-dade", lat: 25.8195, lng: -80.3553 },
  { id: "city-hialeah", name: "Hialeah", slug: "hialeah", countyId: "county-miami-dade", lat: 25.8576, lng: -80.2781 },
  // Broward
  { id: "city-fort-lauderdale", name: "Fort Lauderdale", slug: "fort-lauderdale", countyId: "county-broward", lat: 26.1224, lng: -80.1373 },
  { id: "city-hollywood", name: "Hollywood", slug: "hollywood", countyId: "county-broward", lat: 26.0112, lng: -80.1495 },
  { id: "city-pompano-beach", name: "Pompano Beach", slug: "pompano-beach", countyId: "county-broward", lat: 26.2379, lng: -80.1248 },
  { id: "city-davie", name: "Davie", slug: "davie", countyId: "county-broward", lat: 26.0765, lng: -80.2521 },
  // Palm Beach
  { id: "city-west-palm-beach", name: "West Palm Beach", slug: "west-palm-beach", countyId: "county-palm-beach", lat: 26.7153, lng: -80.0534 },
  { id: "city-boca-raton", name: "Boca Raton", slug: "boca-raton", countyId: "county-palm-beach", lat: 26.3683, lng: -80.1289 },
  { id: "city-delray-beach", name: "Delray Beach", slug: "delray-beach", countyId: "county-palm-beach", lat: 26.4615, lng: -80.0728 },
  { id: "city-boynton-beach", name: "Boynton Beach", slug: "boynton-beach", countyId: "county-palm-beach", lat: 26.5254, lng: -80.0665 },
  // Monroe
  { id: "city-key-west", name: "Key West", slug: "key-west", countyId: "county-monroe", lat: 24.5551, lng: -81.7800 },
];

export const cityById = new Map(cities.map((c) => [c.id, c]));
export const countyById = new Map(counties.map((c) => [c.id, c]));
export const countyBySlug = new Map(counties.map((c) => [c.slug, c]));
export const cityBySlug = new Map(cities.map((c) => [c.slug, c]));
