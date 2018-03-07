import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Menu, {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';

class ProjectMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleClose',
            'handleItemClick',
            'openMenu',
            'closeMenu',
            'handleNewClick',
            'handleNewLocalClick',
            'handleSaveClick',
            'handleSaveLocalClick',
            'handleLoadClick',
            'handleLoadLocalClick'
        ]);

        this.state = {
            anchorEl: null,
            openMenu: false
        };
    }

    openMenu (anchorEl) {
        this.setState({anchorEl: anchorEl, openMenu: false});
    }

    closeMenu () {
        this.setState({anchorEl: null, openMenu: false});
    }

    handleClick (event) {
        this.openMenu(event.currentTarget);
    }

    handleClose () {
        this.closeMenu();
    }

    handleNewClick () {
        this.closeMenu();
    }

    handleNewLocalClick () {
        this.closeMenu();
    }

    handleSaveClick () {
        this.closeMenu();
    }

    handleSaveLocalClick () {
        this.closeMenu();
    }

    handleLoadClick () {
        this.closeMenu();
    }

    handleLoadLocalClick () {
        this.closeMenu();
    }

    render () {
        const {
            saveProjectSb3, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;

        const {anchorEl, openMenu} = this.state;

        return (
            <div className={props.className}>
                <Button
                    aria-haspopup={'true'}
                    aria-owns={anchorEl ? 'project-menu' : null}
                    onClick={this.handleClick}
                >
                    Project
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    id={'project-menu'}
                    open={openMenu}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleNewClick}>New</MenuItem>
                    <MenuItem onClick={this.handleNewLocalClick}>New(local)</MenuItem>
                    <MenuItem onClick={this.handleSaveClick}>Save</MenuItem>
                    <MenuItem onClick={this.handleSaveLocalClick}>Save(local)</MenuItem>
                    <MenuItem onClick={this.handleLoadClick}>Load</MenuItem>
                    <MenuItem onClick={this.handleLoadLocalClick}>Load(local)</MenuItem>
                </Menu>
            </div>
        );
    }
}

ProjectMenu.propTypes = {
    saveProjectSb3: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    saveProjectSb3: state.vm.saveProjectSb3.bind(state.vm)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(ProjectMenu);
