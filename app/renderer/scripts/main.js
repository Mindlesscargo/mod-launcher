document.getElementById('minimize').addEventListener('click', () => {
  window.functions.minimize()
})

document.getElementById('maximize').addEventListener('click', () => {
  window.functions.maximize()
})

document.getElementById('close').addEventListener('click', () => {
  window.close()
})

document.getElementById('launch').addEventListener('click', () => {
  window.functions.launch()
})

const updateUsernameHeader = async () => {
  const selectedProfile = await window.data.get('selectedProfile', 0)
  document.getElementById('username-header').innerText = 'Welcome ' + selectedProfile.name
}

const updateModList = async () => {
  const data = await (await window.fetch('https://raw.githubusercontent.com/Mindlesscargo/modlauncher-info/main/config.json')).json()
  for (const mod of data.mods) {
    const li = document.createElement('li')
    li.innerText = mod.name
    document.getElementById('mod-list').append(li)
  }

  const version = document.createElement('h4')
  version.innerText = "Version " + data.version
  document.getElementById('mod-list-container').append(version)
}

updateModList()
updateUsernameHeader()