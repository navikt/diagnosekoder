export interface DownloadFormat {
    readonly Kode?: string | null;
    readonly Tekst_med_maksimalt_60_tegn?: string | null;
    readonly Tekst_uten_lengdebegrensning?: string | null;
    readonly Foreldrekode?: string | null;
    readonly Gyldig_fra?: string | null;
    readonly Gyldig_til?: string | null;
    readonly Rapporteres_til_NPR?: string | null;
    readonly "NPR_Gyldig_fra"?: string | null;
    readonly "NPR_Gyldig_til"?: string | null;
    readonly "Stjernekode"?: string | null;
    readonly "Tilleggskode"?: string | null;
    readonly "Kjønn"?: string | null;
    readonly "Uspesifikk_kode"?: string | null;
    readonly "Foreldrekodetekst"?: string | null;
}
