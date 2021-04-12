const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store')
const path = require('path')
let win
const { validate } = require('./helpers/authentication.js')
const { launch } = require('./helpers/launch.js')

async function createWindow () {
  win = new BrowserWindow({
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, 'app', 'renderer', 'scripts', 'preload.js')
    },
    frame: false
  })
  win.setAspectRatio(16/9)
  //win.setMenu(null)
  await stayLoggedIn() ? win.loadFile(path.join(__dirname, 'app', 'renderer', 'views', 'main.html')) : win.loadFile(path.join(__dirname, 'app', 'renderer', 'views', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const credentialData = new Store({
  name: 'authentication',
  schema: {
    clientToken: {
      type: 'string'
    }, 
    accessToken: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    selectedProfile: {
      type: 'object'
    }
  },
  encryptionKey: 'encryption1234'
})

const userPreferences = new Store({
  name: 'user-preferences',
  schema: {
    stayLoggedIn: {
      type: 'boolean',
      default: false
    },
    minRam: {
      type: 'number',
      default: 2048
    },
    maxRam: {
      type: 'number',
      default: 4096
    },
    forgeVersion: {
      type: 'string'
    },
    minecraftVersion: {
      type: 'string'
    }
  }
})

const storages = [credentialData, userPreferences]

ipcMain.handle('set', async (e, key, value, option) => {
  storages[option].set(key, value)
})

ipcMain.handle('get', async (e, key, option) => {
  const data = await storages[option].get(key)
  return data
})

ipcMain.handle('minimize', async() => {
  win.minimize()
})

ipcMain.handle('maximize', async() => {
  win.isMaximized() ? win.restore() : win.maximize()
})

ipcMain.handle('launch', async() => {
  const newAccessToken = await launch(credentialData.get('clientToken'), credentialData.get('accessToken'), credentialData.get('selectedProfile'), userPreferences.get('maxRam'), userPreferences.get('minRam'))
  credentialData.set('accessToken', newAccessToken) // apply new accessToken
})

async function stayLoggedIn() {
  const persist = await userPreferences.get('stayLoggedIn')
  const clientToken = await credentialData.get('clientToken')
  const accessToken = await credentialData.get('accessToken')

  if (!clientToken || !accessToken || !persist) return false

  const login = await validate(accessToken, clientToken)
  if (!login) {
    return false
  }
  return true
}


