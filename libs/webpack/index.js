const { createWriteFile } = require('../utils')
const { readFileSync } = require('fs')

/**
 * create webpack.config.js file
 * @param {'ts'|'js'} type 
 * @param {number} ecmaVersion 
 * @param {string} libraryTarget 
 * @param {string} cwd 
 */
const createWebpackConfigFile = async (type, ecmaVersion, libraryTarget, cwd) => {
    let webpackConfigTpl = readFileSync(__dirname + '/webpack-template', { encoding: 'utf8' })

    webpackConfigTpl = webpackConfigTpl.replace('{{EXT}}', type)
    webpackConfigTpl = webpackConfigTpl.replace('{{MODULE}}', libraryTarget)
    webpackConfigTpl = webpackConfigTpl.replace('{{DIST}}', cwd)

    if (type === 'ts') {
        webpackConfigTpl = webpackConfigTpl.replace('{{RULES}}', `[
            {
                test: /\\.(j|t)s$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ]
                        }
                    },
                    'ts-loader',
                ]
            }
        ]`)
    }

    if (type === 'js') {
        webpackConfigTpl = webpackConfigTpl.replace('{{RULES}}', `[
            {
                test: /\\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ]
                        }
                    }
                ]
            }
        ]`)
    }

    await createWriteFile('webpack.config.js', webpackConfigTpl, cwd)
}

module.exports = {
    createWebpackConfigFile
}