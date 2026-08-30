// Deel 7 — praktische situatie: maakt het verhuisplan realistisch.

export type MovingBudget = "KRAP" | "GEMIDDELD" | "RUIM";
export type LanguageLevel = "GEEN" | "BASIS" | "GEVORDERD" | "VLOEIEND";

export interface PracticalInput {
  nationality: string;
  remoteWork: boolean;
  hasKids: boolean;
  movingBudget: MovingBudget;
  languageLevel: LanguageLevel;
}

export const movingBudgetLabels: Record<MovingBudget, string> = {
  KRAP: "Krap — ik moet echt op de kleintjes letten",
  GEMIDDELD: "Gemiddeld — een paar duizend euro speelruimte",
  RUIM: "Ruim — geld is geen belemmering",
};

export const languageLevelLabels: Record<LanguageLevel, string> = {
  GEEN: "Geen ervaring met andere talen",
  BASIS: "Basiskennis van een paar talen",
  GEVORDERD: "Gevorderd — leer snel een nieuwe taal",
  VLOEIEND: "Vloeiend meertalig",
};
