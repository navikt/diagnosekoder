import {fileURLToPath} from "node:url";
import path from "node:path";

const resolveRunDir = () => {
    const runFile = fileURLToPath(import.meta.url)
    return path.dirname(runFile);
}

export default resolveRunDir