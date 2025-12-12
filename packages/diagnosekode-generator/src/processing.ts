import type { DownloadFormat } from "./DownloadFormat.ts";
import type { Diagnosekode } from "@navikt/diagnosekoder";

export function processDownloaded(downloaded: DownloadFormat[]): Diagnosekode[] {
    return removeParentCodes(downloaded.map(mapJsonToDiagnosekode))
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

function removeParentCodes(diagnosekoder: Diagnosekode[]): Diagnosekode[] {
    // Collect all codes that are referenced as parent codes
    const parentCodeSet = new Set<string>();
    for (const diagnosekode of diagnosekoder) {
        if (diagnosekode.parentCode) {
            parentCodeSet.add(diagnosekode.parentCode);
        }
    }

    // Filter out diagnosekoder whose code is in the parent code set
    return diagnosekoder.filter(diagnosekode => !parentCodeSet.has(diagnosekode.code));
}

function normalizeCode(diagnosekode: Diagnosekode): Diagnosekode {
    // Remove all "." characters from the code
    const normalizedCode = diagnosekode.code.replace(/\./g, '');

    // Validate that the resulting code only contains A-Z and 0-9
    if (!/^[A-Z0-9]+$/.test(normalizedCode)) {
        throw new Error(`Invalid diagnosis code after normalization: "${normalizedCode}" (original: "${diagnosekode.code}"). Code must contain only letters A-Z and digits 0-9.`);
    }

    return {
        ...diagnosekode,
        code: normalizedCode,
    };
}
