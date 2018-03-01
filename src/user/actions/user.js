import {userConstants} from '../constants';
import {userService} from './user_service_async';
import {closeLoginForm, closeRegisterForm} from '../../reducers/modals';
import {saveAuth} from '../../api/auth';

const loginSuccess = user => ({
    type: userConstants.LOGIN_SUCCESS,
    user
});

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
        type: userConstants.LOGIN_FAILURE,
        error
    });

    return dispatch => {
        dispatch(request({username}));

        userService.login(username, password)
            .then(
                data => {
                    const user = data.data;
                    // login successful if there's a jwt token in the response
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    if (user && user.access_token) {
                        saveAuth(user);
                        dispatch(success(user));
                        dispatch(closeLoginForm());
                    }
                }
            )
            .catch(
                errorResponse => {
                    errorResponse.json().then(
                        error => {
                            dispatch(failure(error.message));
                        }
                    );
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
                data => {
                    console.log('432432432 ', data);
                    const _user = data.data;
                    // login successful if there's a jwt token in the response
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    if (_user && _user.access_token) {
                        saveAuth(_user);
                        dispatch(success(_user));
                        dispatch(loginSuccess(_user));
                        dispatch(closeRegisterForm());
                    }
                }
            )
            .catch(
                errorResponse => {
                    errorResponse.json().then(
                        error => {
                            dispatch(failure(error.message));
                        }
                    );
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
