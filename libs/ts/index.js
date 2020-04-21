const { tsConfigChoices } = require('./consts')

const tsConfigChoices = tsConfigChoices.reduce((res, opt) => {
    return res.concat(
        new inquirer.Separator(opt.optionLabel),
        opt.optionNames.map(name => ({ name, value: name }))
    )
}, [])

/** @type {import('inquirer').CheckboxQuestionOptions} */
const questionTSConfig = {
    type: 'checkbox',
    name: 'tsConfig',
    message: 'Toggle Flag Of CompilerOptions in`tsconfig.json`',
    default: '',
    pageSize: 10,
    choices: tsConfigChoices
}

const createTSConfigFile = async () => {

}

module.exports = {
    questionTSConfig,
    createTSConfigFile
}