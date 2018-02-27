import api from '../../api/apis.js'

function login(username, password) {
    const auth = new Buffer(`${username}:${password}`).toString('base64');
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        }
    };

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
                localStorage.setItem('user', JSON.stringify(user.data));
            }

            return user;
        }, error => {
            console.warn(error);
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
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
