import api from '../../api/apis.js';
import {cleanAuth, getAuth, getLoginAuth, saveAuth} from '../../api/auth';

function login(username, password) {
    const auth = getLoginAuth(username, password);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        }
    };
    console.log(requestOptions);

    return fetch(api.login, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }

            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.data && user.data.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                saveAuth(user.data);
            }

            return user;
        }, error => {
            console.warn(error);
        });
}

function logout() {
    cleanAuth();
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch('/users/register', requestOptions).then(handleResponse);
}

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}

export const userService = {
    login,
    logout,
    register
};
