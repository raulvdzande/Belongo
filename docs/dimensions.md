# Match dimensions (definitief — v1)

25 dimensies, gebaseerd op de 25 categorieën uit `PROJECT.md` deel 2. Elke dimensie krijgt een `key` (gebruikt in de database/`Dimension.key`) en een `category` (voor groepering in de UI).

24 dimensies zijn **plek-scoorbaar**: elke `Place` (land/stad) krijgt hierop een score 0–10 in `PlaceScore`. Dimensie 25 ("Toekomst & ambities") is **niet** plek-scoorbaar — die zegt iets over de gebruiker zelf (waar iemand over 10 jaar wil staan), niet over een plek, en wordt alleen gebruikt om de gewichten van de andere dimensies te kalibreren tijdens het invullen van het profiel.

| # | key | name | category | place-scorable |
|---|-----|------|----------|-----------------|
| 1 | `climate` | Klimaat & weer | fysiek | ja |
| 2 | `cost_of_living` | Budget & kosten van leven | financieel | ja |
| 3 | `housing` | Huisvesting | financieel | ja |
| 4 | `work_career` | Werk & carrière | financieel | ja |
| 5 | `language` | Taal | cultuur | ja |
| 6 | `culture_mentality` | Cultuur & mentaliteit | cultuur | ja |
| 7 | `nature_landscape` | Natuur & landschap | fysiek | ja |
| 8 | `urbanicity` | Stad vs dorp | fysiek | ja |
| 9 | `social_community` | Sociaal leven & community | sociaal | ja |
| 10 | `safety` | Veiligheid | basis | ja |
| 11 | `healthcare` | Gezondheidszorg | basis | ja |
| 12 | `education` | Onderwijs | basis | ja |
| 13 | `family_relation` | Gezin & relatie | sociaal | ja |
| 14 | `mobility_transport` | Mobiliteit & vervoer | fysiek | ja |
| 15 | `politics_freedom` | Politiek & vrijheid | basis | ja |
| 16 | `religion_worldview` | Religie & levensbeschouwing | cultuur | ja |
| 17 | `food_cuisine` | Eten & keuken | cultuur | ja |
| 18 | `hobbies_freetime` | Hobby's & vrije tijd | sociaal | ja |
| 19 | `sports_activities` | Sport & activiteiten | sociaal | ja |
| 20 | `nightlife_entertainment` | Nachtleven & entertainment | sociaal | ja |
| 21 | `diversity_expat` | Diversiteit & expat-community | sociaal | ja |
| 22 | `tax_visa` | Belasting, visum & regels | basis | ja |
| 23 | `internet_infra` | Internet & infrastructuur | fysiek | ja |
| 24 | `sustainability_environment` | Duurzaamheid & milieu | fysiek | ja |
| 25 | `future_ambitions` | Toekomst & ambities | gebruiker | nee (user-only) |

Scores lopen van 0–10 (10 = sterkst aanwezig/best op die dimensie, bv. `cost_of_living` 10 = zeer betaalbaar, `safety` 10 = zeer veilig). Bij het matchen wordt dit vergeleken met de gewogen profielscore van de gebruiker (zie `PROJECT.md` §3).

## Status van de eerste dataset (v1 seed)

Voor de eerste seed (zie `prisma/seed-data/countries.ts`) zijn **klimaat, kosten van leven, veiligheid, gezondheidszorg, politiek/vrijheid, internet, duurzaamheid** en **diversiteit** gebaseerd op algemene, bekende kenmerken per land (klimaatzone, kostenniveau, veiligheidsniveau, EU/Schengen-status, ontwikkelingsniveau). De overige dimensies (cultuur, natuur, sociaal leven, nachtleven, sport, taal, eten, etc.) zijn afgeleid met een eenvoudige formule uit diezelfde basiskenmerken — dit zijn **grove eerste schattingen**, geen geverifieerde data. Voordat dit live gaat: vervang per dimensie de bronnen door echte indexen (Numbeo, Global Peace Index, Freedom House, klimaatdata, etc.) zoals beschreven in `PROJECT.md` §6.

### Handmatige steekproef (v1 seed, 2026-08-30)

5 plekken gecontroleerd tegen bekende feiten:

- **Noorwegen** — `safety` 10, `cost_of_living` 2, `climate` 2, `sustainability_environment` 10 → klopt (veilig, duur, koud, groen).
- **Zwitserland** — `cost_of_living` 2, `safety` 10 → klopt (zeer duur, zeer veilig).
- **Griekenland** — `climate` 9, `food_cuisine` 10, `cost_of_living` 8 → klopt (warm, beroemde keuken, relatief betaalbaar binnen W-Europa).
- **Oekraïne** — `safety` 4, `politics_freedom` 4, `cost_of_living` 10 → klopt richting (onveilig/instabiel, zeer goedkoop).
- **Amsterdam (stad)** — `urbanicity` 10, `nightlife_entertainment` 10, `housing` 1.8 (vs. Nederland-land 2) → klopt (zeer stedelijk, uitgaansleven, notoir dure/schaarse woningmarkt).

Resultaat: richting van de scores is consistent met de werkelijkheid op alle 5 steekproeven. Absolute waarden op de afgeleide (niet-factuele) dimensies blijven schattingen.

## Fase 3 — matching-algoritme: tuning-log

Bij het testen van het matching-algoritme (`src/lib/match.ts`) met 5 nep-profielen (budget backpacker, veiligheidsbewust gezin, digital nomad, rijke pensionado, politiek-stabiliteit-zoeker — zie het testscript dat tijdens de sessie is gebruikt en weer opgeruimd) viel op dat microstaatjes (San Marino, Monaco, Vaticaanstad, Andorra, Liechtenstein) structureel bovenaan eindigden bij "klein, veilig, rustig"-achtige profielen. Logisch qua veiligheid/rust, maar deze landen hebben in werkelijkheid een notoir restrictief immigratiebeleid en een minuscule arbeidsmarkt — niet iets wat `freedomTier` (politieke vrijheid, wél hoog) vangt.

**Aanpassing:** een `microstate`-vlag in `prisma/seed-data/countries.ts` die in `score.ts` een vaste straf (-4) toepast op `tax_visa` en `work_career` voor deze 5 landen. Na deze aanpassing (en het herseeden van de database) blijven ze in de resultaten staan waar ze qua profiel logisch passen, maar domineren ze niet meer onterecht elk "veilig + rustig"-profiel.

Overige observaties die logisch aanvoelden en dus **niet** zijn aangepast:
- Budgetbewuste/avontuurlijke profielen concentreren zich op de Balkan (Servië, Kosovo, Moldavië, Bulgarije) — klopt met de laagste `cost_of_living`-tier in de dataset.
- Digital nomad-profiel (internet, stad, expat) landt op Boedapest/Warschau/Vilnius e.d. — betaalbare, goed aangesloten grote steden — in plaats van de duurdere klassieke nomad-hotspots, omdat het testprofiel ook een gemiddeld (niet onbeperkt) budget aangaf. Dat is een correcte afweging van het algoritme, geen bug.
- Harde filters (budget/visum uit het profiel, deal-breakers) sloten in de "politieke stabiliteit"-test 84 van de 117 plekken uit — de politics_freedom- en tax_visa-drempels werken zoals bedoeld.

### Kwaliteitsronde (2026-08-30): Plan B/C en de kust-filter deden niet wat ze beloofden

Bij het doorlichten van `src/lib/match.ts` bleek dat Plan B en Plan C hun eigen labels niet waarmaakten:
- **Plan B** ("de haalbare optie") pakte gewoon rang #2 uit de gesorteerde lijst, zonder ooit te checken of die plek daadwerkelijk betaalbaarder of makkelijker qua visum was dan Plan A — de code-comment beloofde dat wel. **Fix:** Plan B kiest nu de beste match binnen de top 30 die aantoonbaar hoger scoort op `cost_of_living` en/of `tax_visa` dan Plan A; alleen als niets kwalificeert valt hij terug op rang #2.
- **Plan C** ("de wildcard") pakte gewoon rang #6 — geen enkele garantie dat dit een ander soort plek was dan Plan A/B. **Fix:** Plan C is nu de beste match uit een ánder land dan Plan A en Plan B.
- De **"Zee of kust dichtbij"**-eis gebruikte `nature_landscape` als proxy, waardoor landlocked landen als Servië (natuurscore 6, net binnen de drempel) er ten onrechte doorheen glipten. **Fix:** een expliciete lijst landlocked landen (`LANDLOCKED_COUNTRIES` in `match.ts`) toetst dit nu direct — geverifieerd dat landlocked landen (Servië, Oostenrijk, Zwitserland, Hongarije, Tsjechië, Slowakije, ...) niet meer in de top 10 verschijnen als deze eis actief staat.
- Vrij ingetypte deal-breakers werden stilzwijgend genegeerd bij het filteren, zonder dat de gebruiker dat wist. **Fix:** de testscreen toont nu een waarschuwing onder eigen toevoegingen dat die worden bewaard maar niet automatisch gecontroleerd worden.
