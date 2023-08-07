import {generateICD10, generateICPC2} from "./generator.js";
import * as console from "console";
import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url'

/**
 * Resolves the path to the @navikt/diagnosekoder npm package src dir, where the generated diagnosekode json files for
 * the typescript lib should be written.
 */
function resolveTypescriptOutputDir() {
    const runFile = fileURLToPath(import.meta.url)
    const runDir = path.dirname(runFile);
    return path.resolve(path.relative(runDir, '@navikt/diagnosekoder/src'));
}

function resolveOutputPaths() {
    const tsOutDir = resolveTypescriptOutputDir();
    const icd10Path = path.resolve(tsOutDir, 'ICD10.json')
    const icpc2Path = path.resolve(tsOutDir, 'ICPC2.json')
    return {icd10Path, icpc2Path}
}

async function main() {
    try {
        const [icd10, icpc2] = await Promise.all([generateICD10(), generateICPC2()]);
        const {icd10Path, icpc2Path} = resolveOutputPaths()
        await fs.writeFile(icd10Path, JSON.stringify(icd10, undefined, 4))
        await fs.writeFile(icpc2Path, JSON.stringify(icpc2, undefined, 4))
    } catch (e) {
        console.error(e)
    }
}

main();