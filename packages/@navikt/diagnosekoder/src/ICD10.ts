import icd10Json from './ICD10.json' assert {type: 'json'};
import {castToIcd10Diagnosekode, type ICD10Diagnosekode} from "./ICD10Diagnosekode.js";

export const ICD10: ReadonlyArray<ICD10Diagnosekode> = icd10Json.map(castToIcd10Diagnosekode)
