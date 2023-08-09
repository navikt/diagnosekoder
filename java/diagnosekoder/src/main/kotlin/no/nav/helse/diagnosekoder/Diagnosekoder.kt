package no.nav.helse.diagnosekoder

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import java.io.InputStream
import kotlin.reflect.KClass

object Diagnosekoder {
    val objectMapper = ObjectMapper().apply {
        registerKotlinModule()
        registerModule(JavaTimeModule())
        configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, true)
        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    }
    const val ICPC2_CODE = "2.16.578.1.12.4.1.1.7170"
    const val ICD10_CODE = "2.16.578.1.12.4.1.1.7110"
    const val ICPC2_INFOTRYGD_CODE = "5"
    const val ICD10_INFOTRYGD_CODE = "3"

    data class ICPC2(
        override val code: String,
        override val text: String,
        override val oid: String = ICPC2_CODE,
        override val infotrygdCode: String = ICPC2_INFOTRYGD_CODE
    ) : DiagnosekodeType {
    }

    data class ICD10(
        override val code: String,
        override val text: String,
        override val oid: String = ICD10_CODE,
        override val infotrygdCode: String = ICD10_INFOTRYGD_CODE
    ) : DiagnosekodeType {
    }

    val icd10 = loadCodes(Diagnosekoder::class.java.getResourceAsStream("/ICD10.json")!!, Array<ICD10>::class)
    val icpc2 = loadCodes(Diagnosekoder::class.java.getResourceAsStream("/ICPC2.json")!!, Array<ICPC2>::class)

    inline fun <reified T : DiagnosekodeType> loadCodes(jsonResource: InputStream, inputType: KClass<Array<T>>) =
        objectMapper.readValue(jsonResource, inputType.java)
            .map { it.code to it }
            .toMap()

    operator fun contains(oid: String?) = oid == ICPC2_CODE || oid == ICD10_CODE
}
