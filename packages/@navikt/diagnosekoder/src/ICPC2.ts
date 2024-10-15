import icpc2Json from './ICPC2.json' with {type: 'json'};
import { castToIcpc2Diagnosekode, type ICPC2Diagnosekode } from "./ICPC2Diagnosekode.js";

export const ICPC2: ReadonlyArray<ICPC2Diagnosekode> = icpc2Json.map(castToIcpc2Diagnosekode)
