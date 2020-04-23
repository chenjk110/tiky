const { createWriteFile } = require('../utils')
const { resolve } = require('path')
const commons = {
    ts: {
        mode: 'production',
        entry: 'src/index.ts',
        output: {
            filename: 'index.js',
            path: 'dist',
            libraryTarget: 'umd2',
            ecmaVersion: 5,
        },
        module: {
            rules: [
                { test: /\.(t|j)s$/, use: 'ts-loader' }
            ]
        }
    },
    js: {
        mode: 'production',
        entry: 'src/index.js',
        output: {
            filename: 'index.js',
            path: 'dist',
            libraryTarget: 'umd2',
            ecmaVersion: 5,
        },
        module: {}
    }
}


/**
 * create webpack.config.js file
 * @param {'ts'|'js'} type 
 * @param {number} ecmaVersion 
 * @param {string} libraryTarget 
 * @param {string} cwd 
 */
const createWebpackConfigFile = async (type, ecmaVersion, libraryTarget, cwd) => {
    const opt = commons[type]
    opt.output.ecmaVersion = ecmaVersion
    opt.output.libraryTarget = libraryTarget
    opt.output.path = resolve(cwd, 'dist')
    await createWriteFile('webpack.config.js', 'module.exports = ' + JSON.stringify(opt, null, 4), cwd)
}

module.exports = {
    createWebpackConfigFile
}