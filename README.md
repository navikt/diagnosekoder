# diagnosekoder

Dette prosjektet publiserer npm pakke som inneholder diagnosekoder av type **ICD-10** og **ICPC-2**.

Disse brukes i diverse systemet utviklet i NAV.

Informasjonen (diagnosekodene) blir hentet fra https://www.ehelse.no/kodeverk-og-terminologi

Det blir vanligvis publisert oppdatert versjon av diagnosekodene hvert år. Når det skjer vil vi publisere ny pakkeversjon.

Versjonsnr vil følge semver, det vil si at vanlige årlige oppdateringer som er bakoverkompatible blir oppdatert med minor versjonsnr.

## Bruk diagnosekodene i ditt prosjekt

### typescript/javascript

Du må allerede ha satt opp prosjektet ditt til å hente @navikt-scopet fra github packages.

```
yarn add @navikt/diagnosekoder
```

eller

```
npm install @navikt/diagnosekoder
```

Etter installasjon kan diagnosekoder importeres og brukes slik:

```typescript
import ICD10 from '@navikt/diagnosekoder/ICD10';
import ICPC2 from '@navikt/diagnosekoder/ICPC2';

const myIcd10 = ICD10;
const myIcpc2 = ICPC2;

```

## Oppdatering av diagnosekoder

ICD-10 Diagnosekoder hentes fra [Direktorated for e-helse](https://www.ehelse.no/kodeverk-og-terminologi/ICD-10-og-ICD-11).
ICPC-2 Diagnosekoder hentes fra [Direktorated for e-helse](https://www.ehelse.no/kodeverk-og-terminologi/ICPC-2).

Det kommer normalt ny versjon av diagnosekodene hvert år.
Url som må oppdateres i koden ligger i _packages/diagnosekode-generator/src/generator.ts_:

```typescript
const urls = {
  icd10: "oppdatert-url.xlsx",
  icpc2: "oppdatert-url.xlsx",
};
```

## Generering av nye koder

Kjør _generate_ script i _packages/diagnosekode-generator_ for å generere nye json filer i _packages/@navikt/diagnosekoder/src/_.

Bygg (og publiser) deretter _@navikt/diagnosekoder_ pakken.

```shell
npm install --workspaces && 
npm run generate --workspace=diagnosekode-generator &&
npm run build --workspace=@navikt/diagnosekoder
```

## Henvendelser

Dette prosjeket er vedlikeholdt av [navikt/teamsykmelding](CODEOWNERS)

Spørsmål knyttet til koden eller prosjektet kan stilles som
[issues](https://github.com/navikt/syfodiagnosecodegeneratorjson/issues) her på GitHub

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-sykmelding](https://nav-it.slack.com/archives/CMA3XV997)
