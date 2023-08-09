package no.nav.helse.diagnosekoder

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

internal class DiagnosekoderTest {

    val MIN_ICD10_COUNT = 19_600
    val MAX_ICD10_COUNT = (MIN_ICD10_COUNT * 2) - 1

    @Test
    fun smokeTestIcd10() {
        val icd10 = Diagnosekoder.icd10
        val count = icd10.size
        assertTrue(count > MIN_ICD10_COUNT, "Too few ICD-10 codes")
        assertTrue(count < MAX_ICD10_COUNT, "Too many ICD-10 codes")

        // Some random samples we check that are present
        val expectedSamples: Array<Diagnosekoder.ICD10> = arrayOf(
            Diagnosekoder.ICD10(code = "A000", text = "Kolera som skyldes Vibrio cholerae 01, biovar cholerae"),
            Diagnosekoder.ICD10(code = "B377", text = "Candidasepsis"),
            Diagnosekoder.ICD10(code= "V0n1m", text = "Fotgjskad tr uly;veitrafikk;Idrett v/utd/vernepl"),
        )

        for (expected in expectedSamples) {
            assertTrue(icd10.containsKey(expected.code), "ICD-10 Diagnosekode ${expected.code} - ${expected.text} was not found")
            val foundText = icd10.get(expected.code)?.text
            assertEquals(foundText, expected.text, "ICD-10 Diagnosekode ${expected.code} text did not match")
        }
    }

    val MIN_ICPC2_COUNT = 690
    val MAX_ICPC2_COUNT = (MIN_ICPC2_COUNT * 2) - 1

    @Test
    fun smokeTestIcpc2() {
        val icpc2 = Diagnosekoder.icpc2
        val count = icpc2.size
        assertTrue(count >= MIN_ICPC2_COUNT, "Too few ICPC-2 codes (${count})")
        assertTrue(count < MAX_ICPC2_COUNT, "Too many ICPC-2 codes")

        // Some random samples we check that are present
        val expectedSamples: Array<Diagnosekoder.ICPC2> = arrayOf(
            Diagnosekoder.ICPC2(code = "A01", text = "Smerte generell/flere steder"),
            Diagnosekoder.ICPC2(code = "Z29", text = "Sosialt problem IKA"),
            Diagnosekoder.ICPC2(code = "W79", text = "Uønsket svangerskap"),
        )

        for (expected in expectedSamples) {
            assertTrue(icpc2.containsKey(expected.code), "ICPC-2 Diagnosekode ${expected.code} - ${expected.text} was not found")
            val foundText = icpc2.get(expected.code)?.text
            assertEquals(foundText, expected.text, "ICPC-2 Diagnosekode ${expected.code} text did not match")
        }
    }
}