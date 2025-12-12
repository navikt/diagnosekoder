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

const readUrlFromFile = async (filePath: string): Promise<URL> => {
    const str = await readStringFromFile(filePath);
    return new URL(str);
}

export const readUrlConfigs = async (): Promise<Urls> => {
    const configsDir = resolveConfigsDir()
    const icd10 = (await readUrlFromFile(path.resolve(configsDir, 'icd10.url.txt'))).toString()
    const icpc2 = (await readUrlFromFile(path.resolve(configsDir, 'icpc2.url.txt'))).toString()
    return {icd10, icpc2}
}