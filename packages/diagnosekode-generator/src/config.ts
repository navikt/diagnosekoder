import fs from 'node:fs/promises'
import resolveRunDir from "./resolveRunDir.ts";
import path from "node:path";

export interface Urls {
    readonly icd10: string;
    readonly icpc2: string;
}

export const resolveConfigsDir = () => {
    const runDir = resolveRunDir();
    return path.resolve(path.relative(runDir, '../configs'))
}

const readStringFromFile = async (filePath: string): Promise<string> => {
    const content = await fs.readFile(filePath, {encoding: 'utf-8', })
    return content.trim()
}

export interface Args {
    readonly validAfter: Date | undefined
}

const validAfterDateFromString = (validAfterString: string | undefined): Date | undefined => {
    if(validAfterString != null) {
        const validAfter = new Date(validAfterString)
        if (!(validAfter.getFullYear() >= 2020 && validAfter.getFullYear() < 2050)) {
            throw new Error(`Invalid --valid-after argument value: ${validAfterString}`)
        }
        return validAfter
    }
    return undefined
}


export const readFileArgs = async (): Promise<Args> => {
    const configsDir = resolveConfigsDir()
    const validAfterString = (await readStringFromFile(path.resolve(configsDir, 'valid-after.txt'))).toString()
    const validAfter = validAfterDateFromString(validAfterString)
    return {validAfter}
}

export const resolveCmdArgs = (): Args => {
    let validAfter: Date | undefined;
    const args = process.argv
    for(let i = 2; i < args.length; i++) {
        const arg = args[i]
        if(arg === "--valid-after") {
            if(args.length > i + 1) {
                const argValue = args[i+1]
                validAfter = validAfterDateFromString(argValue)
                i++
            } else {
                throw new Error(`--valid-after argument provided without value`)
            }
        }
    }
    return {validAfter}
}
