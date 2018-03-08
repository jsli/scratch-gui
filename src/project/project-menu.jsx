import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import log from '../lib/log.js';

import Menu, {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import {projectService} from './actions/project_service_async.js';
import VM from "scratch-vm";

class ProjectMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleClose',
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
        this.setState({anchorEl: anchorEl, openMenu: true});
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
        log.info('new local project');
        this.props.newProject();
        this.props.vm.refreshWorkspace();
        this.closeMenu();
    }

    handleSaveClick () {
        this.closeMenu();
    }

    handleSaveLocalClick () {
        log.info('save local project');
        this.closeMenu();
        const json = this.props.saveProjectSb3();
        log.debug('source code: ', json);
        projectService.saveOfflineProject(json, 'xxx');
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
    newProject: PropTypes.func.isRequired,
    saveProjectSb3: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    newProject: state.vm.clear.bind(state.vm),
    saveProjectSb3: state.vm.saveProjectSb3.bind(state.vm),
    vm: state.vm
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(ProjectMenu);
