import {type Diagnosekode} from "./Diagnosekode.js";

const icpc2 = Symbol('icpc2')

export interface ICPC2Diagnosekode extends Diagnosekode {
    readonly [icpc2]: undefined; // Just a marker to make type explicit
}

export const validateIcpc2Diagnosekode = (dk: Diagnosekode) => {
    if (dk.code.length < 3) {
        throw new Error(`ICPC-2 code is expected to be at least three characters. (${JSON.stringify(dk)})`)
    }
    if (dk.code.length > 4) {
        throw new Error(`ICPC-2 code is expected to be at most four characters. (${JSON.stringify(dk)})`)
    }
    if (dk.text.length <= 3) {
        throw new Error(`ICPC-2 text is expected to be longer than three characters. (${JSON.stringify(dk)})`)
    }
    if (dk.text.length >= 500) {
        throw new Error(`ICPC-2 text is expected to be shorter than 500 characters. (${JSON.stringify(dk)})`)
    }
}

export const toIcpc2Diagnosekode = (dk: Diagnosekode): ICPC2Diagnosekode => {
    validateIcpc2Diagnosekode(dk)
    return {...dk, [icpc2]: undefined}
}

/**
 * Used when loading the generated json file to avoid performance overhead of validating it with toIcpc2Diagnosekode.
 *
 * No point in revalidating the json every time it is loaded, as long as toIcd2Diagnosekode is used in the generator
 * when creating the json file.
 *
 * @param dk
 */
export const castToIcpc2Diagnosekode = (dk: Diagnosekode): ICPC2Diagnosekode => dk as ICPC2Diagnosekode