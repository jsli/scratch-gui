import {userConstants} from '../_constants';
import {getAuth} from '../../api/auth';

const codingBusAuth = getAuth();
const initialState = codingBusAuth ? {loggingIn: false, loggedIn: true, codingBusAuth} : {loggingIn: false, loggedIn: false};

export function authentication (state = initialState, action) {
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
                loggedIn: false
            };
        case userConstants.LOGOUT:
            return {
                loggingIn: false,
                loggedIn: false
            };
        default:
            return state;
    }
}
