import { readdirSync, writeFileSync } from "fs";

const sourceFiles = readdirSync("./sources");

for (const source of sourceFiles) {
    const { default: importedData } = await import(`./sources/${source}`, {
        assert: { type: "json" },
    });

    const languageData = {};

    for (const key in importedData) {
        const formattedKey = formatKey(source, key);
        languageData[formattedKey] = { "en-GB": importedData[key] };
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
            const formattedKey = formatKey(source, key);
            if (
                importedLocaleData[key] !== languageData[formattedKey]["en-GB"]
            ) {
                languageData[formattedKey][locale] = importedLocaleData[key];
            }
        }
    }

    writeFileSync(`./json/${source}`, JSON.stringify(languageData, null, 2));
}

function formatKey(base, key) {
    const baseWithoutExtension = base.replace(".json", "");
    return key.replace(baseWithoutExtension + ".", "");
}
