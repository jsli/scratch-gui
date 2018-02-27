import React from 'react';
import {connect} from 'react-redux';

import {userActions} from '../_actions';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import LoginModalComponent from './login-modal-component.jsx';

class LoginModal extends React.Component {
    constructor (props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

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
            dispatch(userActions.login(username, password));
        }
    }

    render () {
        const {loggingIn} = this.props;
        const {username, password, submitted} = this.state;

        return (
            <LoginModalComponent
                loggingIn={loggingIn}
                password={password}
                submitted={submitted}
                username={username}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

LoginModal.propTypes = {
    loggingIn: PropTypes.bool
};

const mapStateToProps = state => {
    const {loggingIn} = state.authentication;
    return {
        loggingIn
    };
};

export default connect(
    mapStateToProps
)(LoginModal);
