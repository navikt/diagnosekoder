import {ICD10} from "../ICD10.js";
import {Diagnosekode} from "../Diagnosekode.js";
import {DiagnosekodeSearcher} from "../DiagnosekodeSearcher.js";
import {instanceOfDiagnosekodeSearchResult} from "../DiagnosekodeSearchResult.js";

const icd10Codes = ICD10;

export const fakeDiagnosekoder: Diagnosekode[] = [
    {"code":"A000","text":"Diagnose 1"},
    {"code":"A001","text":"Diagnose 2"},
    {"code":"A002","text":"Diagnose 3"},
    {"code":"A010","text":"Diagnose 4"},
    {"code":"C011","text":"Diagnose 5"},
    {"code":"v201","text":"Diagnose 6"},
    {"code":"v230","text":"Diagnose 7"},
]

const equal = <T extends any>(a: T, b: T): boolean => JSON.stringify(a) === JSON.stringify(b)

const notEqual = <T extends any>(a: T, b: T): boolean => !equal(a, b)

export const mockSearchTest = () => {
    const header = "DiagnosekodeSearcher with given mock input"
    const searcher = new DiagnosekodeSearcher(fakeDiagnosekoder, 3);

    let expected = {
        diagnosekoder: fakeDiagnosekoder.slice(0, searcher.pageSize),
        pageNumber: 1,
        hasMore: true,
    }
    let result = searcher.search("", 1);
    if (notEqual(result, expected)) {
        throw new Error(header + ` should give pagesize inital elements from all with empty search`)
    }

    expected = {
        diagnosekoder: fakeDiagnosekoder.slice(0, 3),
        pageNumber: 1,
        hasMore: false,
    }
    result = searcher.search("a00", 1);
    if (notEqual(result, expected)) {
        throw new Error(header + ` should give correct result with code search`)
    }

    expected = {
        ...expected,
        diagnosekoder: fakeDiagnosekoder.slice(4, 5),
    }
    result = searcher.search("Diagnose 5", 1)
    if (notEqual(result, expected)) {
        throw new Error(header + ` should give correct result with text search. Got ${JSON.stringify(result)}, expected ${JSON.stringify(expected)}`)
    }
}

export const icd10SearchTest = () => {
    const header = "DiagnosekodeSearcher with ICD10 input"
    const a001: Diagnosekode = {code: 'A001', text: "Kolera som skyldes Vibrio cholerae 01, biovar eltor"};
    const v4n4r: Diagnosekode = {code: 'V4n4r', text: "Tr.uly bil;skole m.v;Annen aktivitet"};

    const b16Results = [
        {code: 'B160', text: 'Akutt hepatitt B med delta-agens (koinfeksjon) og leverkoma'},
        {code: 'B161', text: 'Akutt hepatitt B med delta-agens (koinfeksjon) u. leverkoma'},
        {code: 'B162', text: 'Akutt hepatitt B uten delta-agens med leverkoma'},
        {code: 'B169', text: 'Akutt hepatitt B uten deltavirus og uten leverkoma'},
    ];
    const searcher = new DiagnosekodeSearcher(icd10Codes, 100);

    const testCases = [
        {
            description: 'with code A001 should return a single correct result',
            searchText: 'A001',
            expectedResult: a001,
        },
        {
            description: 'with code a001 should return a single correct result',
            searchText: 'a001',
            expectedResult: a001,
        },
        {
            description: 'with code V4N4R should return a single correct result',
            searchText: 'V4N4R',
            expectedResult: v4n4r,
        },
        {
            description: 'with code v4n4r should return a single correct result',
            searchText: 'v4n4r',
            expectedResult: v4n4r,
        },
        {
            description: 'with search text b16 should return 4 results',
            searchText: 'b16',
            expectedResult: b16Results,
        },
    ]

    for(const testCase of testCases) {
        const result = searcher.search(testCase.searchText, 1)
        if(!instanceOfDiagnosekodeSearchResult(result)) {
            throw new Error(`not instanceOfDiagnosekodeSearchResult: ${JSON.stringify(result)}`)
        }
        const expected = testCase.expectedResult instanceof Array ? testCase.expectedResult : [testCase.expectedResult]
        if (notEqual(result.diagnosekoder, expected)) {
            throw new Error(header + ` ${testCase.description}`)
        }
    }

    const firstBlankSearchResult = searcher.search("", 1)
    if(firstBlankSearchResult.diagnosekoder.length !== searcher.pageSize) {
        throw new Error(header + " with empty search text should return full first page")
    }
    if(!firstBlankSearchResult.hasMore) {
        throw new Error(header + " with empty search text should have more results")
    }
    if(firstBlankSearchResult.pageNumber !== 1) {
        throw new Error(header + " with empty search text should return page 1 first")
    }

    const secondBlankSearchResult  = searcher.search("", 2)
    if(secondBlankSearchResult.diagnosekoder.length !== searcher.pageSize) {
        throw new Error(header + " with empty search text should return full second page of results")
    }
    if(!secondBlankSearchResult.hasMore) {
        throw new Error(header + " with empty search text should have more results (2)")
    }
    if(secondBlankSearchResult.pageNumber !== 2) {
        throw new Error(header + " with empty search text should return page 2")
    }

}
