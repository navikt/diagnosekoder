import {generateICD10, generateICPC2} from "./generator.ts";
import path from 'node:path';
import fs from 'node:fs/promises';
import resolveRunDir from "./resolveRunDir.ts";
import {readUrlConfigs} from "./config.ts";
import type {ICD10Diagnosekode, ICPC2Diagnosekode} from "@navikt/diagnosekoder";

/**
 * Resolves the path to the @navikt/diagnosekoder npm package src dir, where the generated diagnosekode json files for
 * the typescript lib should be written.
 */
function resolveTypescriptOutputDir() {
    const runDir = resolveRunDir()
    return path.resolve(path.relative(runDir, '@navikt/diagnosekoder/src'));
}

function resolveJavaOutputDir() {
    const runDir = resolveRunDir()
    return path.resolve(path.relative(runDir, '../java/diagnosekoder/src/main/resources/'))
}

function resolveOutputFilePaths(dirPath: string) {
    const icd10OutputPath = path.resolve(dirPath, 'ICD10.json')
    const icpc2OutputPath = path.resolve(dirPath, 'ICPC2.json')
    return {icd10OutputPath, icpc2OutputPath}
}

function jsonStringify(value: any): string {
    return JSON.stringify(value, undefined, 4)
}

async function writeOutput(outputDirPath: string, icd10: ICD10Diagnosekode[], icpc2: ICPC2Diagnosekode[]) {
    const {icd10OutputPath, icpc2OutputPath} = resolveOutputFilePaths(outputDirPath)
    await fs.writeFile(icd10OutputPath, jsonStringify(icd10))
    await fs.writeFile(icpc2OutputPath, jsonStringify(icpc2))
}

async function writeTypescriptOutput(icd10: ICD10Diagnosekode[], icpc2: ICPC2Diagnosekode[]) {
    await writeOutput(resolveTypescriptOutputDir(), icd10, icpc2)
}

async function writeJavaOutput(icd10: ICD10Diagnosekode[], icpc2: ICPC2Diagnosekode[]) {
    await writeOutput(resolveJavaOutputDir(), icd10, icpc2)
}

async function main() {
    const urls = await readUrlConfigs();
    const [icd10, icpc2] = await Promise.all([generateICD10(urls), generateICPC2(urls)]);
    await writeTypescriptOutput(icd10, icpc2)
    await writeJavaOutput(icd10, icpc2)
}

main();