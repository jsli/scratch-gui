import api from '../../api/apis.js';
import {checkResponse} from '../../api/gateway';
import {cleanAuth, getLoginAuth, saveAuth} from '../../api/auth';

const login = (username, password) => {
    const auth = getLoginAuth(username, password);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        }
    };

    return fetch(api.login, requestOptions)
        .then(checkResponse);
};

const register = registerInfo => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerInfo)
    };

    return fetch(api.register, requestOptions)
        .then(checkResponse);
};

const logout = () => {
    cleanAuth();
};

export const userService = {
    login,
    logout,
    register
};
