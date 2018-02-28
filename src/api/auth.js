import constants from './constants.js';

/*
auth格式:
    {
        'access_token': 'token',
        'token_expires_at': '2018-12-31 00:00:00'
    }
*/

const getAuth = () => {
    const auth = JSON.parse(localStorage.getItem(constants.CODING_BUS_USER));
    return auth;
};

const getLoginAuth = (username, password) => {
    const loginAuth = new Buffer(`${username}:${password}`).toString('base64');
    return loginAuth;
};

const saveAuth = auth => {
    localStorage.setItem(constants.CODING_BUS_USER, JSON.stringify(auth));
};

const cleanAuth = () => {
    localStorage.removeItem(constants.CODING_BUS_USER);
};

const authHeader = () => {
    const user = getAuth();
    if (user && user.access_token) {
        const auth = new Buffer(user.access_token).toString('base64');
        if (user.token_expires_at && (user.token_expires_at > new Date())) {
            return auth;
        } else {
            cleanAuth();
            return '';
        }
        return auth;
    }

    return '';
};

const _user = getAuth();
const authInitialState = _user ?
    {loggingIn: false, loggedIn: true, codingBusUser: _user} : {loggingIn: false, loggedIn: false};

export {authHeader, saveAuth, cleanAuth, getAuth, getLoginAuth, authInitialState};
