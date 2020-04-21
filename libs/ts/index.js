const { tsConfigChoices } = require('./consts')
const { createWriteFile } = require('../utils')
const inquirer = require('inquirer')

const tsConfigChoicesList = tsConfigChoices.reduce((res, opt) => {
    return res.concat(
        new inquirer.Separator(opt.optionLabel),
        opt.optionNames.map(name => ({ name, value: name }))
    )
}, [])

/**
 * create `tsconfig.json` file
 * @param {string[]} options the list of tsconfig.json's compilerOption property
 * @param {string} dir project root dir
 */
const createTSConfigFile = async (options, dir) => {
    const compilerOptions = {}

    options.forEach(name => compilerOptions[name] = true)

    const config = {
        compilerOptions
    }

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