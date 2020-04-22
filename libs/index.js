// @ts-check
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const { resolve } = require('path')
const { createNpmPkgFile, installDeps } = require('./npm')
const { validateEmail, createDir, createWriteFile } = require('./utils')
const { getGitUserInfo, checkGit, initGit, initGitCommit, craeteGitIgnoreFile } = require('./git')
const { createLicenseFile, choicesLicenses } = require('./license')
const { createTSConfigFile, tsConfigChoicesList } = require('./ts')
const { createWebpackConfigFile } = require('./webpack')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt('suggest', require('inquirer-prompt-suggest'))

const CONFIG_KEYS = {
    PROJECT_NAME: '__PROJECT_NAME__',
    PROJECT_DIR: '__PROJECT_DIR__',
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
    VER: '__VER__',
}

/**
 * create dirs
 * @param {string} prjRoot 
 * @param {string[]} dirs 
 */
const crateDirs = async (prjRoot, dirs) => {
    for (let i = 0; i < dirs.length; i++) {
        const dir = resolve(prjRoot, dirs[i])
        await createDir(dir)
        console.log(chalk.cyan(`create dir ${dir} succeed.`))
    }
}

/**
 * finaly creating operation 
 */
const creatingOperation = async (config) => {
    const {
        PROJECT_NAME,
        PROJECT_DIR,
        VER,
        AUTHOR,
        EMAIL,
        LICENSE_TYPE,
        TOGGLE_FLAG_TS_CONFIG,
        INIT_GIT,
        BUILD_TOOL,
        SCRIPT_TYPE_SOURCE,
        SCRIPT_TYPE_TARGET,
        MODULE_TYPE_TARGET,
    } = CONFIG_KEYS

    const projectName = config[PROJECT_NAME]
    const projectDir = config[PROJECT_DIR]
    const username = config[AUTHOR]
    const version = config[VER]
    const email = config[EMAIL]
    const license = config[LICENSE_TYPE]

    const projectRoot = resolve(projectDir, projectName)

    const isTs = config[SCRIPT_TYPE_SOURCE] === 'ts'
    const isTSC = config[BUILD_TOOL] === 'tsc'
    const isWebpack = config[BUILD_TOOL] === 'webpack'
    // const isGulp = config[BUILD_TOOL] === 'gulp'

    await crateDirs(projectRoot, [
        'src',
        'dist',
    ])

    if (isTs) {
        const tsConfigs = config[TOGGLE_FLAG_TS_CONFIG]
        await createTSConfigFile(projectRoot, tsConfigs)
        console.log(chalk.cyan(`create dir ${projectRoot + '/tsconfig.json'} succeed.`))

        await createWriteFile('src/index.ts', '', projectRoot)
    } else {
        await createWriteFile('src/index.js', '', projectRoot)
    }

    await craeteGitIgnoreFile(projectRoot, [])

    await createLicenseFile(projectRoot, config[LICENSE_TYPE], {
        year: new Date().getFullYear().toString(),
        author: username,
        project: projectName,
    })

    const commonDeps = ['nodemon']
    const targetDeps = []

    const pkgScriptsStart = `nodemon -e ${
        isTs ? 'ts' : 'js'
        } -w ./src -x 'node ${
        isTs ? '--reguire ts-node/register' : ''
        } ./src/index.${isTs ? 'ts' : 'js'}'`

    let pkgScriptsBuild = `NODE_ENV=production rm -rf dist `

    if (isTs) {
        targetDeps.push(
            'ts-node',
            'typescript',
            '@types/node',
        )
        if (isTSC) {
            pkgScriptsBuild += config[MODULE_TYPE_TARGET].map(name => {
                return `&& tsc -t ${name} --outDir dist/${name}`
            })
        }
    }

    if (isWebpack) {
        targetDeps.push(
            'webpack',
        )
        if (isTs) {
            targetDeps.push('ts-loader')
        }

        pkgScriptsBuild += '&& webpack --config webpack.config.js'

        await createWebpackConfigFile(
            config[SCRIPT_TYPE_SOURCE],
            config[SCRIPT_TYPE_TARGET],
            config[MODULE_TYPE_TARGET],
            projectRoot
        )
    }

    const pkg = {
        name: projectName,
        version: version,
        author: {
            name: username,
            email: email,
        },
        scripts: {
            start: pkgScriptsStart,
            build: pkgScriptsBuild
        },
        license: license,
    }

    await createNpmPkgFile(projectRoot, pkg)
    console.log(chalk.cyan(`create dir ${projectRoot + '/package.json'} succeed.`))


    const deps = commonDeps.concat(targetDeps)
    const spinner = ora().start('Installing...');
    const installTask = installDeps(deps, projectRoot)

    await installTask.then(() => {
        spinner.succeed(`Installing Completed!`)
    }).catch(err => {
        spinner.fail(err.message)
        throw err
    })

    if (config[INIT_GIT]) {
        await initGit(projectRoot)
        await initGitCommit(projectRoot)
        console.log(chalk.cyan(`init git succeed.`))
    }

    console.log(chalk.green(`Creating Project '${projectName}' Succeed!`))
    console.log(chalk.gray(`cd ${projectName}`))
    console.log(chalk.gray(`npm start`))
    console.log(chalk.gray(`npm run build`))
}

/**
 * Main Async Runner
 */
async function run(options) {
    const { projectDir, projectName = '' } = options

    /** @type {Record<keyof CONFIG_KEYS | string, any>} */
    const CONFIGS = {
        [CONFIG_KEYS.PROJECT_NAME]: projectName,
        [CONFIG_KEYS.PROJECT_DIR]: projectDir
    }

    const GIT_USER_INFO = await getGitUserInfo()

    /**
     * Questions
     */

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
            // { name: 'Gulp', value: 'gulp', checked: true },
            { name: 'None', value: 'none', checked: true },
            { name: 'Webpack', value: 'webpack' },
        ]
    }

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionTargetTS = {
        type: 'list',
        name: CONFIG_KEYS.SCRIPT_TYPE_TARGET,
        message: 'select target version of scripts',
        choices: [
            { name: 'ES3', value: 'ES3' },
            { name: 'ES5', value: 'ES5', checked: true },
            { name: 'ES6', value: 'ES6' },
            { name: 'ESNext', value: 'ESNext' },
            { name: 'ES2015', value: 'ES2015' },
            { name: 'ES2016', value: 'ES2016' },
            { name: 'ES2017', value: 'ES2017' },
            { name: 'ES2018', value: 'ES2018' },
            { name: 'ES2019', value: 'ES2019' },
            { name: 'ES2020', value: 'ES2020' },
        ]
    }

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionTargetWebpack = {
        type: 'list',
        name: CONFIG_KEYS.SCRIPT_TYPE_TARGET,
        message: 'select target version of scripts',
        choices: [
            { name: 'ES5', value: 5, checked: true },
            { name: 'ES6', value: 6 },
            { name: 'ES2015', value: 2015 },
            { name: 'ES2016', value: 2016 },
            { name: 'ES2017', value: 2017 },
            { name: 'ES2018', value: 2018 },
            { name: 'ES2019', value: 2019 },
            { name: 'ES2020', value: 2020 },
        ]
    }

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionModuleTS = {
        type: 'checkbox',
        name: CONFIG_KEYS.MODULE_TYPE_TARGET,
        message: 'select target module',
        choices: [
            { name: 'UMD', value: 'UMD', checked: true },
            { name: 'AMD', value: 'AMD' },
            { name: 'ES6', value: 'ES6' },
            { name: 'CommonJS', value: 'CommonJS' },
            { name: 'ES2015', value: 'ES2015' },
            { name: 'ES2020', value: 'ES2020' },
            { name: 'ESNext', value: 'ESNext' },
            { name: 'System', value: 'System' },
            { name: 'None', value: 'None' },
        ]
    }

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionModuleWebpack = {
        type: 'list',
        name: CONFIG_KEYS.MODULE_TYPE_TARGET,
        message: 'select target module',
        choices: [
            { name: 'umd2', value: 'umd2', checked: true },
            { name: 'commonjs2', value: 'commonjs2' },
            { name: 'commonjs', value: 'commonjs' },
            { name: 'amd', value: 'amd' },
            { name: 'this', value: 'this' },
            { name: 'var', value: 'var' },
            { name: 'assign', value: 'assign' },
            { name: 'window', value: 'window' },
            { name: 'global', value: 'global' },
            { name: 'jsonp', value: 'jsonp' },
        ]
    }


    /** @type {import('inquirer').InputQuestionOptions} */
    const questionProjectName = {
        type: 'input',
        name: CONFIG_KEYS.PROJECT_NAME,
        message: 'project name',
        default: projectName,
        validate: (input) => {
            return !!input || 'please input valid project name.'
        }
    }

    /** @type {import('inquirer').InputQuestionOptions} */
    const questionVer = {
        type: 'input',
        name: CONFIG_KEYS.VER,
        message: 'version',
        default: '0.0.1',
        validate: (input) => {
            return /\d+\.\d+.\d+/.test(input) || 'please input valid version (x.y.z). '
        }
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

    /** @type {import('inquirer').CheckboxQuestionOptions} */
    const questionTSConfig = {
        type: 'checkbox',
        name: CONFIG_KEYS.TOGGLE_FLAG_TS_CONFIG,
        message: 'toggle flag in `tsconfig.json`',
        pageSize: 10,
        choices: tsConfigChoicesList
    }

    /**
     * Main Inquirer
     */
    inquirer
        .prompt([
            questionProjectName,
            questionVer,
            questionAuthorName,
            questionAuthorEmail,
            questionLangType,
            // questionConfiguraTS,
        ])
        .then(res => {
            Object.assign(CONFIGS, res)
            let questionsNext = [
                questionBuildTool,
                questionLicense,
            ]

            if (CONFIGS[CONFIG_KEYS.SCRIPT_TYPE_SOURCE] === 'ts') {
                questionBuildTool.choices = [].concat(
                    questionBuildTool.choices,
                    { name: 'TSC', value: 'tsc' }
                )
                questionsNext.unshift(questionTSConfig)
            }

            return inquirer.prompt(questionsNext)
        })
        .then(res => {
            Object.assign(CONFIGS, res)
            const questionsNext = []

            if (CONFIGS[CONFIG_KEYS.BUILD_TOOL] === 'tsc') {
                questionsNext.unshift(
                    questionTargetTS,
                    questionModuleTS
                )
            }

            if (CONFIGS[CONFIG_KEYS.BUILD_TOOL] === 'webpack') {
                questionsNext.unshift(
                    questionTargetWebpack,
                    questionModuleWebpack,
                )
            }

            return inquirer.prompt(questionsNext)
        })
        .then(res => {
            Object.assign(CONFIGS, res)
            if (checkGit()) {
                return inquirer.prompt([questionGit])
            }
            return res
        })
        .then(res => {
            Object.assign(CONFIGS, res)
            return creatingOperation(CONFIGS)
        })
        .catch((err) => {
            console.error(chalk.red(err))
        })
}

module.exports = {
    run,
    CONFIG_KEYS,
}
