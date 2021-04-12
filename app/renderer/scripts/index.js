document.getElementById('minimize').addEventListener('click', () => {
  window.functions.minimize()
})

document.getElementById('maximize').addEventListener('click', () => {
  window.functions.maximize()
})

document.getElementById('close').addEventListener('click', () => {
  window.close()
})

window.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') document.getElementById('login').click()
})

document.getElementById('login').addEventListener('click', async () => {
    // Get the values from elements
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const rememberMe = document.getElementById('remember-me').value
    //Check for valid username / password
    if (!username || !password) {
      document.getElementById('login-message').innerText = 'Input a valid username and password'
      return document.getElementById('login-message').setAttribute('class', 'warning-message')
    }
    // authenticate with mojang api
    const clientToken = await window.data.get('clientToken', 0) || Math.random().toString().substring(2, 6)
    const data = await window.api.authenticate(username, password, clientToken)
    //Check for valid username and password
    if (!data) {
      document.getElementById('login-message').innerText = 'Invalid username or password'
      return document.getElementById('login-message').setAttribute('class', 'warning-message')
    }
    // Destructure data object
    const { accessToken, user: { username: identifier }, selectedProfile} = data.data
    // Persist data
    if (rememberMe) {
      window.data.set('stayLoggedIn', true, 1)
      window.data.set('accessToken', accessToken, 0)
      window.data.set('username', identifier, 0)
      window.data.set('selectedProfile', selectedProfile, 0)
      window.data.set('clientToken', clientToken, 0)
    } else {
      window.data.set('stayLoggedIn', false, 1)
    }

    window.location = 'main.html'
})