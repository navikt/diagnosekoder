import json from '@rollup/plugin-json';

const config = {
    input: './lib/index.js',
    output: {
        file: 'lib/index.cjs',
        format: 'cjs'
    },
    plugins: [json()]
}

export default config