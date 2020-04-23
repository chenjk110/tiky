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
 * @param {'npm i' | 'yarn add'} cli
 * @param {string} cwd
 * @param {string} registry
 */
const installDeps = async (deps, cli, cwd, registry) => {
    registry = registry ? `--registry https://${registry}` : ''
    const devFlag = cli === 'yarn add' ? '--dev' : '--save-dev'
    await execAsync(`${cli} ${deps.join(' ')} ${registry} ${devFlag}`, { cwd, killSignal: 'SIGINT' })
}

module.exports = {
    createNpmPkgFile,
    installDeps
}
