import type { DownloadFormat } from "../DownloadFormat.ts";
import { processDownloaded } from "../processing.ts";
import type { Diagnosekode } from "@navikt/diagnosekoder";

const testValidDownloadProcessing = () => {
    const someDownloaded: DownloadFormat[] = [
        {
            "Kode": "I",
            "Tekst_uten_lengdebegrensning": "(A00-B99) Visse infeksjonssykdommer og parasittsykdommer",
            "Tekst_med_maksimalt_60_tegn": null,
            "Gyldig_fra": "1999-01-01T00:00:00",
            "Gyldig_til": null,
            "Rapporteres_til_NPR": null,
            "NPR_Gyldig_fra": null,
            "NPR_Gyldig_til": null,
            "Stjernekode": null,
            "Tilleggskode": null,
            "Kjønn": null,
            "Uspesifikk_kode": null,
            "Foreldrekode": null,
            "Foreldrekodetekst": null
        },
        {
            "Kode": "A00-A09",
            "Tekst_uten_lengdebegrensning": "Infeksiøse tarmsykdommer",
            "Tekst_med_maksimalt_60_tegn": null,
            "Gyldig_fra": "1999-01-01T00:00:00",
            "Gyldig_til": null,
            "Rapporteres_til_NPR": null,
            "NPR_Gyldig_fra": null,
            "NPR_Gyldig_til": null,
            "Stjernekode": null,
            "Tilleggskode": null,
            "Kjønn": null,
            "Uspesifikk_kode": null,
            "Foreldrekode": "I",
            "Foreldrekodetekst": "(A00-B99) Visse infeksjonssykdommer og parasittsykdommer"
        },
        {
            "Kode": "A00",
            "Tekst_uten_lengdebegrensning": "Kolera (cholera)",
            "Tekst_med_maksimalt_60_tegn": null,
            "Gyldig_fra": "1999-01-01T00:00:00",
            "Gyldig_til": null,
            "Rapporteres_til_NPR": null,
            "NPR_Gyldig_fra": "1999-01-01T00:00:00",
            "NPR_Gyldig_til": "2004-12-31T23:59:00",
            "Stjernekode": null,
            "Tilleggskode": null,
            "Kjønn": null,
            "Uspesifikk_kode": null,
            "Foreldrekode": "A00-A09",
            "Foreldrekodetekst": "Infeksiøse tarmsykdommer"
        },
        {
            "Kode": "A00.0",
            "Tekst_uten_lengdebegrensning": "Kolera som skyldes Vibrio cholerae 01, biovar cholerae",
            "Tekst_med_maksimalt_60_tegn": "Kolera som skyldes Vibrio cholerae 01, biovar cholerae",
            "Gyldig_fra": "1999-01-01T00:00:00",
            "Gyldig_til": null,
            "Rapporteres_til_NPR": "Ja",
            "NPR_Gyldig_fra": "1999-01-01T00:00:00",
            "NPR_Gyldig_til": null,
            "Stjernekode": null,
            "Tilleggskode": null,
            "Kjønn": null,
            "Uspesifikk_kode": null,
            "Foreldrekode": "A00",
            "Foreldrekodetekst": "Kolera (cholera)"
        },
        {
            "Kode": "A00.1",
            "Tekst_uten_lengdebegrensning": "Kolera som skyldes Vibrio cholerae 01, biovar eltor",
            "Tekst_med_maksimalt_60_tegn": "Kolera som skyldes Vibrio cholerae 01, biovar eltor",
            "Gyldig_fra": "1999-01-01T00:00:00",
            "Gyldig_til": null,
            "Rapporteres_til_NPR": "Ja",
            "NPR_Gyldig_fra": "1999-01-01T00:00:00",
            "NPR_Gyldig_til": null,
            "Stjernekode": null,
            "Tilleggskode": null,
            "Kjønn": null,
            "Uspesifikk_kode": null,
            "Foreldrekode": "A00",
            "Foreldrekodetekst": "Kolera (cholera)"
        },
        {
            "Kode": "A00.9",
            "Tekst_uten_lengdebegrensning": "Uspesifisert kolera",
            "Tekst_med_maksimalt_60_tegn": "Uspesifisert kolera",
            "Gyldig_fra": "1999-01-01T00:00:00",
            "Gyldig_til": null,
            "Rapporteres_til_NPR": "Ja",
            "NPR_Gyldig_fra": "1999-01-01T00:00:00",
            "NPR_Gyldig_til": null,
            "Stjernekode": null,
            "Tilleggskode": null,
            "Kjønn": null,
            "Uspesifikk_kode": "Ja",
            "Foreldrekode": "A00",
            "Foreldrekodetekst": "Kolera (cholera)"
        },
        {
            "Kode": "A01",
            "Tekst_uten_lengdebegrensning": "Tyfoidfeber og paratyfoidfeber",
            "Tekst_med_maksimalt_60_tegn": null,
            "Gyldig_fra": "1999-01-01T00:00:00",
            "Gyldig_til": null,
            "Rapporteres_til_NPR": null,
            "NPR_Gyldig_fra": "1999-01-01T00:00:00",
            "NPR_Gyldig_til": "2004-12-31T23:59:00",
            "Stjernekode": null,
            "Tilleggskode": null,
            "Kjønn": null,
            "Uspesifikk_kode": null,
            "Foreldrekode": "A00-A09",
            "Foreldrekodetekst": "Infeksiøse tarmsykdommer"
        },
        {
            "Kode": "A01.0",
            "Tekst_uten_lengdebegrensning": "Tyfoidfeber",
            "Tekst_med_maksimalt_60_tegn": "Tyfoidfeber",
            "Gyldig_fra": "1999-01-01T00:00:00",
            "Gyldig_til": null,
            "Rapporteres_til_NPR": "Ja",
            "NPR_Gyldig_fra": "1999-01-01T00:00:00",
            "NPR_Gyldig_til": null,
            "Stjernekode": null,
            "Tilleggskode": null,
            "Kjønn": null,
            "Uspesifikk_kode": null,
            "Foreldrekode": "A01",
            "Foreldrekodetekst": "Tyfoidfeber og paratyfoidfeber"
        }
    ]

    const diagnosekoder = processDownloaded(someDownloaded)


    const forventaDiagnosekoder: Diagnosekode[] = [
        {code: "A000", text: "Kolera som skyldes Vibrio cholerae 01, biovar cholerae"},
        {code: "A001", text: "Kolera som skyldes Vibrio cholerae 01, biovar eltor"},
        {code: "A009", text: "Uspesifisert kolera"},
        {code: "A010", text: "Tyfoidfeber"},
    ]

    if(diagnosekoder.length != forventaDiagnosekoder.length) {
        throw new Error(`Forventa ${forventaDiagnosekoder.length} diagnosekoder, fikk ${diagnosekoder.length} diagnosekoder etter prosessering`)
    }


    for(let i = 0; i < diagnosekoder.length; i++) {
        const diagnosekode = diagnosekoder[i];
        const forventaDiagnosekode = forventaDiagnosekoder[i];
        if(diagnosekode.code !== forventaDiagnosekode.code || diagnosekode.text !== forventaDiagnosekode.text) {
            throw new Error(`Forventa diagnosekode ${forventaDiagnosekode}, fikk ${diagnosekode} (${i})`)
        }
    }
}

const testInvalidDownloadProcessing = () => {
    const someInvalid: DownloadFormat[] = [
        {
            "Kode": "X01-0",
            "Tekst_uten_lengdebegrensning": "xoxox",
        }
    ]

    try {
        processDownloaded(someInvalid)
        throw "did not fail"
    } catch (e) {
        if(e === "did not fail") {
            throw new Error(`testInvalidDownloadProcessing did not fail as expected`)
        }
    }
}

function test() {
    testValidDownloadProcessing()
    testInvalidDownloadProcessing()
}

test()