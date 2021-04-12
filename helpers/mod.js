const { createWriteStream, createReadStream } = require('fs')
const { resolve } = require('path')
const { get } = require('https')
const { app } = require('electron')
const { Extract } = require('unzipper')

const downloadMod = (url, fileName) => {
    const modDir = resolve(app.getPath('userData'), 'launcher', 'mods')  
    const modPath = resolve(modDir, fileName)
    const file = createWriteStream(modPath)
    get(url, (res) => {
        res.pipe(file)
    })
    file.on('end', () => {
        if (fileName.endsWith('zip')) {
            createReadStream(modPath).pipe(Extract({ path: modDir }))
        }
        file.destroy()
    })
}

exports.downloadMod = downloadMod