// @ts-check
const { promisify } = require('util')
const { exec } = require('child_process')
const { writeFile, mkdir, stat } = require('fs')
const { resolve } = require('path')

const execAsync = promisify(exec)
const writeFileAsync = promisify(writeFile)
const mkdirAsync = promisify(mkdir)
const statAsync = promisify(stat)

/**
 * validate email address
 * @param {string} email 
 */
const validateEmail = (email) => /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)

const getPWD = async () => (await promisify(exec)('pwd')).stdout.replace('\n', '')

/**
 * create target file and write content
 * @param {string} filename filename
 * @param {any} content contents
 * @param {string} cwd cwd
 */
const createWriteFile = async (filename, content, cwd) => {
    const targetPath = resolve(cwd, filename)
    if (typeof content !== 'string') {
        content = JSON.stringify(content, null, 4)
    }
    try {
        await writeFileAsync(targetPath, content, { encoding: 'utf8', flag: 'w' })
    } catch (err) {
        console.log(err)
        return false
    }
    return true
}

/**
 * create dir
 * @param {string} dir dir path
 */
const createDir = async (dir = '') => {
    try {
        await mkdirAsync(dir, { recursive: true })
    } catch (err) {
        return false
    }
    return true
}

/**
 * get current user of system
 */
const getCurrUserName = async () => {
    const getUser = async (var_name) => (
        await execAsync(`echo ${var_name}`)
    ).stdout.replace('\n', '')

    let username = await getUser('$USER')
    if (!username) {
        username = await getUser('$USERNAME')
    }
    return username || ''
}

/**
 * create dirs
 * @param {string} prjRoot 
 * @param {string[]} dirs 
 */
const createDirs = async (prjRoot, dirs) => {
    for (let i = 0; i < dirs.length; i++) {
        const dir = resolve(prjRoot, dirs[i])
        await createDir(dir)
    }
}

/**
 * check project exist
 * @param {string} dir root dir
 * @param {string} name project name
 */
const checkExist = async (dir, name) => {
    try {
        await statAsync(resolve(dir, name))
    } catch (err) {
        return false
    }
    return true
}

module.exports = {
    validateEmail,
    execAsync,
    writeFileAsync,
    mkdirAsync,
    statAsync,
    getPWD,
    createWriteFile,
    createDir,
    getCurrUserName,
    createDirs,
    checkExist,
}
