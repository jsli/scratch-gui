import classNames from 'classnames';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import LoadButton from '../../containers/load-button.jsx';
import SaveButton from '../../containers/save-button.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';

import styles from './menu-bar.css';

import scratchLogo from './scratch-logo.svg';
import {userActions} from '../../user/_actions';
import {openLoginForm} from '../../reducers/modals';

const MenuBar = props => (
    <Box
        className={classNames({
            [styles.menuBar]: true
        })}
    >
        <div className={styles.mainMenu}>
            <div className={classNames(styles.logoWrapper, styles.menuItem)}>
                <img
                    alt="Scratch"
                    className={styles.scratchLogo}
                    draggable={false}
                    src={scratchLogo}
                />
            </div>
            <SaveButton className={styles.menuItem} />
            <LoadButton className={styles.menuItem} />
            <LanguageSelector className={styles.menuItem} />
        </div>
        <div
            className={styles.logoutButtonWrapper}
        >
            <Button
                className={classNames(styles.loginButton, {[styles.hide]: props.loggedIn})}
                onClick={props.onLogin}
            >
                <span className={styles.loginText}>
                    <FormattedMessage
                        defaultMessage="Login"
                        description="Label for login button"
                        id="gui.menuBar.login"
                    />
                </span>
            </Button>
            <Button
                className={classNames(styles.logoutButton, {[styles.hide]: !props.loggedIn})}
                onClick={props.onLogout}
            >
                <span className={styles.logoutText}>
                    <FormattedMessage
                        defaultMessage="Logout"
                        description="Label for logout button"
                        id="gui.menuBar.logout"
                    />
                </span>
            </Button>
        </div>
    </Box>
);

MenuBar.propTypes = {
    loggedIn: PropTypes.bool,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    const {loggedIn} = state.authentication;
    return {
        loggedIn: loggedIn,
        display: 'flex'
    };
};

const mapDispatchToProps = dispatch => ({
    onLogout: () => {
        dispatch(userActions.logout());
    },
    onLogin: () => {
        dispatch(openLoginForm());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar);
