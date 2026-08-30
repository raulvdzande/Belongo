// Deel 4 van de test: harde filters. Gebruiker kiest uit veelvoorkomende
// deal-breakers ("mag niet") en must-haves ("moet") en kan zelf iets toevoegen.

export type DealBreakerType = "EXCLUDE" | "REQUIRE";

export interface DealBreakerOption {
  label: string;
}

export const excludeOptions: DealBreakerOption[] = [
  { label: "Geen sneeuw / winterkou" },
  { label: "Geen extreme hitte" },
  { label: "Geen politieke instabiliteit" },
  { label: "Geen ingewikkeld of onzeker visumtraject" },
  { label: "Geen hoge criminaliteit" },
  { label: "Geen slechte internetverbinding" },
];

export const requireOptions: DealBreakerOption[] = [
  { label: "Zee of kust dichtbij" },
  { label: "Huisdier moet mee kunnen" },
  { label: "Goede internationale/Engelstalige scholen" },
  { label: "Direct vliegveld met internationale vluchten" },
  { label: "Legale verblijfsstatus/visum haalbaar voor mij" },
  { label: "Goede toegang tot gezondheidszorg" },
];

export interface SelectedDealBreaker {
  label: string;
  type: DealBreakerType;
}
