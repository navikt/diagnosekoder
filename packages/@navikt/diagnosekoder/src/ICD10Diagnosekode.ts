import Diagnosekode from "./Diagnosekode.js";

const icd10 = Symbol('icd10');

export default interface ICD10Diagnosekode extends Diagnosekode {
    // Just a marker to make type explicit and avoid accidental mixing with ICPC2Diagnosekode.
    // Being a symbol key, it will also be removed when jsonifying the object, avoiding sending unneccessary bytes over
    // the network.
    readonly [icd10]: undefined;
}

export const validateIcd10Diagnosekode = (dk: Diagnosekode) => {
    if (dk.code.length < 3) {
        throw new Error(`Unexpected Diagnosekode. code less than 4 characters. ${JSON.stringify(dk)}`)
    }
    if (dk.code.length > 8) {
        throw new Error(`Unexpected Diagnosekode. code more than 8 characters. ${JSON.stringify(dk)}`)
    }
    if (dk.text.length < 5) {
        throw new Error(`Unexpected Diagnosekode. text less than 10 characters. ${JSON.stringify(dk)}`)
    }
    if (dk.text.length > 500) {
        throw new Error(`Unexpected Diagnosekode. text more than 500 characters. ${JSON.stringify(dk)}`)
    }
}


export const toIcd10Diagnosekode = (dk: Diagnosekode): ICD10Diagnosekode => {
    validateIcd10Diagnosekode(dk)
    return {...dk, [icd10]: undefined};
}

/**
 * Used when loading the generated json file to avoid performance overhead of validating it with toIcd10Diagnosekode.
 *
 * No point in revalidating the json every time it is loaded, as long as toIcd10Diagnosekode is used in the generator
 * when creating the json file.
 *
 * @param dk
 */
export const castToIcd10Diagnosekode = (dk: Diagnosekode): ICD10Diagnosekode => dk as ICD10Diagnosekode