import React from 'react';

import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Box from '../../components/box/box.jsx';
import styles from './register-modal-component.css';
import ButtonComponent from '../../components/button/button.jsx';

const RegisterModal = props => (
    <ReactModal
        className={styles.modalContent}
        isOpen={props.isOpen}
        overlayClassName={styles.modalOverlay}
        onLoginClick={props.onLoginClick}
        onRequestClose={props.onClose}
    >
        <Box className={styles.body}>
            <div className="col-md-6 col-md-offset-3">
                <h2>Register</h2>
                <form
                    name="form"
                    onSubmit={props.onSubmit}
                >
                    <div className={'form-group' + (props.submitted && !props.username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input
                            className="form-control"
                            name="username"
                            type="text"
                            value={props.username}
                            onChange={props.onChange}
                        />
                        {props.submitted && !props.username &&
                        <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div
                        className={'form-group' + (props.submitted && !props.password ? ' has-error' : '')}
                    >
                        <label htmlFor="password">Password</label>
                        <input
                            className="form-control"
                            name="password"
                            type="password"
                            value={props.password}
                            onChange={props.onChange}
                        />
                        {props.submitted && !props.password &&
                        <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div
                        className={'form-group' + (props.submitted && !props.password ? ' has-error' : '')}
                    >
                        <label htmlFor="password">Password Copy</label>
                        <input
                            className="form-control"
                            name="passwordCopy"
                            type="password"
                            value={props.passwordCopy}
                            onChange={props.onChange}
                        />
                        {props.submitted && !props.password &&
                        <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Register</button>
                        {props.registering &&
                        <img
                            src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/
                             C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAAC
                             wAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkY
                             DAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRV
                             saqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDM
                             lFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAA
                             AAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/I
                             pHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWU
                             Ipz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4w
                             Gccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAA
                             ADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5
                             BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVt
                             qlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                        />
                        }
                        <ButtonComponent
                            onClick={props.onLoginClick}
                        >
                            Login
                        </ButtonComponent>
                    </div>
                </form>
            </div>
        </Box>
    </ReactModal>
);

RegisterModal.propTypes = {
    isOpen: PropTypes.bool,
    registering: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    password: PropTypes.string,
    passwordCopy: PropTypes.string,
    submitted: PropTypes.bool,
    username: PropTypes.string
};

export default RegisterModal;
