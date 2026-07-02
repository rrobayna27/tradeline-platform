export const SITE_NAME = "Tradeline";
export const SITE_TAGLINE = "South Florida's construction intelligence platform";
export const SITE_DESCRIPTION =
  "Original construction and commercial real estate news, a live project database, and general contractor + subcontractor directories for South Florida.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tradelinefl.com";

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  PROPOSED: "Proposed",
  PLANNING: "Planning",
  APPROVED: "Approved",
  PERMITTED: "Permitted",
  SITE_WORK: "Site Work",
  FOUNDATION: "Foundation",
  VERTICAL_CONSTRUCTION: "Vertical Construction",
  TOPPED_OUT: "Topped Out",
  FINISHING: "Finishing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ON_HOLD: "On Hold",
};

export const PROJECT_STATUS_COLOR_VAR: Record<string, string> = {
  PROPOSED: "--color-status-proposed",
  PLANNING: "--color-status-planning",
  APPROVED: "--color-status-approved",
  PERMITTED: "--color-status-permitted",
  SITE_WORK: "--color-status-sitework",
  FOUNDATION: "--color-status-foundation",
  VERTICAL_CONSTRUCTION: "--color-status-vertical",
  TOPPED_OUT: "--color-status-topped-out",
  FINISHING: "--color-status-finishing",
  COMPLETED: "--color-status-completed",
  CANCELLED: "--color-status-cancelled",
  ON_HOLD: "--color-status-onhold",
};

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  RESIDENTIAL_SINGLE_FAMILY: "Residential",
  MULTIFAMILY: "Multifamily",
  MIXED_USE: "Mixed-Use",
  OFFICE: "Office",
  RETAIL: "Retail",
  INDUSTRIAL: "Industrial",
  HOSPITALITY: "Hospitality",
  HEALTHCARE: "Healthcare",
  EDUCATION: "Education",
  GOVERNMENT_INSTITUTIONAL: "Government / Institutional",
  INFRASTRUCTURE: "Infrastructure",
  RELIGIOUS: "Religious",
  OTHER: "Other",
};

export const METRO_LABELS: Record<string, string> = {
  SOUTHEAST: "Southeast Florida",
  TREASURE_COAST: "Treasure Coast",
  SOUTHWEST: "Southwest Florida",
  TAMPA_BAY: "Tampa Bay",
  ORLANDO_CENTRAL: "Orlando / Central Florida",
};

export const ARTICLE_CATEGORY_LABELS: Record<string, string> = {
  BREAKING_DEVELOPMENT: "Breaking Development",
  NEW_PROJECT: "New Project",
  PERMIT_FILING: "Permit Filing",
  COMMISSION_MEETING: "Commission Meeting",
  MARKET_ANALYSIS: "Market Analysis",
  COMPANY_NEWS: "Company News",
  POLICY_REGULATION: "Policy & Regulation",
};

export const TRADE_CATEGORIES = [
  "Concrete",
  "Electrical",
  "Mechanical",
  "HVAC",
  "Plumbing",
  "Roofing",
  "Painting",
  "Drywall",
  "Framing",
  "Steel",
  "Masonry",
  "Glass & Glazing",
  "Flooring",
  "Landscaping",
  "Fire Protection",
  "Elevators",
  "Sitework",
  "Utilities",
  "Earthwork",
  "Paving",
  "Millwork",
] as const;

export const NAV_LINKS = [
  { href: "/news", label: "News" },
  { href: "/projects", label: "Projects" },
  { href: "/map", label: "Map" },
  { href: "/general-contractors", label: "General Contractors" },
  { href: "/subcontractors", label: "Subcontractors" },
] as const;
