// Deel 1 van de test: 25 categorieën × 3 vragen = 75 vragen.
// Elke vraag levert een score 0-10 op de bijbehorende dimensie (zie
// docs/dimensions.md): 10 = "dit moet sterk aanwezig zijn in mijn plek".
// dimensionKey moet overeenkomen met een key in prisma/seed-data/dimensions.ts.

export type QuestionType = "slider" | "choice" | "statement";

interface BaseQuestion {
  id: string;
  dimensionKey: string;
  category: string;
  text: string;
  type: QuestionType;
}

export interface SliderQuestion extends BaseQuestion {
  type: "slider";
  minLabel: string;
  maxLabel: string;
}

export interface ChoiceOption {
  label: string;
  score: number;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: "choice";
  options: ChoiceOption[];
}

export interface StatementQuestion extends BaseQuestion {
  type: "statement";
  /** true: "helemaal eens" betekent een LAGE score op de dimensie */
  reverse?: boolean;
}

export type Question = SliderQuestion | ChoiceQuestion | StatementQuestion;

export const LIKERT_LABELS = [
  "Helemaal oneens",
  "Oneens",
  "Neutraal",
  "Eens",
  "Helemaal eens",
];

export function scoreForAnswer(q: Question, value: number): number {
  if (q.type === "slider") return clamp(value);
  if (q.type === "choice") return clamp(q.options[value]?.score ?? 5);
  // statement: value is 1-5 (Likert)
  const base = (value - 1) * 2.5;
  return clamp(q.reverse ? 10 - base : base);
}

function clamp(n: number) {
  return Math.max(0, Math.min(10, n));
}

export const questions: Question[] = [
  // 1. climate
  { id: "climate_1", dimensionKey: "climate", category: "Klimaat & weer", type: "slider", text: "Hoe belangrijk is warm, zonnig weer voor jou?", minLabel: "Ik hou van kou en duidelijke seizoenen", maxLabel: "Ik wil het liefst het hele jaar warm en zonnig" },
  { id: "climate_2", dimensionKey: "climate", category: "Klimaat & weer", type: "statement", text: "Ik vind een paar maanden winter met kou of sneeuw juist gezellig.", reverse: true },
  { id: "climate_3", dimensionKey: "climate", category: "Klimaat & weer", type: "choice", text: "Welk klimaat trekt je het meest?", options: [
    { label: "Mediterraans en zonnig", score: 9 },
    { label: "Gematigd met vier seizoenen", score: 5 },
    { label: "Koel en fris het hele jaar", score: 1 },
  ] },

  // 2. cost_of_living
  { id: "cost_1", dimensionKey: "cost_of_living", category: "Budget & kosten van leven", type: "slider", text: "Hoe belangrijk is het dat je dagelijkse leven betaalbaar is?", minLabel: "Budget maakt weinig uit", maxLabel: "Betaalbaarheid is cruciaal" },
  { id: "cost_2", dimensionKey: "cost_of_living", category: "Budget & kosten van leven", type: "statement", text: "Ik zou liever ergens goedkoops wonen dan ergens duurs met meer voorzieningen." },
  { id: "cost_3", dimensionKey: "cost_of_living", category: "Budget & kosten van leven", type: "choice", text: "Welk maandbudget past het best bij jouw situatie?", options: [
    { label: "Ruim budget, prijs is geen probleem", score: 2 },
    { label: "Gemiddeld budget, moet kloppen maar niet krap", score: 5 },
    { label: "Krap budget, moet echt betaalbaar zijn", score: 9 },
  ] },

  // 3. housing
  { id: "housing_1", dimensionKey: "housing", category: "Huisvesting", type: "slider", text: "Hoeveel woonruimte heb je nodig?", minLabel: "Klein appartement is prima", maxLabel: "Ik wil veel ruimte (huis met tuin)" },
  { id: "housing_2", dimensionKey: "housing", category: "Huisvesting", type: "choice", text: "Wat is jouw voorkeur?", options: [
    { label: "Huren, flexibel blijven", score: 4 },
    { label: "Kopen zodra het kan", score: 8 },
    { label: "Maakt me niet uit", score: 5 },
  ] },
  { id: "housing_3", dimensionKey: "housing", category: "Huisvesting", type: "statement", text: "Een ruime, betaalbare woning is voor mij belangrijker dan een centrale locatie." },

  // 4. work_career
  { id: "work_1", dimensionKey: "work_career", category: "Werk & carrière", type: "choice", text: "Hoe ziet jouw werksituatie eruit?", options: [
    { label: "Volledig remote, locatie-onafhankelijk", score: 9 },
    { label: "Ik zoek lokaal werk of wil ondernemen", score: 6 },
    { label: "Ik werk niet (meer) of ben met pensioen", score: 3 },
  ] },
  { id: "work_2", dimensionKey: "work_career", category: "Werk & carrière", type: "slider", text: "Hoe belangrijk zijn sterke lokale carrièrekansen voor jou?", minLabel: "Niet belangrijk", maxLabel: "Zeer belangrijk" },
  { id: "work_3", dimensionKey: "work_career", category: "Werk & carrière", type: "statement", text: "Ik wil in een plek zitten met een sterke, kansrijke arbeidsmarkt en internet." },

  // 5. language
  { id: "lang_1", dimensionKey: "language", category: "Taal", type: "slider", text: "Hoe belangrijk is het dat je met Engels (of je moedertaal) prima terecht kunt?", minLabel: "Ik leer graag een nieuwe taal", maxLabel: "Ik wil met mijn eigen taal/Engels terecht kunnen" },
  { id: "lang_2", dimensionKey: "language", category: "Taal", type: "statement", text: "Ik vind het geen probleem om een compleet nieuwe taal te moeten leren.", reverse: true },
  { id: "lang_3", dimensionKey: "language", category: "Taal", type: "choice", text: "Wat is jouw taalvoorkeur?", options: [
    { label: "Ik wil overal mee terecht kunnen zonder taal te leren", score: 9 },
    { label: "Een beetje lokale taal leren vind ik prima", score: 5 },
    { label: "Ik wil juist volledig onderdompelen in een nieuwe taal", score: 1 },
  ] },

  // 6. culture_mentality
  { id: "culture_1", dimensionKey: "culture_mentality", category: "Cultuur & mentaliteit", type: "slider", text: "Hoe formeel/gestructureerd wil je de omgeving?", minLabel: "Los en informeel", maxLabel: "Formeel en gestructureerd" },
  { id: "culture_2", dimensionKey: "culture_mentality", category: "Cultuur & mentaliteit", type: "statement", text: "Ik hou van directe, no-nonsense communicatie in mijn omgeving." },
  { id: "culture_3", dimensionKey: "culture_mentality", category: "Cultuur & mentaliteit", type: "choice", text: "Welk levenstempo past bij jou?", options: [
    { label: "Rustig en ontspannen", score: 3 },
    { label: "Gebalanceerd", score: 5 },
    { label: "Snel en ambitieus", score: 8 },
  ] },

  // 7. nature_landscape
  { id: "nature_1", dimensionKey: "nature_landscape", category: "Natuur & landschap", type: "slider", text: "Hoe belangrijk is directe toegang tot natuur (zee, bergen, bos)?", minLabel: "Niet belangrijk", maxLabel: "Heel belangrijk" },
  { id: "nature_2", dimensionKey: "nature_landscape", category: "Natuur & landschap", type: "choice", text: "Welk landschap trekt je het meest?", options: [
    { label: "Bergen", score: 9 },
    { label: "Zee/kust", score: 9 },
    { label: "Vlak, open land", score: 4 },
  ] },
  { id: "nature_3", dimensionKey: "nature_landscape", category: "Natuur & landschap", type: "statement", text: "Ik wil binnen 20 minuten in de natuur kunnen zijn." },

  // 8. urbanicity
  { id: "urban_1", dimensionKey: "urbanicity", category: "Stad vs dorp", type: "slider", text: "Stad of dorp?", minLabel: "Klein dorp, rustig", maxLabel: "Grote, drukke stad" },
  { id: "urban_2", dimensionKey: "urbanicity", category: "Stad vs dorp", type: "statement", text: "Ik hou van de drukte en energie van een grote stad." },
  { id: "urban_3", dimensionKey: "urbanicity", category: "Stad vs dorp", type: "choice", text: "Wat past het best bij jou?", options: [
    { label: "Rustig dorp of platteland", score: 2 },
    { label: "Middelgrote stad", score: 5 },
    { label: "Grote metropool", score: 9 },
  ] },

  // 9. social_community
  { id: "social_1", dimensionKey: "social_community", category: "Sociaal leven & community", type: "slider", text: "Hoe belangrijk is een actief sociaal leven en hechte community?", minLabel: "Niet zo belangrijk, ik red me prima alleen", maxLabel: "Heel belangrijk" },
  { id: "social_2", dimensionKey: "social_community", category: "Sociaal leven & community", type: "statement", text: "Ik maak makkelijk nieuwe contacten en zoek dat actief op." },
  { id: "social_3", dimensionKey: "social_community", category: "Sociaal leven & community", type: "choice", text: "Hoe zie je je sociale leven het liefst?", options: [
    { label: "Klein, hecht groepje mensen", score: 4 },
    { label: "Breed netwerk, veel activiteiten", score: 8 },
    { label: "Vooral op mezelf", score: 2 },
  ] },

  // 10. safety
  { id: "safety_1", dimensionKey: "safety", category: "Veiligheid", type: "slider", text: "Hoe belangrijk is een hoog veiligheidsgevoel voor jou?", minLabel: "Weinig zorgen om", maxLabel: "Zeer belangrijk" },
  { id: "safety_2", dimensionKey: "safety", category: "Veiligheid", type: "statement", text: "Ik wil 's avonds laat zonder zorgen buiten kunnen lopen." },
  { id: "safety_3", dimensionKey: "safety", category: "Veiligheid", type: "choice", text: "Hoe ga jij om met een plek die iets minder veilig is maar wel bij je past?", options: [
    { label: "Nee, veiligheid gaat voor alles", score: 9 },
    { label: "Kan een lichte afweging zijn", score: 5 },
    { label: "Maakt me weinig uit", score: 2 },
  ] },

  // 11. healthcare
  { id: "health_1", dimensionKey: "healthcare", category: "Gezondheidszorg", type: "slider", text: "Hoe belangrijk is goede, toegankelijke gezondheidszorg?", minLabel: "Niet zo belangrijk", maxLabel: "Zeer belangrijk" },
  { id: "health_2", dimensionKey: "healthcare", category: "Gezondheidszorg", type: "statement", text: "Ik heb een zorg-gerelateerde reden (leeftijd, conditie) om extra op zorgkwaliteit te letten." },
  { id: "health_3", dimensionKey: "healthcare", category: "Gezondheidszorg", type: "choice", text: "Hoe belangrijk is snelle toegang tot specialistische zorg?", options: [
    { label: "Niet nodig", score: 2 },
    { label: "Fijn om te hebben", score: 5 },
    { label: "Essentieel", score: 9 },
  ] },

  // 12. education
  { id: "edu_1", dimensionKey: "education", category: "Onderwijs", type: "slider", text: "Hoe belangrijk is de kwaliteit van scholen/universiteiten in de buurt?", minLabel: "Niet van toepassing/belangrijk", maxLabel: "Zeer belangrijk" },
  { id: "edu_2", dimensionKey: "education", category: "Onderwijs", type: "choice", text: "Is onderwijs een factor voor jou (bv. door kinderen of eigen studie)?", options: [
    { label: "Nee, niet relevant", score: 2 },
    { label: "Een beetje", score: 5 },
    { label: "Ja, heel belangrijk", score: 9 },
  ] },
  { id: "edu_3", dimensionKey: "education", category: "Onderwijs", type: "statement", text: "Goed internationaal onderwijs is een harde eis voor mij." },

  // 13. family_relation
  { id: "family_1", dimensionKey: "family_relation", category: "Gezin & relatie", type: "choice", text: "Wat beschrijft jouw situatie het best?", options: [
    { label: "Alleen, flexibel", score: 3 },
    { label: "Met partner", score: 5 },
    { label: "Met kinderen/familie erbij", score: 8 },
  ] },
  { id: "family_2", dimensionKey: "family_relation", category: "Gezin & relatie", type: "slider", text: "Hoe belangrijk is het dat familie dichtbij (bereikbaar) blijft?", minLabel: "Niet belangrijk", maxLabel: "Heel belangrijk" },
  { id: "family_3", dimensionKey: "family_relation", category: "Gezin & relatie", type: "statement", text: "Een gezinsvriendelijke, veilige buurt weegt zwaar mee in mijn keuze." },

  // 14. mobility_transport
  { id: "mobility_1", dimensionKey: "mobility_transport", category: "Mobiliteit & vervoer", type: "slider", text: "Hoe belangrijk is het dat je geen auto nodig hebt?", minLabel: "Auto vind ik geen probleem", maxLabel: "Ik wil zonder auto kunnen leven" },
  { id: "mobility_2", dimensionKey: "mobility_transport", category: "Mobiliteit & vervoer", type: "statement", text: "Ik wil overal met fiets of openbaar vervoer kunnen komen." },
  { id: "mobility_3", dimensionKey: "mobility_transport", category: "Mobiliteit & vervoer", type: "choice", text: "Hoe verplaats jij je het liefst dagelijks?", options: [
    { label: "Auto", score: 2 },
    { label: "Fiets/lopen", score: 8 },
    { label: "Openbaar vervoer", score: 8 },
  ] },

  // 15. politics_freedom
  { id: "politics_1", dimensionKey: "politics_freedom", category: "Politiek & vrijheid", type: "slider", text: "Hoe belangrijk zijn politieke stabiliteit en persoonlijke vrijheden?", minLabel: "Niet mijn grootste zorg", maxLabel: "Zeer belangrijk" },
  { id: "politics_2", dimensionKey: "politics_freedom", category: "Politiek & vrijheid", type: "statement", text: "Ik wil ergens wonen met een stabiele democratie en betrouwbare instituties." },
  { id: "politics_3", dimensionKey: "politics_freedom", category: "Politiek & vrijheid", type: "choice", text: "Hoe zwaar weegt politieke situatie mee in je keuze?", options: [
    { label: "Nauwelijks", score: 2 },
    { label: "Redelijk", score: 5 },
    { label: "Doorslaggevend", score: 9 },
  ] },

  // 16. religion_worldview
  { id: "religion_1", dimensionKey: "religion_worldview", category: "Religie & levensbeschouwing", type: "slider", text: "Hoe belangrijk is het dat de omgeving seculier/vrijzinnig is?", minLabel: "Religie mag een grote rol spelen", maxLabel: "Ik wil een seculiere omgeving" },
  { id: "religion_2", dimensionKey: "religion_worldview", category: "Religie & levensbeschouwing", type: "statement", text: "Ik voel me het prettigst in een omgeving waar religie weinig een rol speelt." },
  { id: "religion_3", dimensionKey: "religion_worldview", category: "Religie & levensbeschouwing", type: "choice", text: "Hoe belangrijk is het dat jouw geloof/levensbeschouwing lokaal aanwezig is?", options: [
    { label: "Niet van toepassing/belangrijk", score: 8 },
    { label: "Fijn om aanwezig te zijn", score: 5 },
    { label: "Erg belangrijk om een gemeenschap te hebben", score: 2 },
  ] },

  // 17. food_cuisine
  { id: "food_1", dimensionKey: "food_cuisine", category: "Eten & keuken", type: "slider", text: "Hoe belangrijk is een rijke lokale eetcultuur voor jou?", minLabel: "Niet zo belangrijk", maxLabel: "Heel belangrijk" },
  { id: "food_2", dimensionKey: "food_cuisine", category: "Eten & keuken", type: "statement", text: "Ik ga graag vaak uit eten en wil goede, diverse restaurants dichtbij." },
  { id: "food_3", dimensionKey: "food_cuisine", category: "Eten & keuken", type: "choice", text: "Wat past het best bij jouw eetstijl?", options: [
    { label: "Ik kook liever zelf simpel", score: 3 },
    { label: "Een mooie mix van koken en uit eten", score: 6 },
    { label: "Foodie: lokale keuken is een groot deel van de aantrekkingskracht", score: 9 },
  ] },

  // 18. hobbies_freetime
  { id: "hobby_1", dimensionKey: "hobbies_freetime", category: "Hobby's & vrije tijd", type: "slider", text: "Hoe belangrijk is een breed aanbod aan hobby's/activiteiten in de buurt?", minLabel: "Niet zo belangrijk", maxLabel: "Heel belangrijk" },
  { id: "hobby_2", dimensionKey: "hobbies_freetime", category: "Hobby's & vrije tijd", type: "statement", text: "Ik vul mijn vrije tijd het liefst met veel verschillende activiteiten en uitjes." },
  { id: "hobby_3", dimensionKey: "hobbies_freetime", category: "Hobby's & vrije tijd", type: "choice", text: "Hoe breng jij je vrije tijd het liefst door?", options: [
    { label: "Rustig, thuis of in de natuur", score: 3 },
    { label: "Gemixt: soms rustig, soms actief", score: 6 },
    { label: "Altijd wel iets te doen, veel aanbod", score: 9 },
  ] },

  // 19. sports_activities
  { id: "sport_1", dimensionKey: "sports_activities", category: "Sport & activiteiten", type: "slider", text: "Hoe belangrijk zijn sport/outdoor-activiteiten (wintersport, watersport, gym) in de buurt?", minLabel: "Niet zo belangrijk", maxLabel: "Heel belangrijk" },
  { id: "sport_2", dimensionKey: "sports_activities", category: "Sport & activiteiten", type: "statement", text: "Ik sport of beoefen outdoor-activiteiten meerdere keren per week." },
  { id: "sport_3", dimensionKey: "sports_activities", category: "Sport & activiteiten", type: "choice", text: "Welke activiteiten wil je vlakbij hebben?", options: [
    { label: "Vooral gym/fitness is genoeg", score: 4 },
    { label: "Outdoor sporten zoals wandelen/fietsen", score: 7 },
    { label: "Specifieke sporten zoals wintersport of watersport", score: 9 },
  ] },

  // 20. nightlife_entertainment
  { id: "night_1", dimensionKey: "nightlife_entertainment", category: "Nachtleven & entertainment", type: "slider", text: "Hoe belangrijk is uitgaansleven/entertainment voor jou?", minLabel: "Niet zo belangrijk", maxLabel: "Heel belangrijk" },
  { id: "night_2", dimensionKey: "nightlife_entertainment", category: "Nachtleven & entertainment", type: "statement", text: "Ik ga graag regelmatig uit (bars, clubs, concerten, evenementen)." },
  { id: "night_3", dimensionKey: "nightlife_entertainment", category: "Nachtleven & entertainment", type: "choice", text: "Hoe ziet jouw ideale avond eruit?", options: [
    { label: "Rustig thuis of vroeg naar bed", score: 2 },
    { label: "Af en toe uit", score: 5 },
    { label: "Levendig nachtleven, veel te doen", score: 9 },
  ] },

  // 21. diversity_expat
  { id: "diversity_1", dimensionKey: "diversity_expat", category: "Diversiteit & expat-community", type: "slider", text: "Hoe belangrijk is een internationale, diverse omgeving met andere expats?", minLabel: "Niet zo belangrijk", maxLabel: "Heel belangrijk" },
  { id: "diversity_2", dimensionKey: "diversity_expat", category: "Diversiteit & expat-community", type: "statement", text: "Ik voel me prettiger als er al een grote internationale/expat-gemeenschap is." },
  { id: "diversity_3", dimensionKey: "diversity_expat", category: "Diversiteit & expat-community", type: "choice", text: "Hoe wil je je verhouden tot de lokale bevolking?", options: [
    { label: "Volledig opgaan in de lokale cultuur", score: 3 },
    { label: "Een mix van lokaal en internationaal", score: 6 },
    { label: "Vooral aansluiten bij een internationale/expat-community", score: 9 },
  ] },

  // 22. tax_visa
  { id: "tax_1", dimensionKey: "tax_visa", category: "Belasting, visum & regels", type: "slider", text: "Hoe belangrijk is een eenvoudig, soepel visum-/verblijfstraject?", minLabel: "Ik wil best moeite steken in papierwerk", maxLabel: "Het moet echt makkelijk zijn" },
  { id: "tax_2", dimensionKey: "tax_visa", category: "Belasting, visum & regels", type: "statement", text: "Een lage belastingdruk is een belangrijke factor in mijn keuze." },
  { id: "tax_3", dimensionKey: "tax_visa", category: "Belasting, visum & regels", type: "choice", text: "Hoe complex mag het verblijfsrecht/visumtraject zijn?", options: [
    { label: "Ik wil vrij kunnen wonen zonder gedoe (bv. EU-burger binnen EU)", score: 9 },
    { label: "Een standaard visumtraject is prima", score: 5 },
    { label: "Ik accepteer ook een complex of onzeker traject", score: 2 },
  ] },

  // 23. internet_infra
  { id: "internet_1", dimensionKey: "internet_infra", category: "Internet & infrastructuur", type: "slider", text: "Hoe belangrijk is razendsnel, betrouwbaar internet (bv. voor remote werk)?", minLabel: "Niet zo belangrijk", maxLabel: "Cruciaal" },
  { id: "internet_2", dimensionKey: "internet_infra", category: "Internet & infrastructuur", type: "statement", text: "Mijn werk/leven hangt af van stabiel, snel internet." },
  { id: "internet_3", dimensionKey: "internet_infra", category: "Internet & infrastructuur", type: "choice", text: "Hoe afhankelijk ben je van goede digitale infrastructuur?", options: [
    { label: "Nauwelijks", score: 2 },
    { label: "Redelijk", score: 5 },
    { label: "Volledig (bv. remote werk, online business)", score: 9 },
  ] },

  // 24. sustainability_environment
  { id: "sustain_1", dimensionKey: "sustainability_environment", category: "Duurzaamheid & milieu", type: "slider", text: "Hoe belangrijk zijn duurzaamheid en een groene omgeving/luchtkwaliteit voor jou?", minLabel: "Niet zo belangrijk", maxLabel: "Heel belangrijk" },
  { id: "sustain_2", dimensionKey: "sustainability_environment", category: "Duurzaamheid & milieu", type: "statement", text: "Ik let bewust op milieubeleid en duurzaamheid bij het kiezen van een plek." },
  { id: "sustain_3", dimensionKey: "sustainability_environment", category: "Duurzaamheid & milieu", type: "choice", text: "Hoe zwaar weegt milieubeleid/luchtkwaliteit mee?", options: [
    { label: "Nauwelijks", score: 2 },
    { label: "Redelijk", score: 5 },
    { label: "Erg zwaar", score: 9 },
  ] },

  // 25. future_ambitions (user-only: geen PlaceScore-match, wel gebruikt voor gewichten)
  { id: "future_1", dimensionKey: "future_ambitions", category: "Toekomst & ambities", type: "slider", text: "Hoe groot is de verandering die je zoekt in je leven?", minLabel: "Kleine, geleidelijke verbetering", maxLabel: "Compleet nieuw hoofdstuk" },
  { id: "future_2", dimensionKey: "future_ambitions", category: "Toekomst & ambities", type: "statement", text: "Over 10 jaar zie ik mezelf het liefst ergens heel anders dan nu." },
  { id: "future_3", dimensionKey: "future_ambitions", category: "Toekomst & ambities", type: "choice", text: "Wat is je grootste drijfveer om te verhuizen?", options: [
    { label: "Betere levensomstandigheden (kosten, klimaat, veiligheid)", score: 6 },
    { label: "Avontuur en een nieuwe start", score: 9 },
    { label: "Praktische reden (werk, familie, relatie)", score: 4 },
  ] },
];

export const categories = Array.from(new Set(questions.map((q) => q.category)));

// ---------------------------------------------------------------------
// Deel 2, 5, 6 — zelfde vraagmechaniek (schuif/meerkeuze/stelling), dus
// hergebruiken we de QuizFlow-machinerie via extra "categorieën" i.p.v.
// nieuwe schermen te bouwen. Deel 2 gebruikt in het concept-document echte
// foto's om te swipen; hier vervangen we dat door korte scenario-kaarten
// (geen foto-bibliotheek beschikbaar) — zelfde doel: een "gevoels"-keuze
// zonder erover na te hoeven denken. Dat is een bewuste vereenvoudiging,
// zie docs/dimensions.md.

export const bonusQuestions: Question[] = [
  // Deel 2 — "Beeld & gevoel" (swipe-vervanger)
  { id: "swipe_1", dimensionKey: "urbanicity", category: "Beeld & gevoel", type: "choice", text: "Swipe: welk plaatje spreekt je meer aan?", options: [
    { label: "🏙️ Drukke skyline vol lichtjes", score: 9 },
    { label: "🌾 Stil dorpsplein met een kerktoren", score: 2 },
  ] },
  { id: "swipe_2", dimensionKey: "nature_landscape", category: "Beeld & gevoel", type: "choice", text: "Swipe: welk plaatje spreekt je meer aan?", options: [
    { label: "🏔️ Besneeuwde bergtoppen", score: 9 },
    { label: "🏢 Strakke straat met moderne gebouwen", score: 2 },
  ] },
  { id: "swipe_3", dimensionKey: "climate", category: "Beeld & gevoel", type: "choice", text: "Swipe: welk plaatje spreekt je meer aan?", options: [
    { label: "☀️ Wit dorpje aan zee in de zon", score: 9 },
    { label: "🍂 Herfstbos met mist", score: 3 },
  ] },
  { id: "swipe_4", dimensionKey: "nightlife_entertainment", category: "Beeld & gevoel", type: "choice", text: "Swipe: welk plaatje spreekt je meer aan?", options: [
    { label: "🍸 Rooftop bar vol mensen", score: 9 },
    { label: "🛋️ Rustig café met een boek", score: 2 },
  ] },
  { id: "swipe_5", dimensionKey: "food_cuisine", category: "Beeld & gevoel", type: "choice", text: "Swipe: welk plaatje spreekt je meer aan?", options: [
    { label: "🍝 Markt vol lokale specialiteiten", score: 9 },
    { label: "🥪 Simpele lunch thuis", score: 3 },
  ] },
  { id: "swipe_6", dimensionKey: "diversity_expat", category: "Beeld & gevoel", type: "choice", text: "Swipe: welk plaatje spreekt je meer aan?", options: [
    { label: "🌍 Internationale meet-up vol talen", score: 9 },
    { label: "🏡 Traditionele lokale buurtstraat", score: 3 },
  ] },

  // Deel 5 — Dilemma's (dit-of-dat)
  { id: "dilemma_1", dimensionKey: "housing", category: "Dilemma's", type: "choice", text: "Wat kies je?", options: [
    { label: "Goedkoop huis ver van alles", score: 8 },
    { label: "Klein appartement in het centrum", score: 4 },
  ] },
  { id: "dilemma_2", dimensionKey: "climate", category: "Dilemma's", type: "choice", text: "Wat kies je?", options: [
    { label: "Fantastisch weer, saaie stad", score: 9 },
    { label: "Grijs weer, bruisende stad", score: 3 },
  ] },
  { id: "dilemma_3", dimensionKey: "safety", category: "Dilemma's", type: "choice", text: "Wat kies je?", options: [
    { label: "Superveilig maar een beetje saai", score: 9 },
    { label: "Spannend en levendig, iets minder veilig", score: 4 },
  ] },
  { id: "dilemma_4", dimensionKey: "work_career", category: "Dilemma's", type: "choice", text: "Wat kies je?", options: [
    { label: "Hoog salaris, weinig vrije tijd", score: 8 },
    { label: "Lager salaris, veel vrije tijd", score: 3 },
  ] },
  { id: "dilemma_5", dimensionKey: "social_community", category: "Dilemma's", type: "choice", text: "Wat kies je?", options: [
    { label: "Kleine hechte gemeenschap waar iedereen je kent", score: 8 },
    { label: "Grote anonieme stad waar niemand je kent", score: 3 },
  ] },
  { id: "dilemma_6", dimensionKey: "sustainability_environment", category: "Dilemma's", type: "choice", text: "Wat kies je?", options: [
    { label: "Groen en duurzaam, iets minder voorzieningen", score: 8 },
    { label: "Alle voorzieningen, minder duurzaam", score: 3 },
  ] },

  // Deel 6 — "Een dag uit jouw ideale leven"
  { id: "idealday_1", dimensionKey: "mobility_transport", category: "Een dag uit je ideale leven", type: "choice", text: "Hoe ga je naar je werk of bezigheden?", options: [
    { label: "Lopend of op de fiets", score: 9 },
    { label: "Met het openbaar vervoer", score: 7 },
    { label: "Met de auto", score: 2 },
  ] },
  { id: "idealday_2", dimensionKey: "urbanicity", category: "Een dag uit je ideale leven", type: "slider", text: "Hoe laat begint jouw ideale dag en hoe levendig is de omgeving daarna?", minLabel: "Vroeg en rustig", maxLabel: "Laat en levendig tot in de avond" },
  { id: "idealday_3", dimensionKey: "nature_landscape", category: "Een dag uit je ideale leven", type: "statement", text: "Mijn ideale dag begint of eindigt buiten, in de natuur." },
  { id: "idealday_4", dimensionKey: "hobbies_freetime", category: "Een dag uit je ideale leven", type: "choice", text: "Hoe ziet jouw avond eruit?", options: [
    { label: "Thuis, rustig", score: 3 },
    { label: "Sporten of een hobby", score: 6 },
    { label: "Op stap met vrienden", score: 9 },
  ] },
  { id: "idealday_5", dimensionKey: "food_cuisine", category: "Een dag uit je ideale leven", type: "choice", text: "Waar eet je vanavond?", options: [
    { label: "Zelf gekookt, simpel", score: 3 },
    { label: "Lokaal restaurantje om de hoek", score: 8 },
  ] },
];

export const bonusCategories = Array.from(new Set(bonusQuestions.map((q) => q.category)));

export const allQuestions = [...questions, ...bonusQuestions];
