// @ts-check
const inquirer = require('inquirer')
const { validateEmail } = require('./libs/utils')
const { getGitUserInfo, checkGit } = require('./libs/git')
const { createLicenseFile, choicesLicenses } = require('./libs/license')
const { createTSConfigFile, tsConfigChoicesList } = require('./libs/ts')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt('suggest', require('inquirer-prompt-suggest'))

const CONFIG_KEYS = {
    PROJECT_NAME: '__PROJECT_NAME__',
    AUTHOR: '__AUTHOR__',
    EMAIL: '__EMAIL__',
    INIT_GIT: '__INIT_GIT__',
    LICENSE_TYPE: '__LICENSE_TYPE__',
    SCRIPT_TYPE_SOURCE: '__SCRIPT_TYPE_SOURCE__',
    SCRIPT_TYPE_TARGET: '__SCRIPT_TYPE_TARGET__',
    MODULE_TYPE_TARGET: '__MODULE_TYPE_TARGET__',
    BUILD_TOOL: '__BUILD_TOOL__',
    CONFIG_TS_CONFIG_JSON: '__CONFIG_TS_CONFIG_JSON__',
    TOGGLE_FLAG_TS_CONFIG: '__TOGGLE_FLAG_TS_CONFIG__',
}

const CONFIGS = {}

/**
 * Main Async Runner
 */
run()
async function run() {

    const GIT_USER_INFO = await getGitUserInfo()

    /** @type {import('inquirer').ListQuestionOptions} */
    const questionLicense = {
        type: 'list',
        name: CONFIG_KEYS.LICENSE_TYPE,
        message: 'select license',
        default: 'mit',
        pageSize: 10,
        choices: choicesLicenses
    }


    /** @type {import('inquirer').ListQuestionOptions} */
    const questionLangType = {
        type: 'list',
        name: CONFIG_KEYS.SCRIPT_TYPE_SOURCE,
        message: 'type of source',
        choices: [
            { name: 'JavaScript', value: 'js', checked: true },
            { name: 'TypeScript', value: 'ts' },
        ]
    }

    /** @type {import('inquirer').ListQuestionOptions} */
    const questionBuildTool = {
        type: 'list',
        name: CONFIG_KEYS.BUILD_TOOL,
        message: 'select build tool',
        choices: [
            { name: 'Gulp', value: 'gulp', checked: true },
            { name: 'Weback', value: 'webpack' },
        ]
    }

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionTarget = {
        type: 'checkbox',
        name: CONFIG_KEYS.SCRIPT_TYPE_TARGET,
        message: 'select target version of scripts',
        choices: [
            { name: 'ES5', value: 'es5', checked: true },
            { name: 'ES6', value: 'es6' },
            { name: 'ESNext', value: 'esnext' },
        ]
    }

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionModule = {
        type: 'checkbox',
        name: CONFIG_KEYS.MODULE_TYPE_TARGET,
        message: 'select target module',
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
        name: CONFIG_KEYS.PROJECT_NAME,
        message: 'project name',
        default: '',
    }

    /** @type {import('inquirer').InputQuestionOptions} */
    const questionAuthorName = {
        type: 'input',
        name: CONFIG_KEYS.AUTHOR,
        message: 'author',
        default: GIT_USER_INFO.name,
    }

    /** @type {import('inquirer').InputQuestionOptions} */
    const questionAuthorEmail = {
        type: 'input',
        name: CONFIG_KEYS.EMAIL,
        message: 'email',
        default: GIT_USER_INFO.email,
        validate: (input) => {
            return validateEmail(input) || 'please input valid email address.'
        }
    }

    /** @type {import('inquirer').ConfirmQuestionOptions} */
    const questionGit = {
        type: 'confirm',
        name: CONFIG_KEYS.INIT_GIT,
        message: 'init git repository',
    }

    /** @type {import('inquirer').ConfirmQuestionOptions} */
    const questionConfiguraTS = {
        type: 'confirm',
        name: CONFIG_KEYS.CONFIG_TS_CONFIG_JSON,
        message: 'configurate flags of `tsconfig.json`?'
    }

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionTSConfig = {
        type: 'checkbox',
        name: CONFIG_KEYS.TOGGLE_FLAG_TS_CONFIG,
        message: 'toggle flag in `tsconfig.json`',
        default: '',
        pageSize: 10,
        choices: tsConfigChoicesList
    }

    /**
     * Main Inquirer
     */
    inquirer
        .prompt([
            questionProjectName,
            questionAuthorName,
            questionAuthorEmail,
            questionLangType,
            questionBuildTool,
            questionTarget,
            questionModule,
            questionTSConfig,
            questionLicense,
            questionConfiguraTS,
        ])
        .then(res => {
            Object.assign(CONFIGS, res)
            if (checkGit()) {
                return inquirer.prompt([questionGit])
            }
            return res
        })
        // all done
        .then(res => {
            Object.assign(CONFIGS, res)
            console.log(CONFIGS)
        })
}


// createLicenseFile('.', 'mit', { year: new Date().getFullYear(), author: 'TanKingKhun', project: 'tiky' })
