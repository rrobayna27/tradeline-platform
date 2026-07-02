// SAMPLE / ILLUSTRATIVE newsroom content. These demonstrate the article data
// model and template only. In production, every article must be an original
// synthesis of public records (permits, planning filings, commission agendas,
// press releases) with a human editorial review before publishing anything
// about real people or companies — see DECISIONS.md guardrail #4.

import type { Article } from "@/lib/types";

export const articles: Article[] = [
  {
    id: "art-baywalk-tops-out",
    headline: "Baywalk Residences tops out its 32-story tower on Biscayne Boulevard",
    slug: "baywalk-residences-tops-out-biscayne-boulevard",
    summary:
      "The 410-unit tower reached its final structural pour this week, putting the project on track for a 2027 delivery as vertical finishes begin.",
    body: `Baywalk Development Partners' 410-unit multifamily tower on Biscayne Boulevard reached a structural milestone this week, with crews completing the final concrete pour at the 32nd floor.

The project, general-contracted by Ironbridge Construction Group, began vertical construction in mid-2025 following a mat-foundation pour that took roughly 30 hours to complete. With the structure now topped out, crews will shift focus to curtain wall installation, interior framing, and MEP rough-in across the tower's residential floors.

Ground-floor retail space fronting Biscayne Boulevard is expected to be delivered as vanilla shell, with leasing to follow closer to the building's certificate of occupancy.

Subcontractors currently mobilized on site include structural steel, glazing, electrical, and HVAC trades, with additional bid packages for interior finishes expected to open in the coming months.`,
    category: "BREAKING_DEVELOPMENT",
    status: "PUBLISHED",
    projectId: "proj-baywalk-residences",
    developerId: "dev-baywalk",
    location: "Miami, FL (Miami-Dade County)",
    timelineNote: "Estimated completion Q3 2027",
    whyItMatters:
      "Baywalk Residences adds meaningful rental inventory to Miami's urban core at a moment of persistent housing demand.",
    marketImpact: "Signals continued institutional confidence in Miami multifamily despite elevated construction costs.",
    authorName: "Tradeline Newsroom",
    isSample: true,
    metaTitle: "Baywalk Residences Tops Out 32-Story Miami Tower | Tradeline",
    metaDescription: "Baywalk Development Partners' 410-unit Biscayne Boulevard tower reached its final structural pour this week.",
    publishedAt: "2026-06-21T09:00:00.000Z",
    relatedArticleIds: ["art-wynwood-arts-permit"],
    relatedProjectIds: ["proj-wynwood-arts-mixed-use"],
  },
  {
    id: "art-sabal-point-permit",
    headline: "Palm Beach County issues permit for 280-unit Sabal Point at Wellington",
    slug: "palm-beach-county-permit-sabal-point-wellington",
    summary:
      "Sabal Point Communities secured its master building permit for a garden-style apartment community west of Wellington, with bidding now open to subcontractors.",
    body: `Palm Beach County has issued the master building permit for Sabal Point at Wellington, a 280-unit garden-style apartment community proposed by Sabal Point Communities along Forest Hill Boulevard.

Sabal Point Builders, the project's general contractor, is now soliciting bids from concrete, framing, roofing, plumbing, electrical, and landscaping subcontractors ahead of an anticipated site mobilization within the next 45 days.

The community will include a clubhouse, resort-style pool, and dog park, targeting workforce-accessible rents for the western Palm Beach County submarket.`,
    category: "PERMIT_FILING",
    status: "PUBLISHED",
    projectId: "proj-sabal-point-wellington",
    developerId: "dev-sabal-point",
    location: "West Palm Beach, FL (Palm Beach County)",
    timelineNote: "Site mobilization expected within 45 days",
    whyItMatters: "One of the larger garden-style multifamily permits issued in western Palm Beach County this cycle.",
    marketImpact: "Adds workforce-accessible rental supply outside the urban core.",
    authorName: "Tradeline Newsroom",
    isSample: true,
    metaTitle: "Sabal Point at Wellington Permit Issued | Tradeline",
    metaDescription: "A 280-unit apartment community west of Wellington has received its Palm Beach County building permit.",
    publishedAt: "2026-06-02T09:00:00.000Z",
    relatedArticleIds: [],
    relatedProjectIds: [],
  },
  {
    id: "art-everline-brickell-foundation",
    headline: "Everline Tower Brickell begins mat foundation pour for 48-story tower",
    slug: "everline-tower-brickell-mat-foundation-pour",
    summary:
      "Everline Urban Development's mixed-use tower entered foundation work this week, with a continuous concrete pour scheduled over a 30-hour window.",
    body: `Everline Urban Development and general contractor Everline Construction Partners began the mat foundation pour for Everline Tower Brickell this week, a milestone that sets up vertical construction to begin later this year.

The 48-story tower will combine office, residential, and ground-floor retail uses in the Brickell financial district — one of the tallest mixed-use towers currently under construction in the submarket.

Bidding remains open for mechanical, fire protection, and elevator subcontractors as the project moves toward its structural phase.`,
    category: "NEW_PROJECT",
    status: "PUBLISHED",
    projectId: "proj-everline-tower-brickell",
    developerId: "dev-everline",
    location: "Miami, FL (Miami-Dade County)",
    timelineNote: "Estimated completion 2029",
    whyItMatters: "One of the tallest towers currently under construction in Brickell, combining three asset classes.",
    marketImpact: "Adds Class A office inventory to a submarket with historically tight vacancy.",
    authorName: "Tradeline Newsroom",
    isSample: true,
    metaTitle: "Everline Tower Brickell Begins Foundation Work | Tradeline",
    metaDescription: "The 48-story Brickell mixed-use tower has entered its foundation phase.",
    publishedAt: "2026-05-16T09:00:00.000Z",
    relatedArticleIds: ["art-baywalk-tops-out"],
    relatedProjectIds: ["proj-baywalk-residences"],
  },
  {
    id: "art-wynwood-arts-permit",
    headline: "Wynwood Arts Mixed-Use clears final permit review at 14 stories",
    slug: "wynwood-arts-mixed-use-permit-issued",
    summary:
      "The City of Miami issued the building permit for a 14-story mixed-use project bringing creative office and 180 residential units to Wynwood.",
    body: `The City of Miami has issued the building permit for Wynwood Arts Mixed-Use, a 14-story development from Everline Urban Development that will bring creative office space, gallery space, and 180 residential units to the neighborhood's evolving mid-rise skyline.

General contractor Ironbridge Construction Group is soliciting bids from concrete, steel, glazing, electrical, and plumbing subcontractors as the project prepares for site mobilization.

The project is one of the taller permitted developments within Wynwood's height-limited zoning overlay.`,
    category: "PERMIT_FILING",
    status: "PUBLISHED",
    projectId: "proj-wynwood-arts-mixed-use",
    developerId: "dev-everline",
    location: "Miami, FL (Miami-Dade County)",
    timelineNote: "Estimated completion Q3 2028",
    whyItMatters: "Continues Wynwood's evolution from low-rise arts district to mid-rise mixed-use neighborhood.",
    marketImpact: "One of the taller permitted projects within Wynwood's height-limited overlay.",
    authorName: "Tradeline Newsroom",
    isSample: true,
    metaTitle: "Wynwood Arts Mixed-Use Permit Issued | Tradeline",
    metaDescription: "A 14-story mixed-use project has cleared final permit review in Wynwood.",
    publishedAt: "2026-05-11T09:00:00.000Z",
    relatedArticleIds: ["art-baywalk-tops-out"],
    relatedProjectIds: ["proj-baywalk-residences"],
  },
  {
    id: "art-meridian-gulf-logistics-permit",
    headline: "620,000 sq ft speculative logistics center permitted near MIA",
    slug: "meridian-gulf-logistics-center-permitted",
    summary:
      "Meridian Gulf Ventures received its building permit for a cross-dock distribution facility in Doral, with subcontractor bidding now open.",
    body: `Meridian Gulf Ventures has received a Miami-Dade County building permit for a 620,000 sq ft speculative distribution facility near Miami International Airport, with general contractor Highwater Construction Co. targeting a July mobilization.

The cross-dock facility will include 40 dock doors and is expected to lease quickly given the submarket's sub-3% industrial vacancy rate.

Concrete, steel, electrical, sitework, and paving subcontractors can find bid details on the project's Tradeline page.`,
    category: "PERMIT_FILING",
    status: "PUBLISHED",
    projectId: "proj-meridian-gulf-logistics",
    developerId: "dev-meridian-gulf",
    location: "Doral, FL (Miami-Dade County)",
    timelineNote: "Estimated completion 2027",
    whyItMatters: "Adds significant Class A industrial supply near MIA at a time of historically low vacancy.",
    marketImpact: "Expected to lease quickly given the submarket's tight vacancy.",
    authorName: "Tradeline Newsroom",
    isSample: true,
    metaTitle: "Doral Logistics Center Permitted Near MIA | Tradeline",
    metaDescription: "A 620,000 sq ft distribution facility has been permitted in Doral near Miami International Airport.",
    publishedAt: "2026-05-31T09:00:00.000Z",
    relatedArticleIds: [],
    relatedProjectIds: ["proj-doral-commons-retail"],
  },
  {
    id: "art-delray-innovation-workshop",
    headline: "Delray Beach planning board workshops proposed trades-education campus",
    slug: "delray-beach-planning-board-innovation-campus-workshop",
    summary:
      "Palmetto Row Developers presented an early master plan for a vocational training campus aimed at South Florida's skilled-labor shortage.",
    body: `Delray Beach's planning board held a workshop session this week on an early master plan for Delray Innovation Campus, a proposed vocational training facility from Palmetto Row Developers focused on skilled-trades education.

The project, developed in partnership with regional workforce boards, is intended to directly address the skilled-labor shortage affecting South Florida's construction industry — a constraint cited repeatedly by general contractors bidding on active projects across the region.

No formal site plan has been filed; the developer indicated a submission is expected within the next two quarters.`,
    category: "COMMISSION_MEETING",
    status: "PUBLISHED",
    projectId: "proj-delray-innovation-campus",
    developerId: "dev-palmetto-row",
    location: "Delray Beach, FL (Palm Beach County)",
    timelineNote: "Formal site plan expected within two quarters",
    whyItMatters: "Directly targets the skilled-labor shortage affecting South Florida's construction industry.",
    marketImpact: "Could meaningfully expand the regional pipeline of licensed trade workers over the next decade.",
    authorName: "Tradeline Newsroom",
    isSample: true,
    metaTitle: "Delray Beach Workshops Trades-Education Campus Plan | Tradeline",
    metaDescription: "Palmetto Row Developers presented an early master plan for a skilled-trades training campus.",
    publishedAt: "2026-05-21T09:00:00.000Z",
    relatedArticleIds: [],
    relatedProjectIds: [],
  },
  {
    id: "art-market-stats-q2",
    headline: "Southeast Florida construction pipeline holds steady in Q2",
    slug: "southeast-florida-construction-pipeline-q2-market-update",
    summary:
      "A look at active permits, breaking-ground activity, and completions across Miami-Dade, Broward, Palm Beach, and Monroe counties this quarter.",
    body: `Southeast Florida's active construction pipeline held largely steady in the second quarter, with multifamily and industrial remaining the two most active project types by permitted value across Miami-Dade, Broward, Palm Beach, and Monroe counties.

Industrial permitting near Miami International Airport and along the Turnpike corridor continued to outpace other segments, reflecting persistently low vacancy in the region's distribution and logistics submarkets.

Multifamily activity remained concentrated in urban infill locations — Brickell, Wynwood, and downtown Fort Lauderdale among them — alongside continued garden-style development in western Palm Beach County.

Office activity remained comparatively muted, though several boutique-scale projects moved forward in Coral Gables and downtown Fort Lauderdale, suggesting selective tenant demand for smaller, amenitized office product.`,
    category: "MARKET_ANALYSIS",
    status: "PUBLISHED",
    location: "Southeast Florida",
    timelineNote: "Q2 2026",
    whyItMatters: "Gives subcontractors and GCs a regional read on where bid volume is concentrated this quarter.",
    marketImpact: "Industrial and multifamily remain the most active segments; office activity stays selective.",
    authorName: "Tradeline Newsroom",
    isSample: true,
    metaTitle: "Southeast Florida Construction Market Update, Q2 2026 | Tradeline",
    metaDescription: "Active permits, breaking-ground activity, and completions across Southeast Florida this quarter.",
    publishedAt: "2026-06-25T09:00:00.000Z",
    relatedArticleIds: ["art-meridian-gulf-logistics-permit", "art-baywalk-tops-out"],
    relatedProjectIds: [],
  },
  {
    id: "art-pompano-public-safety-complete",
    headline: "Pompano Beach opens new public safety complex after two-year build",
    slug: "pompano-beach-public-safety-complex-opens",
    summary:
      "The city's new fire-rescue and police headquarters received its certificate of occupancy, replacing a facility built in the 1970s.",
    body: `Pompano Beach's new public safety complex received its certificate of occupancy this week, capping a roughly two-year construction process led by general contractor Tri-County General Contracting.

The facility replaces a fire-rescue and police headquarters building originally constructed in the 1970s, and is expected to serve as a benchmark cost basis for future municipal public-safety construction across Broward County.

Move-in for city staff is scheduled for the coming quarter.`,
    category: "NEW_PROJECT",
    status: "PUBLISHED",
    projectId: "proj-pompano-public-safety",
    location: "Pompano Beach, FL (Broward County)",
    timelineNote: "Completed Q1 2026",
    whyItMatters: "Demonstrates continued municipal capital investment in public safety infrastructure.",
    marketImpact: "Sets a benchmark cost basis for future municipal public-safety construction in Broward County.",
    authorName: "Tradeline Newsroom",
    isSample: true,
    metaTitle: "Pompano Beach Public Safety Complex Opens | Tradeline",
    metaDescription: "A new fire-rescue and police headquarters has received its certificate of occupancy in Pompano Beach.",
    publishedAt: "2026-03-02T09:00:00.000Z",
    relatedArticleIds: [],
    relatedProjectIds: [],
  },
  {
    id: "art-key-west-harbor-hold",
    headline: "Key West Harbor Village paused pending revised environmental review",
    slug: "key-west-harbor-village-paused-environmental-review",
    summary:
      "Coral Harbor Group's proposed mixed-use harbor village remains on hold more than a year after an initial environmental resource permit review.",
    body: `Key West Harbor Village, a proposed mixed-use development from Coral Harbor Group combining retail, marina expansion, and workforce housing, remains paused pending a revised environmental resource permit review.

The delay has left a prominent harbor-front parcel undeveloped for more than 18 months, illustrating the regulatory complexity facing waterfront development proposals in the Florida Keys.

Coral Harbor Group has not indicated a revised timeline for resubmission.`,
    category: "POLICY_REGULATION",
    status: "PUBLISHED",
    projectId: "proj-key-west-harbor-village",
    developerId: "dev-coral-harbor",
    location: "Key West, FL (Monroe County)",
    timelineNote: "On hold since late 2025",
    whyItMatters: "Highlights the regulatory complexity of waterfront development in the Florida Keys.",
    marketImpact: "Delay has left a prominent harbor-front parcel undeveloped for over 18 months.",
    authorName: "Tradeline Newsroom",
    isSample: true,
    metaTitle: "Key West Harbor Village Remains On Hold | Tradeline",
    metaDescription: "A proposed mixed-use harbor village in Key West remains paused pending environmental review.",
    publishedAt: "2026-01-15T09:00:00.000Z",
    relatedArticleIds: [],
    relatedProjectIds: [],
  },
];

export const articleById = new Map(articles.map((a) => [a.id, a]));
export const articleBySlug = new Map(articles.map((a) => [a.slug, a]));
