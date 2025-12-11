export interface Diagnosekode {
    readonly code: string;
    readonly text: string;
    readonly parentCode?: string;
    readonly validFrom?: string;
    readonly validTo?: string;
}

export const instanceOfDiagnosekode = (obj: any): obj is Diagnosekode =>
    'code' in obj && 'text' in obj &&
    typeof obj.code === 'string' &&
    typeof obj.text === 'string' &&
    (obj.parentCode === undefined || typeof obj.parentCode === 'string') &&
    (obj.validFrom === undefined || typeof obj.validFrom === 'string') &&
    (obj.validTo === undefined || typeof obj.validTo === 'string');

export const toDiagnosekode = (obj: any): Diagnosekode => {
    if (instanceOfDiagnosekode(obj)) {
        return obj;
    }
    throw new Error(`object passed is missing required Diagnosekode props (${JSON.stringify(obj)})`)
}