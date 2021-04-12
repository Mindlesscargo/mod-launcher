const { existsSync, mkdirSync, writeFileSync, readFileSync } = require('fs')
const { resolve } = require('path')
const { get } = require('axios').default
const { app } = require('electron')
const { update } = require('./update.js')

const checkUpdate = async () => {
  const launcherData = (await get('https://raw.githubusercontent.com/Mindlesscargo/modlauncher-info/main/config.json')).data
  const root = app.getPath('userData')
  const launcherDir = resolve(root, 'launcher')
  const versionInfoFile = resolve(launcherDir, 'version.json')

  if (!existsSync(launcherDir)) {
    mkdirSync(launcherDir)
  }
  if (!existsSync(versionInfoFile)) {
    writeFileSync(versionInfoFile, JSON.stringify(launcherData))
    await update(launcherData)
  } else {
    const oldData = JSON.parse(readFileSync(versionInfoFile, { encoding: 'utf-8' }))
    if (oldData.version != launcherData.version) update(launcherData)
  }

  return { forgeVersion: launcherData['forge-version'], minecraftVersion: launcherData['minecraft-version'] }
}

exports.checkUpdate = checkUpdate