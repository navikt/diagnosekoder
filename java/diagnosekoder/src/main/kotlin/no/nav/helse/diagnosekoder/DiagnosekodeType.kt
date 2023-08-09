package no.nav.helse.diagnosekoder

interface DiagnosekodeType {
    val code: String
    val text: String
    val oid: String
    val infotrygdCode: String
}