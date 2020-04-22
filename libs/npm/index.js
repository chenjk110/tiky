// @ts-check
const { createWriteFile, execAsync } = require('../utils')
const { readFileSync } = require('fs')
const pkgTpl = readFileSync(__dirname + '/package-template').toString()

const createNpmPkgFile = async (dir, options) => {
    const pkg = Object.assign(JSON.parse(pkgTpl), options)
    try {
        await createWriteFile('package.json', JSON.stringify(pkg, null, 4), dir)
    } catch (err) {
        return false
    }
    return true
}

/**
 * install development deps
 * @param {string[]} deps 
 * @param {string} cwd
 */
const installDeps = async (deps, cwd) => {
    await execAsync(`npm i ${deps.join(' ')} --save-dev`, { cwd }).then(res => {
        // process.stdout.write(res.stdout)
    })
}

module.exports = {
    createNpmPkgFile,
    installDeps
}
