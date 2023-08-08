# diagnosekoder

Dette prosjektet publiserer npm pakke som inneholder diagnosekoder av type **ICD-10** og **ICPC-2**.

Disse brukes i diverse systemer utviklet i NAV.

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

## Oppdatering av publiserte diagnosekoder

ICD-10 og ICPC-2 Diagnosekoder hentes fra Direktoratet for e-helse:
 - https://www.ehelse.no/kodeverk-og-terminologi/ICD-10-og-ICD-11
-  https://www.ehelse.no/kodeverk-og-terminologi/ICPC-2

Det kommer normalt ny versjon av diagnosekodene hvert år.

Urler som kodegenerator bruker må da oppdateres og det må publiseres ny pakkeversjon.

### Publiseringsprosedyre

#### Via Github Actions

1. Opprett en ny branch på repoet.
2. Kjør [github action workflow](https://github.com/navikt/diagnosekoder/actions) _Generate new diagnose codes_ på ny branch.
   - Fyll inn nye url adresser i input feltene som da kommer frem, og velg om/hvordan versjonsnr skal oppdateres. 
3. Lag PR med endringene action generer fra branch til master
4. Review og merge PR til master
5. Kjør [github action workflow](https://github.com/navikt/diagnosekoder/actions) _Publish diagnose codes_ på master.

#### Lokalt
Hvis man ikke vil gjøre det via github actions kan nye koder og versjonsoppdatering også gjøres lokalt:
1. Sjekk ut koden
2. Oppdater urler i _/configs/_ katalogen
3. Kjør kodegenerator og test resultatet
   ```shell
   npm install --workspaces && 
   npm run build --workspace=@navikt/diagnosekoder &&
   npm run generate --workspace=diagnosekode-generator &&
   npm run test --workspace=@navikt/diagnosekoder
   ```
4. Oppdater versjon med `npm version` viss ny pakke skal publiseres.
5. Commit og push endringer.

## Henvendelser

Dette prosjeket er vedlikeholdt av [navikt/teamsykmelding og navikt/k9saksbehandling](CODEOWNERS) 

Spørsmål knyttet til koden eller prosjektet kan stilles som
[issues](https://github.com/navikt/syfodiagnosecodegeneratorjson/issues) her på GitHub

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-sykmelding](https://nav-it.slack.com/archives/CMA3XV997)
