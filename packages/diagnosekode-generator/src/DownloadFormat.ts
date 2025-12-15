export interface DownloadFormat {
    readonly Kode: string;
    readonly Tekst_med_maksimalt_60_tegn: string | null;
    readonly Tekst_uten_lengdebegrensning: string | null;
    readonly Foreldrekode: string | null;
    readonly Gyldig_fra: string | null;
    readonly Gyldig_til: string | null;
    readonly "Foreldrekodetekst": string | null;
}

const isStringOrNull = (v: unknown): v is string | null => typeof v === "string" || v === null

export const isDownloadFormat = (v: unknown): v is DownloadFormat =>
    typeof v === "object" && v != null &&
    "Kode" in v && isStringOrNull(v.Kode) &&
    "Tekst_med_maksimalt_60_tegn" in v && isStringOrNull(v.Tekst_med_maksimalt_60_tegn) &&
    "Tekst_uten_lengdebegrensning" in v && isStringOrNull(v.Tekst_uten_lengdebegrensning) &&
    "Gyldig_fra" in v && isStringOrNull(v.Gyldig_fra) &&
    "Gyldig_til" in v && isStringOrNull(v.Gyldig_til) &&
    "Foreldrekode" in v && isStringOrNull(v.Foreldrekode) &&
    "Foreldrekodetekst" in v && isStringOrNull(v.Foreldrekodetekst)


export interface ICD10DownloadFormat extends DownloadFormat {
    readonly Rapporteres_til_NPR: string | null;
    readonly "NPR_Gyldig_fra"?: string | null;
    readonly "NPR_Gyldig_til"?: string | null;
    readonly "Stjernekode"?: string | null;
    readonly "Tilleggskode"?: string | null;
    readonly "Kjønn"?: string | null;
    readonly "Uspesifikk_kode"?: string | null;
    readonly "Kodeverk"?: never;
}

export const isICD10DownloadFormat = (v: unknown): v is ICD10DownloadFormat =>
    isDownloadFormat(v) &&
    "Rapporteres_til_NPR" in v && isStringOrNull(v.Rapporteres_til_NPR) &&
    !("Kodeverk" in v)

export interface ICPC2DownloadFormat extends DownloadFormat {
    readonly Rapporteres_til_NPR?: never;
    readonly Kodeverk: string | null;
    readonly "Tilhørighet_i_ICPC-2B"?: string | null;
}

export const isICPC2DownloadFormat = (v: unknown): v is ICPC2DownloadFormat =>
    isDownloadFormat(v) &&
    "Kodeverk" in v && isStringOrNull(v.Kodeverk) &&
    !("Rapporteres_til_NPR" in v)