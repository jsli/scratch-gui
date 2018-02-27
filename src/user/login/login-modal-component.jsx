import React from 'react';

import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Box from '../../components/box/box.jsx';
import styles from './login-modal-component.css';

const LoginModal = props => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
    >
        <Box className={styles.body}>
            <div className="col-md-6 col-md-offset-3">
                <h2>Login</h2>
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
                    <div className="form-group">
                        <button className="btn btn-primary">Login</button>
                        {props.loggingIn &&
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
                    </div>
                </form>
            </div>
        </Box>
    </ReactModal>
);

LoginModal.propTypes = {
    loggingIn: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    password: PropTypes.string,
    submitted: PropTypes.bool,
    username: PropTypes.string
};

export default LoginModal;
