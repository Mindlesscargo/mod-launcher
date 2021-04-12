const { existsSync, mkdirSync, createWriteStream, } = require('fs')
const { app } = require('electron')
const { resolve } = require('path')
const { get } = require('https')

const downloadForge = async (mcVersion, forgeVersion) => {
  const versionNumber = `${mcVersion}-${forgeVersion}`
  const downloadLink = `https://files.minecraftforge.net/maven/net/minecraftforge/forge/${versionNumber}/forge-${versionNumber}-installer.jar`
  const forgeName = downloadLink.split('/').pop()
  const forgeDir = resolve(app.getPath('userData'), 'launcher', 'forge')

  if (!existsSync(forgeDir)) {
    mkdirSync(forgeDir)
  }
  const file = createWriteStream(resolve(forgeDir, forgeName))
  get(downloadLink, (res) => {
    res.pipe(file)
  })
  file.on('finish', () => {
    file.destroy()
  })
}

exports.downloadForge = downloadForge