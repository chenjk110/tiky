const { createWriteFile, execAsync } = require('../utils')

/**
 * get user.name, user.email via `git cofnig` command
 */
const getGitUserInfo = async () => {
    let info = { name: '', email: '' }
    try {
        info = {
            name: (await execAsync('git config user.name')).stdout.replace('\n', ''),
            email: (await execAsync('git config user.email')).stdout.replace('\n', '')
        }
    } catch (err) {
        // console.log(err)
    }
    return Object.freeze(info)
}

/**
 * set user.name, user.email via `git config --local`
 * @param {string} name
 * @param {string} email
 */
const setGitUserInfo = async (name = '', email = '') => {
    try {
        await Promise.all([
            execAsync(`git config --local user.name ${name}`),
            execAsync(`git config --local user.email ${email}`)
        ])
    } catch (err) {
        // console.log(err)
        return false
    }
    return true
}


/**
 * checkout git is existed or not
 */
const checkGit = async () => {
    try {
        await execAsync('git --version')
    } catch (err) {
        // console.log(err)
        return false
    }
    return true
}

/**
 * init git repository at target path
 * @param {string} cwd cwd
 */
const initGit = async (cwd = '.') => {
    try {
        await execAsync(`git init .`, { cwd })
    } catch (err) {
        console.log(err.message)
        return false
    }
    return true
}

/**
 * add a init git commit
 * @param {string} cwd cwd
 */
const initGitCommit = async (cwd = '.') => {
    try {
        await execAsync(`git add .`, { cwd })
        await execAsync(`git commit -m "init."`, { cwd })
    } catch (err) {
        console.log(err.message)
        return false
    }
    return true
}

/**
 * create .gitignore file
 * @param {string[]} lines lines of content
 * @param {string} cwd cwd
 */
const craeteGitIgnoreFile = async (lines = [], cwd = '.') => {
    const content = [
        '.DS_Store',
        '.vscode',
        'node_modules'
    ].concat(lines).join('\n')

    try {
        await createWriteFile('.gitignore', content, cwd)
    } catch (err) {
        console.log(err.message)
        return false
    }
    return true
}


module.exports = {
    getGitUserInfo,
    setGitUserInfo,
    checkGit,
    initGit,
    initGitCommit,
    craeteGitIgnoreFile,
}
