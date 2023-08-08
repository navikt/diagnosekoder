import icpc2Json from './ICPC2.json' assert {type: 'json'};
import ICPC2Diagnosekode, {toIcpc2Diagnosekode} from "./ICPC2Diagnosekode.js";

const ICPC2: ReadonlyArray<ICPC2Diagnosekode> = icpc2Json.map(toIcpc2Diagnosekode)

export default ICPC2;
