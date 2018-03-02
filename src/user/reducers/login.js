import {userConstants} from '../constants';
import {getAuth} from '../../api/auth';

const codingBusAuth = getAuth();
const initialState = codingBusAuth ?
    {loggingIn: false, loggedIn: true, codingBusAuth} : {loggingIn: false, loggedIn: false, codingBusAuth: {}};


const authentication = (state = initialState, action) => {
    switch (action.type) {
    case userConstants.LOGIN_REQUEST:
        return {
            loggingIn: true,
            loggedIn: false,
            codingBusAuth: action.user
        };
    case userConstants.LOGIN_SUCCESS:
        return {
            loggingIn: false,
            loggedIn: true,
            codingBusAuth: action.user
        };
    case userConstants.LOGIN_FAILURE:
        return {
            loggingIn: false,
            loggedIn: false,
            codingBusAuth: {}
        };
    case userConstants.LOGOUT:
        return {
            loggingIn: false,
            loggedIn: false,
            codingBusAuth: {}
        };
    default:
        return state;
    }
};

export default authentication;
