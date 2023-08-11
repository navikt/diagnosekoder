export interface Diagnosekode {
    readonly code: string;
    readonly text: string;
}

export const instanceOfDiagnosekode = (obj: any): obj is Diagnosekode =>
    'code' in obj && 'text' in obj &&
    typeof obj.code === 'string' &&
    typeof obj.text === 'string';

export const toDiagnosekode = (obj: any): Diagnosekode => {
    if (instanceOfDiagnosekode(obj)) {
        return obj;
    }
    throw new Error(`object passed is missing required Diagnosekode props (${JSON.stringify(obj)})`)
}