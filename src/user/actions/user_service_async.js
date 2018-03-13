import api from '../../api/apis.js';
import {cleanAuth, getLoginAuth} from '../../api/auth';
import {checkResponse, catchResponse, successResponse} from '../../api/gateway';

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
        .then(checkResponse)
        .then(successResponse)
        .catch(catchResponse);
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
        .then(checkResponse)
        .then(successResponse)
        .catch(catchResponse);
};

const logout = () => {
    cleanAuth();
};

export const userService = {
    login,
    logout,
    register
};
