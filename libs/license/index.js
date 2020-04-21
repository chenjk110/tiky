const createLicense = require('create-license')

const LISCENES = createLicense.licenses.map(name => name.toUpperCase())
const licenses = createLicense.licenses.concat()

const choices = licenses.map(name => {
    const opt = { name: name.toUpperCase(), value: name }
    return opt
})

/** @type {import('inquirer').ListQuestionOptions} */
const questionLicense = {
    type: 'list',
    name: 'liscene',
    message: 'License',
    default: 'mit',
    pageSize: 10,
    choices: choices
}

module.exports = {
    LISCENES,
    licenses,
    questionLicense,
    createLicense
}
