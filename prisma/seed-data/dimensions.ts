// Canonical dimension list — see docs/dimensions.md for the full rationale.
// `placeScorable: false` (future_ambitions) is user-only and gets no PlaceScore rows.

export interface DimensionSeed {
  key: string;
  name: string;
  category: string;
  placeScorable: boolean;
}

export const dimensions: DimensionSeed[] = [
  { key: "climate", name: "Klimaat & weer", category: "fysiek", placeScorable: true },
  { key: "cost_of_living", name: "Budget & kosten van leven", category: "financieel", placeScorable: true },
  { key: "housing", name: "Huisvesting", category: "financieel", placeScorable: true },
  { key: "work_career", name: "Werk & carrière", category: "financieel", placeScorable: true },
  { key: "language", name: "Taal", category: "cultuur", placeScorable: true },
  { key: "culture_mentality", name: "Cultuur & mentaliteit", category: "cultuur", placeScorable: true },
  { key: "nature_landscape", name: "Natuur & landschap", category: "fysiek", placeScorable: true },
  { key: "urbanicity", name: "Stad vs dorp", category: "fysiek", placeScorable: true },
  { key: "social_community", name: "Sociaal leven & community", category: "sociaal", placeScorable: true },
  { key: "safety", name: "Veiligheid", category: "basis", placeScorable: true },
  { key: "healthcare", name: "Gezondheidszorg", category: "basis", placeScorable: true },
  { key: "education", name: "Onderwijs", category: "basis", placeScorable: true },
  { key: "family_relation", name: "Gezin & relatie", category: "sociaal", placeScorable: true },
  { key: "mobility_transport", name: "Mobiliteit & vervoer", category: "fysiek", placeScorable: true },
  { key: "politics_freedom", name: "Politiek & vrijheid", category: "basis", placeScorable: true },
  { key: "religion_worldview", name: "Religie & levensbeschouwing", category: "cultuur", placeScorable: true },
  { key: "food_cuisine", name: "Eten & keuken", category: "cultuur", placeScorable: true },
  { key: "hobbies_freetime", name: "Hobby's & vrije tijd", category: "sociaal", placeScorable: true },
  { key: "sports_activities", name: "Sport & activiteiten", category: "sociaal", placeScorable: true },
  { key: "nightlife_entertainment", name: "Nachtleven & entertainment", category: "sociaal", placeScorable: true },
  { key: "diversity_expat", name: "Diversiteit & expat-community", category: "sociaal", placeScorable: true },
  { key: "tax_visa", name: "Belasting, visum & regels", category: "basis", placeScorable: true },
  { key: "internet_infra", name: "Internet & infrastructuur", category: "fysiek", placeScorable: true },
  { key: "sustainability_environment", name: "Duurzaamheid & milieu", category: "fysiek", placeScorable: true },
  { key: "future_ambitions", name: "Toekomst & ambities", category: "gebruiker", placeScorable: false },
];
