const createLicense = require('create-license')

const LISCENES = createLicense.licenses.map(name => name.toUpperCase())
const licenses = createLicense.licenses.concat()

const choicesLicenses = licenses.map(name => {
    const opt = { name: name.toUpperCase(), value: name }
    return opt
})

/**
 * create License file
 * @param {string} where target path to create file
 * @param {string} type license type
 * @param {{year?:string,author?:string:project?:string}} opts custom content
 */
const createLicenseFile = (where, type, opts) => {
    try {
        createLicense(where, type, opts)
    } catch (err) {
        console.log(err.message)
        return false
    }
    return true
}


module.exports = {
    LISCENES,
    licenses,
    choicesLicenses,
    createLicenseFile,
}
