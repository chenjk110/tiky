// @ts-check
const { tsConfigChoices } = require('./consts')
const { createWriteFile } = require('../utils')
const { readFileSync } = require('fs')
const inquirer = require('inquirer')

const tsConfigTpl = readFileSync(__dirname + '/tsconfig-template').toString()

const tsConfigChoicesList = tsConfigChoices.reduce((res, opt) => {
    return res.concat(
        new inquirer.Separator(opt.optionLabel),
        opt.optionNames.map(name => ({ name, value: name }))
    )
}, [])

/**
 * create `tsconfig.json` file
 * @param {string} dir project root dir
 * @param {string[]} options the list of tsconfig.json's compilerOption property
 */
const createTSConfigFile = async (dir, options) => {
    const config = JSON.parse(tsConfigTpl)

    const compilerOptions = config.compilerOptions || (config.compilerOptions = {})

    options.forEach(name => compilerOptions[name] = true)

    try {
        await createWriteFile('tsconfig.json', JSON.stringify(config, null, 4), dir)
    } catch (err) {
        console.error(err.message)
        return false
    }

    return true
}

module.exports = {
    createTSConfigFile,
    tsConfigChoicesList
}