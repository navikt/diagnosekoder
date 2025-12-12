import type { DownloadFormat } from "./DownloadFormat.ts";
import type { Diagnosekode } from "@navikt/diagnosekoder";

export function processDownloaded(downloaded: DownloadFormat[]): Diagnosekode[] {
    return removeNotReportable(downloaded)
        .map(mapJsonToDiagnosekode)
        .map(normalizeCode)
}

function mapJsonToDiagnosekode(item: DownloadFormat): Diagnosekode {
    const code = item.Kode;
    const text = item.Tekst_uten_lengdebegrensning;

    if (!code || code.length === 0) {
        throw new Error(`Invalid diagnosis code: code is missing or empty (Kode: "${code || ''}")`);
    }

    if (!text || text.length === 0) {
        throw new Error(`Invalid diagnosis code: text is missing or empty for code "${code}"`);
    }

    return {
        code,
        text,
        parentCode: item.Foreldrekode ?? undefined,
        validFrom: item.Gyldig_fra ?? undefined,
        validTo: item.Gyldig_til ?? undefined,
    };
}

function removeNotReportable(downloaded: DownloadFormat[]): DownloadFormat[] {
    const validValues = [undefined, null, "", "Ja"]
    return downloaded.filter(v => {
        if(validValues.some(validValue => validValue === v.Rapporteres_til_NPR)) {
            return v.Rapporteres_til_NPR === "Ja"
        } else {
            throw new Error(`Invalid value in "Rapporteres_til_NPR" property (${v.Rapporteres_til_NPR}) in downloaded element "${v.Tekst_med_maksimalt_60_tegn}" (code ${v.Kode})`)
        }
    })
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
