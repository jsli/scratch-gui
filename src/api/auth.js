import constants from './constants.js';
import Cookies from 'js-cookie';

/*
auth格式:
    {
        'access_token': 'token',
        'token_expires_at': '2018-12-31 00:00:00'
    }
*/

const getAuth = () => {
    return Cookies.getJSON(constants.CODING_BUS_USER);
};

const getLoginAuth = (username, password) => {
    return new Buffer(`${username}:${password}`).toString('base64');
};

const saveAuth = auth => {
    Cookies.set(constants.CODING_BUS_USER, JSON.stringify(auth), {
        expires: new Date(auth.token_expires_at)
    });
};

const cleanAuth = () => {
    Cookies.remove(constants.CODING_BUS_USER);
};

const authHeader = () => {
    const user = getAuth();
    if (user && user.access_token) {
        // 判断token是否过期
        if (user.token_expires_at && (new Date(user.token_expires_at) > new Date())) {
            return new Buffer(`${user.access_token}:`).toString('base64');
        }
        // 已过期，清除token
        cleanAuth();
    }

    return '';
};

const _user = getAuth();
const authInitialState = _user ?
    {loggingIn: false, loggedIn: true, codingBusUser: _user} : {loggingIn: false, loggedIn: false, codingBusUser: {}};

export {authHeader, saveAuth, cleanAuth, getAuth, getLoginAuth, authInitialState};
