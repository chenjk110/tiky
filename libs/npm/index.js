// @ts-check
const { createWriteFile, execAsync } = require('../utils')

/**
 * merge `package.json` options and create file
 * @param {string} dir target project dir
 * @param {object} options additional package opitons
 * @returns {Promise<boolean>} true: succeed | false: faild
 */
const createNpmPkgFile = async (dir, options) => {
    const pkgConfTpl = require('./_package-template')
    const pkg = Object.assign(pkgConfTpl, options)
    try {
        await createWriteFile('package.json', pkg, dir)
    } catch (err) {
        return false
    }
    return true
}

/**
 * install development deps
 * @param {string[]} deps 
 * @param {'npm i' | 'yarn add' | string} cli
 * @param {string} cwd
 * @param {string} registry
 */
const installDeps = async (deps, cli, cwd, registry) => {
    registry = registry ? `--registry https://${registry}` : ''
    const devFlag = cli === 'yarn add' ? '--dev' : '--save-dev'
    const cmdStr = [].concat(cli, deps, registry, devFlag).join(' ')
    // `${cli} ${deps.join(' ')} ${registry} ${devFlag}`
    await execAsync(cmdStr, { cwd, killSignal: 'SIGINT' })
}

module.exports = {
    createNpmPkgFile,
    installDeps
}
