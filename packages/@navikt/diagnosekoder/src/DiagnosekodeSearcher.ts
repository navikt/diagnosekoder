import {type Diagnosekode} from "./Diagnosekode.js";
import {DiagnosekodeSearchResult} from "./DiagnosekodeSearchResult.js";

interface DiagnosekodeAndUppercased<T extends Diagnosekode> {
    readonly diagnosekode: T;
    /**
     * The uppercased version of the diagnosekode (for case insensitive search matching)
     */
    readonly uppercased: Diagnosekode;
}


/**
 * Helper class that provides case-insensitive search of given diagnosekoder array.
 */
export class DiagnosekodeSearcher<T extends Diagnosekode> {
    public readonly diagnosekoderAndUppercased: DiagnosekodeAndUppercased<T>[];

    public constructor(
        public readonly diagnosekoder: ReadonlyArray<T>,
        public readonly pageSize: number,
    ) {
        this.diagnosekoderAndUppercased = this.diagnosekoder.map(dk =>
            ({diagnosekode: dk, uppercased: {code: dk.code.toUpperCase(), text: dk.text.toUpperCase()}})
        );
    }

    /**
     * Case-insensitive search of diagnosekoder with given searchText.
     *
     * This returns diagnosekode entries that includes searchText either in code or text props.
     *
     * If searchText is empty, the first <pageSize> number of diagnosekoder is returned.
     * @param searchText
     * @param pageNumber
     */
    public search(searchText: string, pageNumber: number): DiagnosekodeSearchResult<T> {
        const sliceStart = (pageNumber - 1) * this.pageSize;
        const sliceEnd = sliceStart + this.pageSize;
        if (searchText.length === 0) {
            return {
                diagnosekoder: this.diagnosekoder.slice(sliceStart, sliceEnd),
                pageNumber,
                hasMore: this.diagnosekoder.length > pageNumber * this.pageSize,
            };
        } else {
            const searchTextUppercased = searchText.trim().toUpperCase()
            const found = this.diagnosekoderAndUppercased.filter(({diagnosekode, uppercased}) => {
                return  uppercased.code.includes(searchTextUppercased) || uppercased.text.includes(searchTextUppercased)
            }).map(({diagnosekode}) => diagnosekode);
            return {
                diagnosekoder: found.slice(sliceStart, sliceEnd),
                pageNumber: pageNumber,
                hasMore: found.length > pageNumber * this.pageSize,
            };
        }
    }
}