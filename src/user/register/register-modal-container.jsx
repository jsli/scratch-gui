import React from 'react';
import {connect} from 'react-redux';

import {userActions} from '../actions';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import RegisterModalComponent from './register-modal-component.jsx';
import {closeRegisterForm, openLoginForm} from '../../reducers/modals';

class RegisterModal extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            passwordCopy: '',
            submitted: false
        };

        bindAll(this, [
            'handleChange',
            'handleSubmit'
        ]);
    }

    handleChange (e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit (e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {username, password, passwordCopy} = this.state;
        const {dispatch} = this.props;
        if (username && password && passwordCopy) {
            // reset Register status
            dispatch(userActions.logout());
            dispatch(userActions.register({
                mobile: username,
                password: password,
                password_copy: passwordCopy
            }));
        }
    }

    render () {
        const {registering, isOpen} = this.props;
        const {username, password, passwordCopy, submitted} = this.state;

        return (
            <RegisterModalComponent
                isOpen={isOpen}
                password={password}
                passwordCopy={passwordCopy}
                registering={registering}
                submitted={submitted}
                username={username}
                onChange={this.handleChange}
                onClose={this.props.onClose}
                onLoginClick={this.props.onLoginClick}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

RegisterModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onLoginClick: PropTypes.func,
    registering: PropTypes.bool
};

const mapStateToProps = state => {
    const {registering} = state.authentication;
    return {
        registering,
        isOpen: state.modals.registerForm
    };
};

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closeRegisterForm());
    },
    onLoginClick: () => {
        dispatch(closeRegisterForm());
        return dispatch(openLoginForm());
    },
    dispatch
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterModal);
