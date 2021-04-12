const { rmdirSync, mkdirSync } = require('fs')
const { resolve } = require('path')
const { app } = require('electron')
const { downloadMod } = require('./mod.js')
const { downloadForge } = require('./forge.js')

const update = (info) => {
  const root = app.getPath('userData')
  const launcherDir = resolve(root, 'launcher')
  const modsPath = resolve(launcherDir, 'mods')

  rmdirSync(modsPath, { recursive: true })
  mkdirSync(modsPath, { recursive: true })

  try {
    for (const mod of info.mods) {
      downloadMod(mod.url, mod.fileName)
    }
    downloadForge(info['minecraft-version'], info['forge-version'])
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

exports.update = update