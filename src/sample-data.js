

export const categories = [
  { id: "c1", slug: "national", name: "National", color: "#b91c1c" },
  { id: "c2", slug: "state", name: "State", color: "#c2410c" },
  { id: "c3", slug: "city", name: "City", color: "#a16207" },
  { id: "c4", slug: "world", name: "World", color: "#1d4ed8" },
  { id: "c5", slug: "business", name: "Business", color: "#047857" },
  { id: "c6", slug: "sports", name: "Sports", color: "#7c3aed" },
  { id: "c7", slug: "entertainment", name: "Entertainment", color: "#be185d" },
  { id: "c8", slug: "technology", name: "Technology", color: "#0e7490" },
  { id: "c9", slug: "opinion", name: "Opinion", color: "#374151" },
];

const cat = (slug) => categories.find((c) => c.slug === slug);

export const authors = [
  { id: "a1", slug: "ananya-rao", name: "Ananya Rao", role: "Senior Correspondent", bio: "Covers politics, governance and public policy. Has reported from over 20 states in a decade-long career." },
  { id: "a2", slug: "vikram-sethi", name: "Vikram Sethi", role: "Business Editor", bio: "Writes on markets, startups and the economy. Former analyst turned journalist." },
  { id: "a3", slug: "meera-kulkarni", name: "Meera Kulkarni", role: "Sports Reporter", bio: "Follows cricket, football and athletics across the country and abroad." },
  { id: "a4", slug: "rohan-das", name: "Rohan Das", role: "Technology Writer", bio: "Explains how technology changes everyday life, from phones to public infrastructure." },
  { id: "a5", slug: "farah-khan", name: "Farah Khan", role: "City Reporter", bio: "Reports on civic issues, transport and life in the city." },
  { id: "a6", slug: "editorial-board", name: "Editorial Board", role: "Simana Sandesh", bio: "The considered view of Simana Sandesh on matters of public importance." },
];
const au = (slug) => authors.find((a) => a.slug === slug);

const img = (seed, alt, caption) => ({
  url: `https://picsum.photos/seed/${seed}/1200/750`,
  alt,
  caption,
  credit: "Simana Sandesh Photo",
  publicId: "",
});

function body(lede, points, quote) {
  const blocks = [{ type: "paragraph", text: lede }];
  points.forEach((p, i) => {
    blocks.push({ type: "paragraph", text: p });
    if (i === 1 && quote) blocks.push({ type: "quote", text: quote[0], cite: quote[1] });
    if (i === 2) blocks.push({ type: "heading", text: "What happens next" });
  });
  blocks.push({
    type: "paragraph",
    text: "Simana Sandesh will continue to follow this story and update readers as more details become available. Readers can share information with our newsroom through the contact page.",
  });
  return blocks;
}

const hoursAgo = (h) => new Date(Date.now() - h * 3600_000).toISOString();

export const articles = [
  {
    id: "1",
    slug: "border-districts-get-new-connectivity-package",
    title: "Border districts to get ₹4,200-crore connectivity package for roads, mobile towers and bridges",
    excerpt: "The plan covers 38 districts along the frontier and promises all-weather roads to every village with more than 250 residents by 2028.",
    content: body(
      "The Union government on Tuesday announced a ₹4,200-crore package to improve roads, mobile coverage and bridges in 38 border districts, calling it the largest single investment in frontier connectivity in a decade.",
      [
        "Officials said the first phase will focus on villages that remain cut off for several months each year because of snow, landslides or flooding. More than 1,100 kilometres of road are to be upgraded to all-weather standards.",
        "The package also includes 2,600 new mobile towers, which officials said would bring 4G coverage to around 9,000 villages that currently have little or no signal.",
        "Work on the first set of projects is expected to begin before the end of the year. District collectors have been asked to submit prioritised lists within 45 days.",
        "Local representatives welcomed the move but asked for regular public updates on progress, pointing to earlier schemes that had stalled after the announcement stage.",
      ],
      ["For families in these villages, a road is not a convenience. It is the difference between reaching a hospital in time or not.", "A district official"]
    ),
    coverImage: img("border-road", "A mountain road winding through a border district", "A road under construction in a border district. The new package targets all-weather access by 2028."),
    category: cat("national"),
    author: au("ananya-rao"),
    tags: ["Infrastructure", "Border Areas", "Connectivity"],
    location: "New Delhi",
    publishedAt: hoursAgo(1),
    readingTime: 5,
    views: 48210,
    isFeatured: true,
    isBreaking: true,
  },
  {
    id: "2",
    slug: "monsoon-rainfall-ends-above-normal",
    title: "Monsoon ends 8% above normal; reservoirs at highest level in five years",
    excerpt: "Good rains lift hopes for the rabi crop, though six districts still report deficits.",
    content: body(
      "The southwest monsoon season closed with rainfall 8% above the long-period average, the weather department said on Monday.",
      [
        "Storage in major reservoirs stands at 86% of capacity, the highest for this time of year since 2021.",
        "Farm groups said the soil moisture should support sowing of wheat, mustard and gram in the coming weeks.",
        "However, six districts ended the season with deficits of more than 20%, and officials said drought relief assessments would continue there.",
      ]
    ),
    coverImage: img("monsoon-fields", "Green fields under monsoon clouds"),
    category: cat("state"),
    author: au("ananya-rao"),
    tags: ["Monsoon", "Agriculture", "Weather"],
    location: "Jaipur",
    publishedAt: hoursAgo(3),
    readingTime: 4,
    views: 22100,
    isFeatured: true,
  },
  {
    id: "3",
    slug: "sensex-hits-record-high-it-banking-rally",
    title: "Sensex closes at record high as IT and banking stocks rally",
    excerpt: "Foreign investors return for a third straight week; rupee firms slightly against the dollar.",
    content: body(
      "Benchmark indices closed at record highs on Tuesday, led by strong buying in information technology and private bank shares.",
      [
        "Market participants attributed the rally to steady foreign inflows and expectations of healthy quarterly earnings.",
        "Mid-cap and small-cap indices lagged the benchmarks, reflecting some caution after a sharp run-up earlier in the year.",
        "Analysts advised retail investors to avoid chasing momentum and to stick with long-term allocation plans.",
      ],
      ["Earnings will now decide whether these levels hold.", "A market strategist"]
    ),
    coverImage: img("stock-market", "Stock market trading screens"),
    category: cat("business"),
    author: au("vikram-sethi"),
    tags: ["Markets", "Sensex", "Economy"],
    location: "Mumbai",
    publishedAt: hoursAgo(2),
    readingTime: 3,
    views: 31540,
    isFeatured: true,
    isBreaking: true,
  },
  {
    id: "4",
    slug: "india-clinch-odi-series-final-over",
    title: "India clinch ODI series in a last-over thriller",
    excerpt: "An unbeaten 84 from the middle order steadies the chase after an early collapse.",
    content: body(
      "India won the deciding one-day international by two wickets with one ball to spare, taking the series 2-1.",
      [
        "Chasing 287, the hosts slipped to 71 for 4 before a 132-run partnership turned the match.",
        "The visitors fought back with three quick wickets, setting up a tense final over that needed nine runs.",
        "The team now travels for a three-match T20 series starting next week.",
      ]
    ),
    coverImage: img("cricket-stadium", "Cricket stadium under floodlights"),
    category: cat("sports"),
    author: au("meera-kulkarni"),
    tags: ["Cricket", "ODI", "Team India"],
    location: "Pune",
    publishedAt: hoursAgo(5),
    readingTime: 4,
    views: 67890,
    isFeatured: true,
  },
  {
    id: "5",
    slug: "city-metro-phase-two-trial-runs",
    title: "Metro phase two begins trial runs; public services likely by December",
    excerpt: "The 18-km stretch will add 14 stations and connect the old city to the industrial belt.",
    content: body(
      "Trial runs began on Monday on the 18-km second phase of the city metro, officials said.",
      [
        "The corridor has 14 stations and is expected to carry about 1.2 lakh passengers a day once fully operational.",
        "Safety certification is the final step before passenger services can begin.",
        "Feeder bus routes are being redrawn to connect residential areas with the new stations.",
      ]
    ),
    coverImage: img("metro-train", "Metro train on an elevated track"),
    category: cat("city"),
    author: au("farah-khan"),
    tags: ["Metro", "Transport", "Urban"],
    publishedAt: hoursAgo(4),
    readingTime: 3,
    views: 18420,
  },
  {
    id: "6",
    slug: "global-climate-summit-agreement",
    title: "Climate summit ends with deal on adaptation finance for vulnerable nations",
    excerpt: "Developing countries call the agreement a start but say amounts remain far short of needs.",
    content: body(
      "Negotiators reached an agreement late on Sunday to scale up funding that helps vulnerable countries adapt to climate change.",
      [
        "The deal sets a timeline for richer nations to report on their contributions each year.",
        "Several delegations said the amounts pledged were well below what independent estimates suggest is required.",
        "The next round of talks will focus on how funds are delivered and monitored.",
      ]
    ),
    coverImage: img("climate-summit", "Delegates at an international conference"),
    category: cat("world"),
    author: au("ananya-rao"),
    tags: ["Climate", "Diplomacy"],
    location: "Geneva",
    publishedAt: hoursAgo(7),
    readingTime: 5,
    views: 12030,
  },
  {
    id: "7",
    slug: "upi-daily-transactions-new-record",
    title: "UPI crosses 70 crore transactions in a single day",
    excerpt: "Small-value payments at local shops drive the surge, data shows.",
    content: body(
      "Digital payments through UPI crossed 70 crore transactions in a single day for the first time, according to data released on Tuesday.",
      [
        "Payments below ₹500 made up more than half of all transactions.",
        "Rural adoption has grown faster than urban usage over the past year.",
        "Regulators said they are working on new safeguards against fraud as volumes grow.",
      ]
    ),
    coverImage: img("digital-payment", "Customer paying with a phone at a shop"),
    category: cat("technology"),
    author: au("rohan-das"),
    tags: ["UPI", "Fintech", "Digital India"],
    publishedAt: hoursAgo(6),
    readingTime: 3,
    views: 25400,
  },
  {
    id: "8",
    slug: "regional-film-wins-festival-award",
    title: "Regional-language film wins top prize at international festival",
    excerpt: "The debut feature, shot in a border village with a local cast, was praised for its restraint.",
    content: body(
      "A debut feature made in a regional language won the top prize at an international film festival on Saturday.",
      [
        "The film was shot over 40 days with a cast drawn largely from the village where it is set.",
        "The director said the award would help the film find a wider release at home.",
        "Distributors have expressed interest in a theatrical release early next year.",
      ]
    ),
    coverImage: img("film-festival", "Red carpet at a film festival"),
    category: cat("entertainment"),
    author: au("farah-khan"),
    tags: ["Cinema", "Awards"],
    publishedAt: hoursAgo(10),
    readingTime: 3,
    views: 15870,
  },
  {
    id: "9",
    slug: "editorial-border-development-must-be-sustained",
    title: "Border development needs follow-through, not just announcements",
    excerpt: "The new connectivity package is welcome. Its success will be measured in kilometres built, not crores promised.",
    content: body(
      "Every few years, a fresh package for border areas is announced with fanfare. The latest one is larger and better targeted than most.",
      [
        "The difference this time must be transparency. A public dashboard tracking each project would let residents hold officials accountable.",
        "Maintenance budgets matter as much as construction. Roads that wash away in two monsoons are not progress.",
        "Border communities have waited long enough. They deserve delivery, on time and in full.",
      ]
    ),
    coverImage: img("editorial-desk", "Newspaper editorial desk"),
    category: cat("opinion"),
    author: au("editorial-board"),
    tags: ["Editorial", "Governance"],
    publishedAt: hoursAgo(9),
    readingTime: 4,
    views: 8200,
  },
  {
    id: "10",
    slug: "opinion-why-local-news-matters",
    title: "Why local news matters more than ever",
    excerpt: "When local reporting disappears, civic participation falls with it.",
    content: body(
      "The health of a democracy is often visible first at the level of the panchayat and the municipal ward.",
      [
        "Local reporting is what connects residents to the decisions that shape their streets, schools and water supply.",
        "Research from several countries suggests that when local papers close, voter turnout and civic engagement drop.",
        "Supporting local journalism is, in the end, an investment in better government.",
      ]
    ),
    coverImage: img("reading-newspaper", "Person reading a newspaper"),
    category: cat("opinion"),
    author: au("ananya-rao"),
    tags: ["Media", "Democracy"],
    publishedAt: hoursAgo(20),
    readingTime: 5,
    views: 5900,
  },
  {
    id: "11",
    slug: "startup-funding-rebounds-quarter",
    title: "Startup funding rebounds in the July–September quarter",
    excerpt: "Climate-tech and agri-tech lead investor interest; late-stage deals remain scarce.",
    content: body(
      "Startup funding rose for the second consecutive quarter, according to industry data.",
      [
        "Early-stage deals accounted for most of the growth.",
        "Investors remain cautious about large late-stage rounds.",
        "Founders say profitability now matters more than growth in investor conversations.",
      ]
    ),
    coverImage: img("startup-office", "Team working in a startup office"),
    category: cat("business"),
    author: au("vikram-sethi"),
    tags: ["Startups", "Funding"],
    location: "Bengaluru",
    publishedAt: hoursAgo(12),
    readingTime: 4,
    views: 9800,
  },
  {
    id: "12",
    slug: "state-kabaddi-team-reaches-final",
    title: "State kabaddi team storms into national championship final",
    excerpt: "A 41-29 semi-final win sets up a clash with the defending champions on Sunday.",
    content: body(
      "The state kabaddi team reached the final of the national championship with a commanding 41-29 win.",
      [
        "The raiders scored 24 points between them, while the defence recorded six super tackles.",
        "The coach credited a new fitness programme introduced this season.",
        "The final will be broadcast live on Sunday evening.",
      ]
    ),
    coverImage: img("kabaddi-match", "Players in a kabaddi match"),
    category: cat("sports"),
    author: au("meera-kulkarni"),
    tags: ["Kabaddi"],
    publishedAt: hoursAgo(14),
    readingTime: 3,
    views: 11200,
  },
  {
    id: "13",
    slug: "ai-tools-in-government-schools-pilot",
    title: "AI learning assistants piloted in 200 government schools",
    excerpt: "Teachers report better engagement in maths, but connectivity remains a hurdle.",
    content: body(
      "An AI-based learning assistant is being piloted in 200 government schools this term.",
      [
        "The tool offers practice questions in the student's own language and flags topics where they struggle.",
        "Teachers said engagement improved, especially in maths, but patchy internet slowed classes in rural schools.",
        "The education department will review results before deciding on a wider rollout.",
      ]
    ),
    coverImage: img("classroom-tablet", "Students using tablets in a classroom"),
    category: cat("technology"),
    author: au("rohan-das"),
    tags: ["Education", "AI"],
    publishedAt: hoursAgo(16),
    readingTime: 4,
    views: 14300,
  },
  {
    id: "14",
    slug: "city-water-supply-new-pipeline",
    title: "New pipeline to end alternate-day water supply in eastern wards",
    excerpt: "The 22-km line will serve around 3 lakh residents from next month.",
    content: body(
      "Residents of the city's eastern wards will soon get daily water supply after a new 22-km pipeline was completed.",
      [
        "The civic body said testing is under way and supply will begin next month.",
        "Residents have long relied on tankers during summer months.",
        "Officials said the next phase will cover the southern outskirts.",
      ]
    ),
    coverImage: img("water-pipeline", "Workers laying a large water pipeline"),
    category: cat("city"),
    author: au("farah-khan"),
    tags: ["Water", "Civic"],
    publishedAt: hoursAgo(18),
    readingTime: 3,
    views: 7600,
  },
  {
    id: "15",
    slug: "trade-talks-progress-free-trade-agreement",
    title: "Trade talks make progress; free trade agreement could be signed early next year",
    excerpt: "Negotiators close 18 of 24 chapters, with services and agriculture still under discussion.",
    content: body(
      "Negotiators said significant progress had been made in talks on a free trade agreement.",
      [
        "Eighteen of the twenty-four chapters have been closed.",
        "Agriculture and professional services remain the most difficult areas.",
        "Both sides aim to sign the agreement early next year.",
      ]
    ),
    coverImage: img("shipping-port", "Containers at a shipping port"),
    category: cat("world"),
    author: au("vikram-sethi"),
    tags: ["Trade", "Diplomacy"],
    location: "London",
    publishedAt: hoursAgo(22),
    readingTime: 4,
    views: 6400,
  },
  {
    id: "16",
    slug: "state-assembly-winter-session-dates",
    title: "Assembly winter session to begin November 24; 11 bills listed",
    excerpt: "Opposition seeks discussion on farm prices and recruitment exams.",
    content: body(
      "The state assembly's winter session will begin on November 24 and run for three weeks.",
      [
        "Eleven bills have been listed for introduction, including one on urban land records.",
        "Opposition parties have asked for a dedicated debate on crop prices.",
        "The Speaker will convene an all-party meeting before the session.",
      ]
    ),
    coverImage: img("assembly-building", "State legislative assembly building"),
    category: cat("state"),
    author: au("ananya-rao"),
    tags: ["Politics", "Assembly"],
    publishedAt: hoursAgo(11),
    readingTime: 3,
    views: 10100,
  },
];
