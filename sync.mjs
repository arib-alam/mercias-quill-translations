import { readdirSync, writeFileSync } from "fs";

const sourceFiles = readdirSync("./sources");

for (const source of sourceFiles) {
  const { default: importedData } = await import(`./sources/${source}`, {
    assert: { type: "json" },
  });

  const languageData = {};

  for (const key in importedData) {
    languageData[key] = { "en-GB": importedData[key] };
  }

  const localeFolders = readdirSync("./locales");

  for (const locale of localeFolders) {
    const { default: importedLocaleData } = await import(
      `./locales/${locale}/${source}`,
      {
        assert: { type: "json" },
      }
    );

    for (const key in importedLocaleData) {
      if (importedLocaleData[key] !== languageData[key]["en-GB"]) {
        languageData[key][locale] = importedLocaleData[key];
      }
    }
  }

  writeFileSync(`./json/${source}`, JSON.stringify(languageData, null, 2));
}
