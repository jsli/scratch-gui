import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import log from '../lib/log.js';

import Menu, {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import {projectService} from './actions/project_service_async.js';
import VM from "scratch-vm";

import styles from './project-menu.css';

class ProjectMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleClose',
            'openMenu',
            'closeMenu',
            'handleNewClick',
            'handleSaveClick',
            'handleSaveLocalClick',
            'handleLoadClick',
            'handleLoadLocalClick',
            'setFileInput',
            'handleFileChange'
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
        // TODO: 暴力刷新，对话框提示
        if (this.props.loggedIn) {
            // TODO: 已登录
            // 1. dialog接收新建项目名称
            // 2. 创建项目，创建个空项目
            projectService.newOnlineProject()
                .then(data => {
                    // 3. 将projectid增加到url哈希
                    location.replace("http://www.runoob.com");
                })
                .catch(e => {
                    location.reload(true);
                });
        } else {
            // 未登录，直接刷新
            location.reload(true);
        }
    }

    handleSaveClick () {
        this.closeMenu();
        if (this.props.loggedIn) {
            this.props.vm.saveProjectSb3().then(content => {
                // TODO: props中需要设置当前编辑的project
                projectService.saveOnlineProject(project, content);
            });
        } else {
            // TODO: 提示请登录
        }
    }

    handleSaveLocalClick () {
        this.closeMenu();

        log.info('save project locally');
        const saveLink = document.createElement('a');
        document.body.appendChild(saveLink);
        this.props.vm.saveProjectSb3().then(content => {
            const url = window.URL.createObjectURL(content);
            saveLink.href = url;

            // TODO user-friendly project name
            // File name: project-DATE-TIME
            const date = new Date();
            const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
            // TODO change extension to sb3
            saveLink.download = `project-${timestamp}.zip`;
            saveLink.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(saveLink);
        });
    }

    handleLoadClick () {
        this.closeMenu();

        // TODO: 加载线上项目
    }

    handleLoadLocalClick () {
        this.closeMenu();

        // 打开文件选择
        this.fileInput.click();
    }

    setFileInput (input) {
        this.fileInput = input;
    }

    handleFileChange (e) {
        // 打开项目文件
        const reader = new FileReader();
        // 通过vm加在项目文件
        reader.onload = () => this.props.vm.loadProjectLocal(reader.result);
        reader.readAsArrayBuffer(e.target.files[0]);
    }

    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
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
                    <MenuItem onClick={this.handleSaveClick}>Save</MenuItem>
                    <MenuItem onClick={this.handleSaveLocalClick}>Save(local)</MenuItem>
                    <MenuItem onClick={this.handleLoadClick}>Load</MenuItem>
                    <MenuItem onClick={this.handleLoadLocalClick}>Load(local)</MenuItem>
                </Menu>
                <input
                    className={styles.fileInput}
                    ref={this.setFileInput}
                    type="file"
                    onChange={this.handleFileChange}
                />
            </div>
        );
    }
}

ProjectMenu.propTypes = {
    loggedIn: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => {
    const {loggedIn} = state.authentication;
    const vm = state.vm;
    return {
        loggedIn,
        vm
    };
};

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(ProjectMenu);
