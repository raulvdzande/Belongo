// Genereert het "volledige verhuisplan" uit PROJECT.md §4 voor Plan A:
// visum, budget, tijdlijn, wonen, werk, praktische zaken en een checklist.
// Dit is een deterministische, data-gedreven tekstgenerator — geen live
// LLM-aanroep (er is geen AI-API in dit project aangesloten). Het vervangt
// laag 4 uit PROJECT.md §3 functioneel (mens-leesbare, gepersonaliseerde
// tekst), maar is dus geen AI-gegenereerde proza in de letterlijke zin.

import type { PracticalInput } from "./practical";

export interface RelocationPlanInput {
  placeName: string;
  parentName: string | null;
  countryCode: string;
  scores: Record<string, number>; // dimension key -> 0-10
  practical: Partial<PracticalInput>;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface RelocationPlan {
  visa: string;
  budget: string;
  timeline: { month: string; steps: string[] }[];
  housing: string;
  work: string;
  practical: string[];
  checklist: ChecklistItem[];
}

function bucket(score: number | undefined, low: number, high: number): "low" | "mid" | "high" {
  const s = score ?? 5;
  if (s < low) return "low";
  if (s > high) return "high";
  return "mid";
}

export function generateRelocationPlan(input: RelocationPlanInput): RelocationPlan {
  const { placeName, scores, practical } = input;
  const nationality = practical.nationality?.trim() || "jouw huidige nationaliteit";

  // --- Visum ---
  const visaBucket = bucket(scores.tax_visa, 5, 7.5);
  const visa =
    visaBucket === "high"
      ? `Op basis van de score voor visum/regelgeving lijkt verblijfsrecht in ${placeName} relatief soepel. Check als burger van ${nationality} specifiek of je met een vereenvoudigd traject (bv. EU-vrij verkeer of een digital nomad-visum) terechtkunt, en wat de exacte kosten en doorlooptijd zijn — dat verschilt per nationaliteit en is niet uit deze test af te leiden.`
      : visaBucket === "mid"
        ? `${placeName} heeft een standaard visum-/verblijfstraject. Reken op een officiële aanvraag met inkomens- of werkgeverseis, een doorlooptijd van enkele weken tot maanden, en leges. Zoek als burger van ${nationality} de exacte voorwaarden op bij de ambassade of immigratiedienst voordat je verdere stappen zet.`
        : `Deze plek scoort lager op ons visum/regelgeving-signaal — verblijfsrecht kan hier extra aandacht vragen. Onderzoek grondig als burger van ${nationality} welke visumopties er zijn en houd rekening met een langere of onzekerdere doorlooptijd.`;

  // --- Budget ---
  const costBucket = bucket(scores.cost_of_living, 4, 7);
  const monthlyRange =
    costBucket === "high" ? "€800–1.400" : costBucket === "mid" ? "€1.400–2.200" : "€2.200+";
  const movingBudgetNote: Record<string, string> = {
    KRAP: "Met een krap verhuisbudget: plan de verhuizing zelf sober (eigen vervoer, minimale meubels vooraf) en bouw een buffer van minstens 1 maand extra kosten in.",
    GEMIDDELD: "Met een gemiddeld verhuisbudget kun je een verhuisbedrijf voor het grootste werk inzetten en een buffer van 2-3 maanden aanhouden.",
    RUIM: "Met een ruim verhuisbudget kun je de hele verhuizing laten ontzorgen (verhuisbedrijf, tijdelijke opvang, makelaar) zonder al te veel op de kosten te letten.",
  };
  const budget = `Geschatte kosten van levensonderhoud in ${placeName}: ongeveer ${monthlyRange} per maand voor een alleenstaande, exclusief eenmalige verhuiskosten. ${
    practical.movingBudget ? movingBudgetNote[practical.movingBudget] : "Geef je verhuisbudget op voor een concreet advies hier."
  }`;

  // --- Tijdlijn ---
  const timeline = [
    { month: "Maand 1", steps: ["Visum-/verblijfsopties uitzoeken en documenten verzamelen (paspoort, geboorteakte, diploma's)", "Financiën op orde: spaarbuffer en eventueel een lokale bankrekening voorbereiden"] },
    { month: "Maand 2", steps: [`Visum/verblijfsvergunning aanvragen voor ${placeName}`, "Woningmarkt verkennen (huurprijzen, wijken) vanuit je huidige locatie"] },
    { month: "Maand 3", steps: ["Werk regelen: lokale sollicitatie, remote-contract updaten, of eigen bedrijf inschrijven", "Zorgverzekering en eventueel schoolopties voor kinderen regelen"] },
    { month: "Maand 4", steps: ["Verhuizer boeken of eigen vervoer plannen", "Huisdier-, opslag- en adreswijzigingszaken afronden"] },
    { month: "Maand 5-6", steps: [`Aankomst en inschrijving in ${placeName}`, "Lokale bankrekening, telefoonabonnement en verzekeringen afronden", "Taalles of buurt-integratie oppakken"] },
  ];

  // --- Wonen ---
  const housingBucket = bucket(scores.housing, 4, 7);
  const housing =
    housingBucket === "high"
      ? `Huisvesting is relatief betaalbaar in ${placeName} — huren voor de eerste periode en daarna eventueel kopen is een haalbare route.`
      : housingBucket === "mid"
        ? `Huisvesting is gemiddeld geprijsd in ${placeName}. Start met huren om de buurt te leren kennen voordat je eventueel koopt.`
        : `Huisvesting is relatief duur/schaars in ${placeName} — reken op een langere zoektocht en overweeg een makelaar of relocation-service in te schakelen.`;

  // --- Werk ---
  const workBucket = bucket(scores.work_career, 4, 7);
  const work = practical.remoteWork
    ? `Je werkt remote — de internetkwaliteit hier scoort ${bucket(scores.internet_infra, 4, 7) === "high" ? "goed" : "wisselend, dus check lokale providers vooraf"}. Regel wel uit dat je belastingplicht en eventueel een lokaal zzp-/nomad-visum kloppen.`
    : workBucket === "high"
      ? `De lokale arbeidsmarkt scoort goed — solliciteer vanuit je huidige land en check werkvergunning-eisen voor jouw sector.`
      : `De lokale arbeidsmarkt scoort gemiddeld tot lager — reken op een langere zoektocht naar werk of overweeg remote werk voor een werkgever elders te blijven doen.`;

  // --- Praktisch ---
  const languageNote =
    practical.languageLevel === "GEEN" || practical.languageLevel === "BASIS"
      ? "Start op tijd met taallessen — dat versnelt zowel de bureaucratie als het sociale leven ter plekke."
      : "Je taalniveau is al een goede basis om snel te integreren.";
  const kidsNote = practical.hasKids
    ? "Zoek internationale of lokale scholen tijdig uit — sommige hebben wachtlijsten."
    : "";
  const practicalSteps = [
    "Open een lokale bankrekening zodra je een adres en BSN-equivalent hebt.",
    `Regel een zorgverzekering die geldig is in ${placeName} (check dekking vanaf dag 1).`,
    languageNote,
    kidsNote,
  ].filter(Boolean);

  const checklist: ChecklistItem[] = [
    { id: "visa", label: "Visum-/verblijfsopties uitgezocht" },
    { id: "docs", label: "Documenten verzameld (paspoort, diploma's, geboorteakte)" },
    { id: "budget", label: "Budget en spaarbuffer op orde" },
    { id: "housing", label: "Eerste woonruimte geregeld (tijdelijk of definitief)" },
    { id: "work", label: "Werk of remote-contract geregeld" },
    { id: "bank", label: "Lokale bankrekening geopend" },
    { id: "insurance", label: "Zorgverzekering geregeld" },
    { id: "movers", label: "Verhuizer/vervoer geboekt" },
    { id: "language", label: "Taalles of taalapp gestart" },
    { id: "registration", label: "Ingeschreven bij de lokale gemeente/immigratiedienst" },
  ];

  return { visa, budget, timeline, housing, work, practical: practicalSteps, checklist };
}
