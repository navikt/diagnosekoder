import {ICPC2} from "../ICPC2.js";
import {ICD10} from "../ICD10.js";
import {Diagnosekode} from "../Diagnosekode.js";
import {icd10SearchTest, mockSearchTest} from "./DiagnosekodeSearcher.test.js";

const MIN_ICD10_COUNT = 19_600
const MAX_ICD10_COUNT = 40_000


const smoketestIcd10 = () => {
    const icd10 = ICD10;
    const count = icd10.length

    if(count < MIN_ICD10_COUNT) {
        throw new Error(`Too few ICD-10 codes (${count})`)
    }
    if(count > MAX_ICD10_COUNT) {
        throw new Error(`Too many ICD-10 codes (${count})`)
    }

    // Some random samples we check that are present
    const expectedSamples: Diagnosekode[] = [
        {code: "A000", text: "Kolera som skyldes Vibrio cholerae 01, biovar cholerae"},
        {code: "B377", text: "Candidasepsis"},
        {code: "V0n1m", text: "Fotgjskad tr uly;veitrafikk;Idrett v/utd/vernepl"},
    ]

    for (const expected of expectedSamples) {
        const found = icd10.some(dk => dk.code === expected.code && dk.text === expected.text)
        if(!found) {
            throw new Error(`ICD-10 Diagnosekode ${expected.code} - ${expected.text} was not found`)
        }
    }
}

const MIN_ICPC2_COUNT = 690
const MAX_ICPC2_COUNT = 1_200

const smoketestIcpc2 = () => {
    const icpc2 = ICPC2
    const count = icpc2.length

    if(count < MIN_ICPC2_COUNT) {
        throw new Error(`Too few ICPC-2 codes (${count})`)
    }
    if(count > MAX_ICPC2_COUNT) {
        throw new Error(`Too many ICPC-2 codes (${count})`)
    }

    // Some random samples we check
    const expectedSamples: Diagnosekode[] = [
        {"code": "A01", "text": "Smerte generell/flere steder"},
        {"code": "Z29", "text": "Sosialt problem IKA"},
        {"code": "W79", "text": "Uønsket svangerskap"},
    ]

    for (const expected of expectedSamples) {
        const found = icpc2.some(dk => dk.code === expected.code && dk.text === expected.text)
        if(!found) {
            throw new Error(`ICPC-2 Diagnosekode ${expected.code} - ${expected.text} was not found`)
        }
    }
}

function test() {
    smoketestIcd10()
    smoketestIcpc2()
    mockSearchTest()
    icd10SearchTest()
}

test()