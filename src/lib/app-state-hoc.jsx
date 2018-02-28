import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import throttle from 'redux-throttle';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import {intlInitialState, IntlProvider} from '../reducers/intl.js';
import reducer from '../reducers/gui';
import {authInitialState} from '../api/auth';

const loggerMiddleware = createLogger();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        throttle(300, {leading: true, trailing: true})
    )
);

// 获取当前登录状态
intlInitialState.authentication = {
    ...authInitialState
};
const store = createStore(reducer, intlInitialState, enhancer);

import ErrorBoundary from '../containers/error-boundary.jsx';

/*
 * Higher Order Component to provide redux state
 * @param {React.Component} WrappedComponent - component to provide state for
 * @returns {React.Component} component with redux and intl state provided
 */
const AppStateHOC = function (WrappedComponent) {
    const AppStateWrapper = ({...props}) => (
        <Provider store={store}>
            <IntlProvider>
                <ErrorBoundary>
                    <WrappedComponent {...props} />
                </ErrorBoundary>
            </IntlProvider>
        </Provider>
    );
    return AppStateWrapper;
};

export default AppStateHOC;
