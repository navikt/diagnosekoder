import {
    type DownloadFormat,
    type ICD10DownloadFormat,
    type ICPC2DownloadFormat,
    isICD10DownloadFormat, isICPC2DownloadFormat
} from "./DownloadFormat.ts";
import type { Diagnosekode } from "@navikt/diagnosekoder";

export function processDownloaded(downloaded: DownloadFormat[], validAfter: Date): Diagnosekode[] {
    return removeExpired(removeUnwantedDiagnoseCodes(downloaded), validAfter)
        .map(mapJsonToDiagnosekode)
        .map(normalizeCode)
        .toSorted((a, b) => a.code < b.code ? -1 : 1)
}

function mapJsonToDiagnosekode(item: DownloadFormat): Diagnosekode {
    const code = item.Kode;
    const text = item.Tekst_med_maksimalt_60_tegn;

    if (!code || code.length === 0) {
        throw new Error(`Invalid diagnosis code: code is missing or empty (Kode: "${code || ''}")`);
    }

    if (!text || text.length === 0) {
        throw new Error(`Invalid diagnosis code: text is missing or empty for code "${code}"`);
    }

    return {
        code,
        text,
        /* Vent med å ta dette inn i resultatet. For å enklere sammenligne med tidligere resultat
        parentCode: item.Foreldrekode ?? undefined,
        validFrom: item.Gyldig_fra ?? undefined,
        validTo: item.Gyldig_til ?? undefined,
         */
    };
}

function removeNotReportableICD10DiagnoseCodes(downloaded: ICD10DownloadFormat[]): ICD10DownloadFormat[] {
    const validValues = [undefined, null, "", "Ja"]
    return downloaded.filter(v => {
        if(validValues.some(validValue => validValue === v.Rapporteres_til_NPR)) {
            return v.Rapporteres_til_NPR === "Ja"
        } else {
            throw new Error(`Invalid value in "Rapporteres_til_NPR" property (${v.Rapporteres_til_NPR}) in downloaded element "${v.Tekst_med_maksimalt_60_tegn}" (code ${v.Kode})`)
        }
    })
}

function removeNonMainICPC2DiagnoseCodes(downloaded: ICPC2DownloadFormat[]): ICPC2DownloadFormat[] {
    const validValues = ["Diagnoser/sykdommer", "Symptomer og plager"] // All ICP2 values we want to return has one of these values in property "Foreldrekodetekst"
    return downloaded.filter(v => validValues.some(vv => v.Foreldrekodetekst === vv))
}

function removeUnwantedDiagnoseCodes(downloaded: DownloadFormat[]): ICD10DownloadFormat[] | ICPC2DownloadFormat[] {
    if(downloaded.every(isICD10DownloadFormat)) {
        return removeNotReportableICD10DiagnoseCodes(downloaded)
    }
    if(downloaded.every(isICPC2DownloadFormat)) {
        return removeNonMainICPC2DiagnoseCodes(downloaded)
    }
    throw new Error(`Unsupported DownloadFormat data`)
}

function removeExpired(downloaded: DownloadFormat[], validAfter: Date): DownloadFormat[] {
    console.debug(`removing diagnose codes not valid after ${validAfter}`)
    return downloaded.filter(v => v.Gyldig_til == null || (new Date(v.Gyldig_til)).getTime() > validAfter.getTime())
}

function normalizeCode(diagnosekode: Diagnosekode): Diagnosekode {
    // Remove all "." characters from the code
    const normalizedCode = diagnosekode.code.replace(/\./g, '');

    // Validate that the resulting code only contains A-Z, a-z and 0-9
    if (!/^[A-Za-z0-9]+$/.test(normalizedCode)) {
        throw new Error(`Invalid diagnosis code after normalization: "${normalizedCode}" (original: "${diagnosekode.code}"). Code must contain only letters A-Z and digits 0-9.`);
    }

    return {
        ...diagnosekode,
        code: normalizedCode,
    };
}
