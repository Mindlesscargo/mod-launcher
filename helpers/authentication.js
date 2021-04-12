const { post } = require('axios').default

const authenticate = async (username, password, clientToken) => {
    let body = {
        'agent': {
            'name': 'Minecraft',
            'version': 1
        },
        username,
        password,
        clientToken,
        'requestUser': true
    }
    return await poster('authenticate', body)
}

// Selected profile may be needed in the future
const refresh = async (accessToken, clientToken, selectedProfile) => {
    let body = {
        accessToken,
        clientToken,
        'requestUser': true
    }
    let res = (await poster('refresh', body)).data
    let profile = {
        accessToken: res.accessToken,
        clientToken,
        uuid: res.selectedProfile.id,
        name: res.selectedProfile.name,
        user_properties: JSON.stringify(res.user.preoperties || {})
    }
    return profile
}

const validate = async (accessToken, clientToken) => {
    let body = {
        accessToken,
        clientToken,
    }
    return await poster('validate', body)
}


const poster = async (endpoint, body) => {
    const url = 'https://authserver.mojang.com/' + endpoint
    try {
        let res = await post(url, body, { headers: {'Content-Type': 'application/json'}})
        if (res.status == 200 || res.status == 204) {
            return res
        } else {
            return false
        }
    } catch (err) {
        console.log(err)
        return false
    }
}

exports.authenticate = authenticate
exports.refresh = refresh
exports.validate = validate