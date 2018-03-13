import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import log from '../lib/log.js';

import Menu, {MenuItem} from 'material-ui/Menu';
import ButtonComponent from '../components/button/button.jsx';
import {projectService} from './actions/project_service_async.js';
import VM from 'scratch-vm';

import styles from './project-menu.css';

/*
 * ProjectMenu部分功能独立于project-loader-hoc.jsx
 * 1. 项目上传功能是独立的，projectId并不体现在url的hash中，内部保存
 * 2. 当加载线上项目时，会复用project-loader-hoc.jsx的功能，ProjectMenu会拼接url+hash，并刷新，将加载工作交给project-loader-hoc
 * 3. 新建项目时，会强制刷新，所有状态都初始化(除了登录状态)
 */

class ProjectMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleClose',
            'openMenu',
            'closeMenu',
            'handleNewClick',
            'handleUploadClick',
            'handleFetchClick',
            'handleExportClick',
            'handleImportClick',
            'setFileInput',
            'handleFileChange',
            'fetchProjectId'
        ]);

        this.state = {
            anchorEl: null,
            openMenu: false,
            projectId: this.fetchProjectId(),
            uploadingProject: false
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
        location.replace(location.origin);
    }

    handleUploadClick () {
        this.closeMenu();
        if (this.props.loggedIn) {
            const projectId = this.fetchProjectId();
            this.setState({uploadingProject: true});
            if (projectId) {
                // 直接上传
                this.setState({projectId: projectId});
                this.props.vm.saveProjectSb3().then(content => {
                    log.debug('zip project ok.');
                    projectService.uploadProject(projectId, content)
                        .then(uploadResponse => {
                            this.setState({uploadingProject: false});
                            log.debug('after upload project: ', uploadResponse);
                        })
                        .catch(uploadError => {
                            this.setState({uploadingProject: false});
                            uploadError.json().then(_uploadError => {
                                log.debug('after upload project: ', _uploadError);
                            });
                        });
                });
            } else {
                // 先创建项目，然后上传
                projectService.createProject()
                    .then(data => {
                        const projectInfo = data.data;
                        log.debug('create new project: ', projectInfo);
                        log.debug('begin upload project: ', projectInfo);
                        this.setState({projectId: projectInfo.no});
                        this.props.vm.saveProjectSb3().then(content => {
                            log.debug('zip project ok.');
                            projectService.uploadProject(projectInfo.no, content)
                                .then(uploadResponse => {
                                    this.setState({uploadingProject: false});
                                    log.debug('after upload project: ', uploadResponse);
                                })
                                .catch(uploadError => {
                                    this.setState({uploadingProject: false});
                                    uploadError.json().then(_uploadError => {
                                        log.debug('after upload project: ', _uploadError);
                                    });
                                });
                        });
                    })
                    .catch(e => {
                        e.json().then(response => {
                            log.error('create new project error: ', response);
                        });
                    });
            }
        } else {
            // TODO: 提示请登录
            log.error('Please login firstly!');
        }
    }

    handleExportClick () {
        // 导出项目到本地
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

    handleFetchClick () {
        this.closeMenu();

        // TODO: 加载线上项目
        const url = `${location.origin}#998f38b9288195797d2e69a3c19fc5`
        location.replace(url);
    }

    handleImportClick () {
        // 从本地导入项目

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

    fetchProjectId () {
        return window.location.hash.substring(1);
    }

    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;

        const {anchorEl, openMenu} = this.state;

        return (
            <div className={props.className}>
                <ButtonComponent
                    aria-haspopup={'true'}
                    aria-owns={anchorEl ? 'project-menu' : null}
                    onClick={this.handleClick}
                >
                    Project
                </ButtonComponent>
                <Menu
                    anchorEl={anchorEl}
                    id={'project-menu'}
                    open={openMenu}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleNewClick}>New</MenuItem>
                    <MenuItem onClick={this.handleFetchClick}>Fetch</MenuItem>
                    <MenuItem onClick={this.handleUploadClick}>Upload</MenuItem>
                    <MenuItem onClick={this.handleExportClick}>Export</MenuItem>
                    <MenuItem onClick={this.handleImportClick}>Import</MenuItem>
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
