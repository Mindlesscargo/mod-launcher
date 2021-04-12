// Preload stuff
const { app } = require('electron')
const { contextBridge, ipcRenderer } = require('electron')
const { authenticate } = require('../../../helpers/authentication.js')

const get = async (key, option) => {
    const data = await ipcRenderer.invoke('get', key, option)
    return data
}

const set = async (key, value, option) => {
    ipcRenderer.invoke('set', key, value, option)
}

const launch = async () => {
    ipcRenderer.invoke('launch')
}

const minimize = async () => {
    ipcRenderer.invoke('minimize')
}

const maximize = async () => {
    ipcRenderer.invoke('maximize')
}

const close = async () => {
    ipcRenderer.invoke('close')
}

contextBridge.exposeInMainWorld('api', {
    authenticate
})

contextBridge.exposeInMainWorld('data', {
    set,
    get
})

contextBridge.exposeInMainWorld('functions', {
    minimize,
    maximize,
    close,
    launch
})
