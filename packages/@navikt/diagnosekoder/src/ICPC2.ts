import icpc2Json from './ICPC2.json' with {type: 'json'};
import {type ICPC2Diagnosekode, toIcpc2Diagnosekode} from "./ICPC2Diagnosekode.js";

export const ICPC2: ReadonlyArray<ICPC2Diagnosekode> = icpc2Json.map(toIcpc2Diagnosekode)
