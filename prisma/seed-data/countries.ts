// First-pass European country + city dataset. See docs/dimensions.md
// ("Status van de eerste dataset") for what this is based on: a small set
// of hand-estimated factual axes per country, from which the 24
// place-scorable dimensions are *derived* by formula in prisma/seed.ts.
// This is a starting point for the algorithm, not verified data — treat
// scores as "roughly right ballpark", to be replaced with real indexes
// (Numbeo, Global Peace Index, Freedom House, climate data, ...) per
// PROJECT.md §6.

export interface CityFact {
  name: string;
  /** true for the largest 1-2 cities in the country: bigger urban/nightlife boost, bigger cost penalty */
  major?: boolean;
}

export interface CountryFact {
  name: string;
  iso2: string;
  /** 0-10, warmth/sunshine */
  climate: number;
  /** 1 (cheap) - 5 (expensive) */
  costTier: number;
  /** 1 (unsafe) - 5 (very safe) */
  safetyTier: number;
  /** 1-5 healthcare quality */
  healthTier: number;
  /** 1-5 political freedom/stability */
  freedomTier: number;
  /** 1-5 internet/infra quality */
  internetTier: number;
  /** 1-5 environmental sustainability */
  sustainTier: number;
  /** 1-5 diversity / expat-friendliness */
  diversityTier: number;
  /** 1-5 baseline urbanicity/density of the country as a whole */
  urbanTier: number;
  /** 1-5 nature/landscape richness */
  natureTier: number;
  /** 1-5 food/cuisine reputation */
  foodTier: number;
  /** 1-5 secularism (5 = very secular) */
  secularTier: number;
  /** 1-5 English proficiency */
  englishTier: number;
  euMember: boolean;
  /**
   * Very small country (San Marino, Monaco, Vatican, Andorra, Liechtenstein)
   * with a notoriously restrictive real-world residency process and a tiny
   * job market — not reflected by freedomTier (political freedom is high)
   * so it's applied as a separate penalty in score.ts on tax_visa/work_career.
   */
  microstate?: boolean;
  cities: CityFact[];
}

export const countries: CountryFact[] = [
  // Nordics
  { name: "Denmark", iso2: "DK", climate: 3, costTier: 5, safetyTier: 5, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 5, diversityTier: 4, urbanTier: 3, natureTier: 4, foodTier: 3, secularTier: 5, englishTier: 5, euMember: true, cities: [{ name: "Copenhagen", major: true }, { name: "Aarhus" }] },
  { name: "Sweden", iso2: "SE", climate: 2, costTier: 4, safetyTier: 4, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 5, diversityTier: 4, urbanTier: 2, natureTier: 5, foodTier: 3, secularTier: 5, englishTier: 5, euMember: true, cities: [{ name: "Stockholm", major: true }, { name: "Gothenburg" }] },
  { name: "Norway", iso2: "NO", climate: 2, costTier: 5, safetyTier: 5, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 5, diversityTier: 4, urbanTier: 2, natureTier: 5, foodTier: 3, secularTier: 5, englishTier: 5, euMember: false, cities: [{ name: "Oslo", major: true }, { name: "Bergen" }] },
  { name: "Finland", iso2: "FI", climate: 2, costTier: 4, safetyTier: 5, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 5, diversityTier: 3, urbanTier: 2, natureTier: 5, foodTier: 3, secularTier: 5, englishTier: 5, euMember: true, cities: [{ name: "Helsinki", major: true }, { name: "Tampere" }] },
  { name: "Iceland", iso2: "IS", climate: 2, costTier: 5, safetyTier: 5, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 5, diversityTier: 3, urbanTier: 2, natureTier: 5, foodTier: 3, secularTier: 4, englishTier: 5, euMember: false, cities: [{ name: "Reykjavik", major: true }] },

  // British Isles
  { name: "United Kingdom", iso2: "GB", climate: 5, costTier: 4, safetyTier: 3, healthTier: 4, freedomTier: 5, internetTier: 5, sustainTier: 4, diversityTier: 5, urbanTier: 4, natureTier: 4, foodTier: 3, secularTier: 5, englishTier: 5, euMember: false, cities: [{ name: "London", major: true }, { name: "Manchester" }, { name: "Edinburgh" }] },
  { name: "Ireland", iso2: "IE", climate: 5, costTier: 5, safetyTier: 4, healthTier: 4, freedomTier: 5, internetTier: 5, sustainTier: 4, diversityTier: 5, urbanTier: 3, natureTier: 4, foodTier: 3, secularTier: 4, englishTier: 5, euMember: true, cities: [{ name: "Dublin", major: true }, { name: "Cork" }] },

  // Benelux
  { name: "Netherlands", iso2: "NL", climate: 5, costTier: 4, safetyTier: 4, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 4, diversityTier: 5, urbanTier: 5, natureTier: 2, foodTier: 3, secularTier: 5, englishTier: 5, euMember: true, cities: [{ name: "Amsterdam", major: true }, { name: "Rotterdam" }, { name: "Utrecht" }] },
  { name: "Belgium", iso2: "BE", climate: 5, costTier: 4, safetyTier: 4, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 4, diversityTier: 5, urbanTier: 4, natureTier: 2, foodTier: 4, secularTier: 4, englishTier: 4, euMember: true, cities: [{ name: "Brussels", major: true }, { name: "Antwerp" }] },
  { name: "Luxembourg", iso2: "LU", climate: 5, costTier: 5, safetyTier: 5, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 4, diversityTier: 5, urbanTier: 3, natureTier: 3, foodTier: 3, secularTier: 4, englishTier: 4, euMember: true, cities: [{ name: "Luxembourg City", major: true }] },

  // DACH
  { name: "Germany", iso2: "DE", climate: 5, costTier: 4, safetyTier: 4, healthTier: 5, freedomTier: 5, internetTier: 4, sustainTier: 5, diversityTier: 4, urbanTier: 3, natureTier: 4, foodTier: 3, secularTier: 4, englishTier: 4, euMember: true, cities: [{ name: "Berlin", major: true }, { name: "Munich", major: true }, { name: "Hamburg" }] },
  { name: "Austria", iso2: "AT", climate: 5, costTier: 4, safetyTier: 5, healthTier: 5, freedomTier: 5, internetTier: 4, sustainTier: 5, diversityTier: 4, urbanTier: 3, natureTier: 5, foodTier: 3, secularTier: 4, englishTier: 4, euMember: true, cities: [{ name: "Vienna", major: true }, { name: "Graz" }] },
  { name: "Switzerland", iso2: "CH", climate: 5, costTier: 5, safetyTier: 5, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 5, diversityTier: 4, urbanTier: 3, natureTier: 5, foodTier: 3, secularTier: 4, englishTier: 4, euMember: false, cities: [{ name: "Zurich", major: true }, { name: "Geneva" }] },
  { name: "Liechtenstein", iso2: "LI", climate: 5, costTier: 5, safetyTier: 5, healthTier: 5, freedomTier: 5, internetTier: 5, sustainTier: 4, diversityTier: 3, urbanTier: 2, natureTier: 5, foodTier: 3, secularTier: 3, englishTier: 3, euMember: false, microstate: true, cities: [{ name: "Vaduz", major: true }] },

  // Western
  { name: "France", iso2: "FR", climate: 6, costTier: 4, safetyTier: 3, healthTier: 5, freedomTier: 5, internetTier: 4, sustainTier: 4, diversityTier: 4, urbanTier: 3, natureTier: 4, foodTier: 5, secularTier: 5, englishTier: 3, euMember: true, cities: [{ name: "Paris", major: true }, { name: "Lyon" }, { name: "Marseille" }] },
  { name: "Monaco", iso2: "MC", climate: 8, costTier: 5, safetyTier: 5, healthTier: 5, freedomTier: 4, internetTier: 5, sustainTier: 3, diversityTier: 4, urbanTier: 5, natureTier: 2, foodTier: 5, secularTier: 4, englishTier: 4, euMember: false, microstate: true, cities: [{ name: "Monaco", major: true }] },

  // Iberia
  { name: "Spain", iso2: "ES", climate: 8, costTier: 3, safetyTier: 4, healthTier: 4, freedomTier: 5, internetTier: 4, sustainTier: 3, diversityTier: 4, urbanTier: 3, natureTier: 4, foodTier: 5, secularTier: 3, englishTier: 3, euMember: true, cities: [{ name: "Madrid", major: true }, { name: "Barcelona", major: true }, { name: "Valencia" }] },
  { name: "Portugal", iso2: "PT", climate: 8, costTier: 3, safetyTier: 5, healthTier: 4, freedomTier: 5, internetTier: 4, sustainTier: 3, diversityTier: 4, urbanTier: 3, natureTier: 4, foodTier: 4, secularTier: 3, englishTier: 3, euMember: true, cities: [{ name: "Lisbon", major: true }, { name: "Porto" }] },
  { name: "Andorra", iso2: "AD", climate: 6, costTier: 4, safetyTier: 5, healthTier: 4, freedomTier: 4, internetTier: 4, sustainTier: 4, diversityTier: 3, urbanTier: 2, natureTier: 5, foodTier: 4, secularTier: 3, englishTier: 2, euMember: false, microstate: true, cities: [{ name: "Andorra la Vella", major: true }] },

  // Italy / microstates
  { name: "Italy", iso2: "IT", climate: 8, costTier: 3, safetyTier: 4, healthTier: 4, freedomTier: 4, internetTier: 3, sustainTier: 3, diversityTier: 3, urbanTier: 3, natureTier: 4, foodTier: 5, secularTier: 3, englishTier: 3, euMember: true, cities: [{ name: "Rome", major: true }, { name: "Milan", major: true }, { name: "Naples" }] },
  { name: "San Marino", iso2: "SM", climate: 7, costTier: 3, safetyTier: 5, healthTier: 4, freedomTier: 4, internetTier: 3, sustainTier: 3, diversityTier: 2, urbanTier: 2, natureTier: 4, foodTier: 4, secularTier: 3, englishTier: 3, euMember: false, microstate: true, cities: [{ name: "San Marino", major: true }] },
  { name: "Vatican City", iso2: "VA", climate: 7, costTier: 4, safetyTier: 5, healthTier: 4, freedomTier: 3, internetTier: 3, sustainTier: 3, diversityTier: 3, urbanTier: 5, natureTier: 1, foodTier: 4, secularTier: 1, englishTier: 3, euMember: false, microstate: true, cities: [{ name: "Vatican City", major: true }] },
  { name: "Malta", iso2: "MT", climate: 8, costTier: 3, safetyTier: 4, healthTier: 4, freedomTier: 4, internetTier: 4, sustainTier: 2, diversityTier: 4, urbanTier: 4, natureTier: 2, foodTier: 4, secularTier: 2, englishTier: 5, euMember: true, cities: [{ name: "Valletta", major: true }] },

  // Mediterranean East
  { name: "Greece", iso2: "GR", climate: 9, costTier: 2, safetyTier: 3, healthTier: 3, freedomTier: 4, internetTier: 3, sustainTier: 3, diversityTier: 3, urbanTier: 3, natureTier: 4, foodTier: 5, secularTier: 2, englishTier: 3, euMember: true, cities: [{ name: "Athens", major: true }, { name: "Thessaloniki" }] },
  { name: "Cyprus", iso2: "CY", climate: 9, costTier: 3, safetyTier: 4, healthTier: 3, freedomTier: 4, internetTier: 3, sustainTier: 2, diversityTier: 3, urbanTier: 3, natureTier: 3, foodTier: 4, secularTier: 2, englishTier: 4, euMember: true, cities: [{ name: "Nicosia", major: true }, { name: "Limassol" }] },

  // Central Europe
  { name: "Poland", iso2: "PL", climate: 4, costTier: 2, safetyTier: 4, healthTier: 3, freedomTier: 4, internetTier: 4, sustainTier: 3, diversityTier: 3, urbanTier: 3, natureTier: 3, foodTier: 3, secularTier: 2, englishTier: 3, euMember: true, cities: [{ name: "Warsaw", major: true }, { name: "Krakow" }] },
  { name: "Czechia", iso2: "CZ", climate: 4, costTier: 3, safetyTier: 5, healthTier: 4, freedomTier: 4, internetTier: 4, sustainTier: 3, diversityTier: 3, urbanTier: 3, natureTier: 4, foodTier: 3, secularTier: 5, englishTier: 3, euMember: true, cities: [{ name: "Prague", major: true }, { name: "Brno" }] },
  { name: "Slovakia", iso2: "SK", climate: 4, costTier: 2, safetyTier: 4, healthTier: 3, freedomTier: 4, internetTier: 4, sustainTier: 3, diversityTier: 2, urbanTier: 3, natureTier: 4, foodTier: 3, secularTier: 3, englishTier: 3, euMember: true, cities: [{ name: "Bratislava", major: true }] },
  { name: "Hungary", iso2: "HU", climate: 5, costTier: 2, safetyTier: 4, healthTier: 3, freedomTier: 3, internetTier: 4, sustainTier: 3, diversityTier: 3, urbanTier: 3, natureTier: 3, foodTier: 4, secularTier: 3, englishTier: 3, euMember: true, cities: [{ name: "Budapest", major: true }] },
  { name: "Slovenia", iso2: "SI", climate: 5, costTier: 3, safetyTier: 5, healthTier: 4, freedomTier: 5, internetTier: 4, sustainTier: 4, diversityTier: 3, urbanTier: 2, natureTier: 5, foodTier: 3, secularTier: 4, englishTier: 4, euMember: true, cities: [{ name: "Ljubljana", major: true }] },

  // Baltics
  { name: "Estonia", iso2: "EE", climate: 3, costTier: 3, safetyTier: 4, healthTier: 3, freedomTier: 5, internetTier: 5, sustainTier: 4, diversityTier: 3, urbanTier: 2, natureTier: 4, foodTier: 3, secularTier: 5, englishTier: 4, euMember: true, cities: [{ name: "Tallinn", major: true }] },
  { name: "Latvia", iso2: "LV", climate: 3, costTier: 3, safetyTier: 4, healthTier: 3, freedomTier: 4, internetTier: 4, sustainTier: 3, diversityTier: 3, urbanTier: 2, natureTier: 4, foodTier: 3, secularTier: 4, englishTier: 3, euMember: true, cities: [{ name: "Riga", major: true }] },
  { name: "Lithuania", iso2: "LT", climate: 3, costTier: 3, safetyTier: 4, healthTier: 3, freedomTier: 4, internetTier: 4, sustainTier: 3, diversityTier: 3, urbanTier: 2, natureTier: 4, foodTier: 3, secularTier: 3, englishTier: 3, euMember: true, cities: [{ name: "Vilnius", major: true }] },

  // Balkans (EU)
  { name: "Croatia", iso2: "HR", climate: 7, costTier: 2, safetyTier: 4, healthTier: 3, freedomTier: 4, internetTier: 3, sustainTier: 3, diversityTier: 2, urbanTier: 2, natureTier: 5, foodTier: 4, secularTier: 3, englishTier: 3, euMember: true, cities: [{ name: "Zagreb", major: true }, { name: "Split" }] },
  { name: "Bulgaria", iso2: "BG", climate: 6, costTier: 1, safetyTier: 3, healthTier: 2, freedomTier: 3, internetTier: 4, sustainTier: 2, diversityTier: 2, urbanTier: 2, natureTier: 4, foodTier: 3, secularTier: 3, englishTier: 2, euMember: true, cities: [{ name: "Sofia", major: true }] },
  { name: "Romania", iso2: "RO", climate: 5, costTier: 1, safetyTier: 3, healthTier: 2, freedomTier: 3, internetTier: 4, sustainTier: 2, diversityTier: 2, urbanTier: 2, natureTier: 4, foodTier: 3, secularTier: 2, englishTier: 3, euMember: true, cities: [{ name: "Bucharest", major: true }, { name: "Cluj-Napoca" }] },

  // Balkans (non-EU)
  { name: "Serbia", iso2: "RS", climate: 6, costTier: 1, safetyTier: 3, healthTier: 2, freedomTier: 3, internetTier: 3, sustainTier: 2, diversityTier: 2, urbanTier: 2, natureTier: 3, foodTier: 3, secularTier: 3, englishTier: 3, euMember: false, cities: [{ name: "Belgrade", major: true }] },
  { name: "Bosnia and Herzegovina", iso2: "BA", climate: 6, costTier: 1, safetyTier: 3, healthTier: 2, freedomTier: 3, internetTier: 3, sustainTier: 2, diversityTier: 2, urbanTier: 2, natureTier: 4, foodTier: 3, secularTier: 2, englishTier: 2, euMember: false, cities: [{ name: "Sarajevo", major: true }] },
  { name: "Montenegro", iso2: "ME", climate: 7, costTier: 2, safetyTier: 3, healthTier: 2, freedomTier: 3, internetTier: 3, sustainTier: 2, diversityTier: 2, urbanTier: 2, natureTier: 5, foodTier: 3, secularTier: 3, englishTier: 2, euMember: false, cities: [{ name: "Podgorica", major: true }] },
  { name: "North Macedonia", iso2: "MK", climate: 6, costTier: 1, safetyTier: 3, healthTier: 2, freedomTier: 3, internetTier: 3, sustainTier: 2, diversityTier: 2, urbanTier: 2, natureTier: 4, foodTier: 3, secularTier: 2, englishTier: 2, euMember: false, cities: [{ name: "Skopje", major: true }] },
  { name: "Albania", iso2: "AL", climate: 7, costTier: 1, safetyTier: 3, healthTier: 2, freedomTier: 3, internetTier: 3, sustainTier: 2, diversityTier: 2, urbanTier: 2, natureTier: 4, foodTier: 4, secularTier: 3, englishTier: 2, euMember: false, cities: [{ name: "Tirana", major: true }] },
  { name: "Kosovo", iso2: "XK", climate: 6, costTier: 1, safetyTier: 2, healthTier: 2, freedomTier: 3, internetTier: 3, sustainTier: 2, diversityTier: 2, urbanTier: 2, natureTier: 3, foodTier: 3, secularTier: 2, englishTier: 2, euMember: false, cities: [{ name: "Pristina", major: true }] },

  // Eastern non-EU
  { name: "Ukraine", iso2: "UA", climate: 5, costTier: 1, safetyTier: 2, healthTier: 2, freedomTier: 2, internetTier: 2, sustainTier: 2, diversityTier: 2, urbanTier: 3, natureTier: 3, foodTier: 3, secularTier: 4, englishTier: 2, euMember: false, cities: [{ name: "Kyiv", major: true }] },
  { name: "Moldova", iso2: "MD", climate: 5, costTier: 1, safetyTier: 3, healthTier: 2, freedomTier: 3, internetTier: 3, sustainTier: 2, diversityTier: 2, urbanTier: 2, natureTier: 3, foodTier: 3, secularTier: 3, englishTier: 2, euMember: false, cities: [{ name: "Chisinau", major: true }] },
  { name: "Belarus", iso2: "BY", climate: 3, costTier: 1, safetyTier: 2, healthTier: 2, freedomTier: 1, internetTier: 2, sustainTier: 2, diversityTier: 1, urbanTier: 3, natureTier: 3, foodTier: 3, secularTier: 4, englishTier: 2, euMember: false, cities: [{ name: "Minsk", major: true }] },
];
