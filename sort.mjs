import { readdirSync, writeFileSync } from "fs";

const sourceFiles = readdirSync("./sources");

for (const source of sourceFiles) {
  const { default: importedData } = await import(`./sources/${source}`, {
    assert: { type: "json" },
  });

  const sortedData = {};

  const keys = Object.keys(importedData).sort();
  for (const key of keys) sortedData[key] = importedData[key];

  writeFileSync(`./sources/${source}`, JSON.stringify(sortedData, null, 4));
}
