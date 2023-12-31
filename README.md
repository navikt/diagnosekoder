# diagnosekoder

Dette prosjektet publiserer en npm pakke [_(@navikt/diagnosekoder)_](https://github.com/navikt/diagnosekoder/pkgs/npm/diagnosekoder) 
og en java (kotlin) pakke [_(no.nav.helse.diagnosekoder)_](https://github.com/navikt/diagnosekoder/packages/1919232), som 
inneholder diagnosekoder av type **ICD-10** og **ICPC-2**.

Disse er tenkt brukt i diverse systemer utviklet i NAV.

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

### Java

Se instruksjoner for installasjon på [pakke-siden](https://github.com/navikt/diagnosekoder/packages/1919232).

Eksempel på bruk fra java:

```java
import no.nav.helse.diagnosekoder.Diagnosekoder;
import java.util.Map;

public class Main {
   public static void main(String[] args) {
      Map<String, Diagnosekoder.ICD10> dk = Diagnosekoder.INSTANCE.getIcd10();
      int count = dk.size();
      System.out.println("Diagnosekode count: " + count);
   }
}
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
2. Kjør github action workflow [Generate diagnose codes](https://github.com/navikt/diagnosekoder/actions/workflows/generate-codes.yml) på ny branch.
   - Fyll inn nye url adresser i input feltene som da kommer frem. 
3. Kjør github action workflow  [Increment package versions](https://github.com/navikt/diagnosekoder/actions/workflows/increment-version.yml) på branch du jobber på.
4. - Velg inkrementeringsmåte _(patch eller year)_. 
   - For årlig oppdatering av nye diagnosekoder, velg _year_ og fyll inn korrekt årstall i inputfeltet for det.
   - For bugfikser eller andre bakoverkompatible endringer som ikke er en ny "årlig oppdatering", velg _patch_.
5. Lag PR med endringene actions har generert fra branch til master
6. Review og merge PR til master
7. Kjør github action workflow [Publish @navikt/diagnosekoder npm](https://github.com/navikt/diagnosekoder/actions/workflows/publish.yml) på master. Dette publiserer ny versjon av npm pakken i github registry.

#### Lokalt
Hvis man ikke vil gjøre det via github actions kan nye koder og versjonsoppdatering også gjøres lokalt:
1. Sjekk ut koden
2. Oppdater urler i _/configs/_ katalogen
3. Kjør kodegenerator og test resultatet
   ```shell
   npm install --workspaces && 
   npm run build --workspace=@navikt/diagnosekoder &&
   npm run generate --workspace=diagnosekode-generator &&
   npm run test --workspace=@navikt/diagnosekoder &&
   cd java/diagnosekoder &&
   ./gradlew test &&
   cd ../..
   ```
4. Oppdater versjon på @navikt/diagnosekoder npm pakke med `npm version` viss ny versjon skal publiseres.
5. Oppdater versjon på no.nav.helse.diagnosekoder kotlin pakke viss ny versjon skal publiseres.
6. Commit og push endringer.

## Henvendelser

Dette prosjeket er vedlikeholdt av [navikt/k9saksbehandling](CODEOWNERS) 

Spørsmål knyttet til koden eller prosjektet kan stilles som
[issues](https://github.com/navikt/syfodiagnosecodegeneratorjson/issues) her på GitHub

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-sykmelding](https://nav-it.slack.com/archives/CMA3XV997)
