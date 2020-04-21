const inquirer = require('inquirer')
const { checkEmail } = require('./libs/utils')
const { getGitUserInfo, checkGit } = require('./libs/git')
const { questionLicense } = require('./libs/license')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt('suggest', require('inquirer-prompt-suggest'))
inquirer.registerPrompt('search-checkbox', require('inquirer-search-checkbox'))

const CONFIGS = {}

run()
async function run() {

    const GIT_USER_INFO = await getGitUserInfo()

    /** @type {import('inquirer').ListQuestionOptions} */
    const questionLangType = {
        name: 'langType',
        type: 'list',
        message: 'Which Lang Type?',
        choices: [
            { name: 'JavaScript', value: 'js', checked: true },
            { name: 'TypeScript', value: 'ts' },
        ]
    }

    /** @type {import('inquirer').ListQuestionOptions} */
    const questionBuildTool = {
        name: 'buildTool',
        type: 'list',
        message: 'Which Build Tool?',
        choices: [
            { name: 'Gulp', value: 'gulp', checked: true },
            { name: 'Weback', value: 'webpack' },
        ]
    }

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionTarget = {
        name: 'target',
        type: 'checkbox',
        message: 'Select Target Langs?',
        choices: [
            { name: 'ES5', value: 'es5', checked: true },
            { name: 'ES6', value: 'es6' },
            { name: 'ESNext', value: 'esnext' },
        ]
    }

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionModule = {
        name: 'module',
        type: 'checkbox',
        message: 'Select Target Modules?',
        choices: [
            { name: 'UMD', value: 'UMD', checked: true },
            { name: 'AMD', value: 'AMD' },
            { name: 'CommonJS', value: 'CommonJS' },
            { name: 'ESModule', value: 'ESModule' },
        ]
    }

    /** @type {import('inquirer').InputQuestionOptions} */
    const questionProjectName = {
        type: 'input',
        name: 'projectName',
        message: 'Project Name?',
        default: '',
    }

    /** @type {import('inquirer').InputQuestionOptions} */
    const questionAuthorName = {
        type: 'input',
        name: 'authorName',
        message: 'Author Name?',
        default: GIT_USER_INFO.name,
    }

    /** @type {import('inquirer').InputQuestionOptions} */
    const questionAuthorEmail = {
        type: 'input',
        name: 'authorEmail',
        message: 'Author Email?',
        default: GIT_USER_INFO.email,
        validate: (input) => {
            return checkEmail(input) || new Error('Invalid email address.')
        }
    }

    /** @type {import('inquirer').ConfirmQuestionOptions} */
    const questionGit = {
        type: 'confirm',
        name: 'useGit',
        message: 'Using Git Repository?',
    }

    /** @type {import('inquirer').ConfirmQuestionOptions} */
    const questionConfiguraTS = {
        type: 'confirm',
        name: 'configTS',
        message: 'Would you configuating `tsconfig.json`?'
    }

    /**
     * Main Inquirer
     */
    inquirer
        .prompt([
            // questionLangType,
            // questionBuildTool,
            // questionTarget,
            // questionModule,
            // questionTSConfig,
            questionLicense,
            questionConfiguraTS,
            // questionProjectName,
            // questionAuthorName,
            // questionAuthorEmail,
        ])
        .then(res => {
            Object.assign(CONFIGS, res)
            if (checkGit()) {
                return inquirer.prompt(questionGit)
            }
            return res
        })
        // all done
        .then(res => {
            Object.assign(CONFIGS, res)
            console.log(CONFIGS)
        })



}
