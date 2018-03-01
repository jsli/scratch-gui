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
        .then(
            response => {
                if (!response.ok) {
                    return Promise.reject(response.statusText);
                }

                return response.json();
            }
        )
        .then(
            data => {
                const user = data.data;
                // login successful if there's a jwt token in the response
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    saveAuth(user);
                }

                return user;
            },
            error => {
                Promise.reject(error);
            }
        );
};

const logout = () => {
    cleanAuth();
};

export const userService = {
    login,
    logout,
    register
};
