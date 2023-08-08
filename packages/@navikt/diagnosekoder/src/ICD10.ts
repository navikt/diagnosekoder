import icd10Json from './ICD10.json' assert {type: 'json'};
import ICD10Diagnosekode, {castToIcd10Diagnosekode} from "./ICD10Diagnosekode.js";

const ICD10: ReadonlyArray<ICD10Diagnosekode> = icd10Json.map(castToIcd10Diagnosekode)

export default ICD10;