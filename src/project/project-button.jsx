import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';

import ReactMaterialUiNotifications from 'react-materialui-notifications';

class ProjectButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleClose',
            'handleItemClick'
        ]);

        this.state = {
            anchorEl: null
        };
    }

    handleClick (event) {
        console.log('------------23432432');
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose (event) {
        console.log('------------23432432');
        this.setState({ anchorEl: null });
    }

    handleItemClick () {
        console.warn('show ---dialog')
        ReactMaterialUiNotifications.showNotification({
            title: 'Title',
            additionalText: `xxxxxx`,
            overflowText: "me@gmail.com",
            personalised: true,
            autoHide: 3000,
            zDepth: 10000
        });
    }

    render () {
        const {
            saveProjectSb3, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;

        const { anchorEl } = this.state;

        return (
            <div className={props.className}>
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    Open Menu
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleItemClick}>Profile</MenuItem>
                    <MenuItem onClick={this.handleItemClick}>My account</MenuItem>
                    <MenuItem onClick={this.handleItemClick}>Logout</MenuItem>
                </Menu>
                <ReactMaterialUiNotifications
                    transitionName={{
                        leave: 'dummy',
                        leaveActive: 'fadeOut',
                        appear: 'dummy',
                        appearActive: 'zoomInUp'
                    }}
                    transitionAppear={true}
                    transitionLeave={true}
                />
            </div>
        );
    }
}

ProjectButton.propTypes = {
    saveProjectSb3: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    saveProjectSb3: state.vm.saveProjectSb3.bind(state.vm)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(ProjectButton);
