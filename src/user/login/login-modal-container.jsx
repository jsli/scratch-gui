import React from 'react';
import {connect} from 'react-redux';

import {userActions} from '../_actions';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import LoginModalComponent from './login-modal-component.jsx';
import {closeLoginForm} from '../../reducers/modals';

class LoginModal extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            username: '',
            password: '',
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
        const {username, password} = this.state;
        const {dispatch} = this.props;
        if (username && password) {
            // reset login status
            dispatch(userActions.logout());
            dispatch(userActions.login(username, password));
        }
    }

    render () {
        const {loggingIn, isOpen} = this.props;
        const {username, password, submitted} = this.state;

        return (
            <LoginModalComponent
                isOpen={isOpen}
                loggingIn={loggingIn}
                password={password}
                submitted={submitted}
                username={username}
                onChange={this.handleChange}
                onClose={this.props.onClose}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

LoginModal.propTypes = {
    isOpen: PropTypes.bool,
    loggingIn: PropTypes.bool,
    onClose: PropTypes.func
};

const mapStateToProps = state => {
    const {loggingIn} = state.authentication;
    return {
        loggingIn,
        isOpen: state.modals.loginForm
    };
};

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closeLoginForm());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModal);
