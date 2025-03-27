import {  readdirSync, writeFileSync,  } from "fs";

const sourceFiles = readdirSync("./sources");

for (const source of sourceFiles) {
  const { default: importedData } = await import(`./sources/${source}`, {
    assert: { type: "json" },
  });

  console.log(importedData);

  const languageData = {};

  for (const key in importedData) {
    languageData[key] = { "en-GB": importedData[key] };
  }

  const localeFolders = readdirSync("./locales");

  console.log(localeFolders);

  for (const locale of localeFolders) {
    const { default: importedLocaleData } = await import(
      `./locales/${locale}/${source}`,
      {
        assert: { type: "json" },
      }
    );

    console.log(locale.replace(".json", ""));
    console.log(importedLocaleData);

    for (const key in importedLocaleData) {
      languageData[key][locale] = importedLocaleData[key];
    }
  }

  console.log(languageData);

  writeFileSync(`./json/${source}`, JSON.stringify(languageData, null, 2));
}
