# diagnosekoder

### Oppdatering av diagnosekoder

Diagnosekoder, både ICD10 og ICPC2, får vi fra [Direktorated for e-helse](https://www.ehelse.no/kodeverk-og-terminologi/ICD-10-og-ICD-11).

Det kommer normalt ny versjon av diagnosekodene hvert år.
Url som må oppdateres i koden ser slik ut:

```typescript
const xlsxs = {
  icd10: "oppdatert-url.xlsx",
  icpc2: "oppdatert-url.xlsx",
};
```

## Installasjon

1. Installer `bun`: https://bun.sh/docs/installation
2. Kjør `bun install`

## Generer nye koder

1. Kjør `bun run gen`

## Henvendelser

Dette prosjeket er vedlikeholdt av [navikt/teamsykmelding](CODEOWNERS)

Spørsmål knyttet til koden eller prosjektet kan stilles som
[issues](https://github.com/navikt/syfodiagnosecodegeneratorjson/issues) her på GitHub

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-sykmelding](https://nav-it.slack.com/archives/CMA3XV997)
