import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import log from '../lib/log.js';

import Menu, {MenuItem} from 'material-ui/Menu';
import ButtonComponent from '../components/button/button.jsx';
import {projectService} from './actions/project_service_async.js';
import VM from 'scratch-vm';
import ProjectListModal from './project-list-modal-component.jsx';
import List, {ListItem} from 'material-ui/List';
import projectUtils from './utils.js';

// import projectEvent, {EVENT_UPDATE_PROJECT_ID_ONLY} from './actions/project_event.js';

import styles from './project-menu.css';

/*
 * ProjectMenu部分功能独立于project-loader-hoc.jsx
 * 1. 项目上传功能是独立的，projectId通过event传递给project-loader-hoc.jsx
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
            'handleSaveClick',
            'handleFetchClick',
            'handleExportClick',
            'handleImportClick',
            'setImportFile',
            'handleImportFileChange',
            'renderProjectList',
            'handleCloseProjectList'
        ]);

        this.state = {
            anchorEl: null,
            openMenu: false,
            uploadingProject: false,
            openProjectList: false,
            projectList: null
        };
    }

    openMenu (anchorEl) {
        this.setState({anchorEl: anchorEl, openMenu: true});
    }

    closeMenu () {
        this.setState({anchorEl: null, openMenu: false});
    }

    // 点击menu
    handleClick (event) {
        this.openMenu(event.currentTarget);
    }

    // 关闭menu
    handleClose () {
        this.closeMenu();
    }

    // 新建项目
    handleNewClick () {
        this.closeMenu();

        // TODO: 暴力刷新，对话框提示
        location.replace(location.origin);
    }

    // 保存项目
    handleSaveClick () {
        this.closeMenu();

        const uploadAction = () => {
            const projectInfo = projectUtils.parseProjectFromUrl();
            this.props.vm.saveProjectSb3().then(content => {
                projectService.preUploadProject(projectInfo.projectId, projectInfo.projectVersion, content)
                    .then(() => {
                        this.setState({uploadingProject: false});
                        log.info(`${projectInfo}\nuploaded!`);
                    })
                    .catch(uploadError => {
                        this.setState({uploadingProject: false});
                        uploadError.json().then(_uploadError => {
                            log.debug('after upload project: ', _uploadError);
                        });
                    });
            });
        };

        if (this.props.loggedIn) {
            const projectId = window.location.hash.substring(1);
            this.setState({uploadingProject: true});
            if (projectId) {
                // 直接上传
                uploadAction(projectId);
            } else {
                // 先创建项目，然后上传
                projectService.createProject()
                    .then(data => {
                        const projectInfo = data.data;
                        log.debug('create new project: ', projectInfo);
                        log.debug('begin upload project: ', projectInfo);
                        uploadAction(projectInfo.no);
                        // projectEvent.emit(EVENT_UPDATE_PROJECT_ID_ONLY, projectInfo.no, this.props.vm.toJSON());
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

    // 导出项目
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

    // 获取项目列表
    handleFetchClick () {
        this.closeMenu();
        // this.setState({openProjectList: true});

        projectService.fetchProjectList()
            .then(data => {
                const projectListData = data.data.items;
                for (let i = 0; i < projectListData.length; i++) {
                    const project = projectListData[i];
                    log.debug('project = ', project);
                }

                // 打开项目列表
                const projectList = this.renderProjectList(projectListData);
                this.setState({projectList: projectList, openProjectList: true});
            })
            .catch(e => {
                e.json().then(response => {
                    log.error('fetch project list error: ', response);
                });
            });
    }

    handleCloseProjectList () {
        this.setState({projectList: null, openProjectList: false});
    }

    renderProjectList (projectListData) {
        const projectListItem = [];
        projectListData.map(project => (
            projectListItem.push(
                <ListItem key={project.no}>
                    <a
                        href={`${location.origin}#${project.no}.${project.version ? project.version : 1}`}
                    >
                        {project.name}
                    </a>
                </ListItem>
            )
        ));

        return <List>{projectListItem}</List>;
    }

    // 导入项目
    handleImportClick () {
        this.closeMenu();

        // 打开文件选择
        this.fileInput.click();
    }

    setImportFile (input) {
        this.fileInput = input;
    }

    handleImportFileChange (e) {
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

        const {anchorEl, openMenu, projectList, openProjectList} = this.state;

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
                    <MenuItem onClick={this.handleSaveClick}>Save(Upload)</MenuItem>
                    <MenuItem onClick={this.handleFetchClick}>Fetch</MenuItem>
                    <MenuItem onClick={this.handleImportClick}>Import</MenuItem>
                    <MenuItem onClick={this.handleExportClick}>Export</MenuItem>
                </Menu>
                <input
                    className={styles.fileInput}
                    ref={this.setImportFile}
                    type="file"
                    onChange={this.handleImportFileChange}
                />
                <ProjectListModal
                    isOpen={openProjectList}
                    projectList={projectList}
                    onRequestClose={this.handleCloseProjectList}
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
