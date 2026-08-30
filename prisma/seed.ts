import { db } from "../src/lib/db";
import { dimensions } from "./seed-data/dimensions";
import { countries } from "./seed-data/countries";
import { cityBoostFor, deriveScores } from "./seed-data/score";

async function main() {
  console.log(`Seeding ${dimensions.length} dimensions...`);
  const dimensionIds = new Map<string, string>();
  for (const d of dimensions) {
    const row = await db.dimension.upsert({
      where: { key: d.key },
      update: { name: d.name, category: d.category },
      create: { key: d.key, name: d.name, category: d.category },
    });
    dimensionIds.set(d.key, row.id);
  }

  let placeCount = 0;
  let scoreCount = 0;

  for (const country of countries) {
    const countryPlace = await db.place.create({
      data: {
        name: country.name,
        level: "COUNTRY",
        countryCode: country.iso2,
      },
    });
    placeCount++;

    const countryScores = deriveScores(country);
    await db.placeScore.createMany({
      data: Object.entries(countryScores).map(([key, score]) => ({
        placeId: countryPlace.id,
        dimensionId: dimensionIds.get(key)!,
        score,
      })),
    });
    scoreCount += Object.keys(countryScores).length;

    for (const city of country.cities) {
      const cityPlace = await db.place.create({
        data: {
          name: city.name,
          level: "CITY",
          countryCode: country.iso2,
          parentId: countryPlace.id,
        },
      });
      placeCount++;

      const cityScores = deriveScores(country, cityBoostFor(city.major));
      await db.placeScore.createMany({
        data: Object.entries(cityScores).map(([key, score]) => ({
          placeId: cityPlace.id,
          dimensionId: dimensionIds.get(key)!,
          score,
        })),
      });
      scoreCount += Object.keys(cityScores).length;
    }
  }

  console.log(`Seeded ${placeCount} places and ${scoreCount} scores.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
