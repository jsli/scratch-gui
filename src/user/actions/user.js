import {userConstants} from '../constants';
import {userService} from './user_service_async';
import {closeLoginForm, closeRegisterForm} from '../../reducers/modals';

const login = (username, password) => {
    const request = user => ({
        type: userConstants.LOGIN_REQUEST,
        user
    });
    const success = user => ({
        type: userConstants.LOGIN_SUCCESS,
        user
    });
    const failure = error => ({
        type: userConstants.LOGIN_SUCCESS,
        error
    });

    return dispatch => {
        dispatch(request({username}));

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    dispatch(closeLoginForm());
                },
                error => {
                    dispatch(failure(error));
                    // TODO: 回显错误
                    // dispatch(alertActions.error(error));
                }
            );
    };
};

const register = user => {
    const request = _user => ({
        type: userConstants.REGISTER_REQUEST,
        user: _user
    });
    const success = _user => ({
        type: userConstants.REGISTER_SUCCESS,
        user: _user
    });
    const failure = error => ({
        type: userConstants.REGISTER_FAILURE,
        error
    });

    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                _user => {
                    dispatch(success(_user));
                    dispatch(closeRegisterForm());
                },
                error => {
                    dispatch(failure(error));
                    // TODO: 回显错误
                    // dispatch(alertActions.error(error));
                }
            );
    };
};

const logout = () => {
    userService.logout();
    return {
        type: userConstants.LOGOUT
    };
};

export const userActions = {
    login,
    logout,
    register
};
