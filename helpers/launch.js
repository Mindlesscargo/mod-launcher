const { Client } = require('minecraft-launcher-core')
const { refresh } = require('../helpers/authentication.js')
const { app } = require('electron') 
const { resolve } = require('path')
const { checkUpdate } = require('./checkUpdate.js')

const launch = async (clientToken, accessToken, selectedProfile, max, min) => {
    const launcherDir = resolve(app.getPath('userData'), 'launcher')
    const { forgeVersion, minecraftVersion } = await checkUpdate()
    const authorization = await refresh(accessToken, clientToken, selectedProfile)

    const launcher = new Client()
    let forge = resolve(launcherDir, 'forge', `forge-${minecraftVersion}-${forgeVersion}-installer.jar`)
    let opts = {
        clientPackage: null,
        authorization,
        forge,
        root: launcherDir,
        version: {
            number: minecraftVersion,
            type: "release"
        },
        memory: {
            max,
            min
        }
    }
    launcher.launch(opts)
    return authorization.accessToken // refresh deauth's previous accessToken, must pass accessToken to main process to overwrite
}

exports.launch = launch