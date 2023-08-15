import {type Diagnosekode, instanceOfDiagnosekode} from "./Diagnosekode.js";

export interface DiagnosekodeSearchResult<T extends Diagnosekode> {
    readonly diagnosekoder: T[];
    readonly pageNumber: number;
    readonly hasMore: boolean;
}

const instanceOfDiagnosekodeArray = (arr: any): arr is Diagnosekode[] =>
    arr instanceof Array && (arr.length === 0 || instanceOfDiagnosekode(arr[0]))

export const instanceOfDiagnosekodeSearchResult = <T extends Diagnosekode>(some: any): some is DiagnosekodeSearchResult<T> =>
    'diagnosekoder' in some &&
    instanceOfDiagnosekodeArray(some.diagnosekoder) &&
    'hasMore' in some


export const someTry = () => "sdfsaf"