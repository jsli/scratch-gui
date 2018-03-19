import React from 'react';

import analytics from './analytics';
import log from './log';
import storage from './storage';
import projectEvent, {EVENT_UPDATE_PROJECT_ID_ONLY} from '../project/actions/project_event.js';

/* Higher Order Component to provide behavior for loading projects by id from
 * the window's hash (#this part in the url)
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */

/*
 * 扩展: 与project模块，通过event通信。
 * 当project模块新建项目后，通过event发来新的projectId和projectData，更新在url中，并通过shouldLoadProject为false,
 * 标识不需要重新load项目
 */
const ProjectLoaderHOC = function (WrappedComponent) {
    class ProjectLoaderComponent extends React.Component {
        constructor (props) {
            super(props);
            this.fetchProjectId = this.fetchProjectId.bind(this);
            this.updateProject = this.updateProject.bind(this);
            this.updateProjectIdOnly = this.updateProjectIdOnly.bind(this);
            this.state = {
                shouldLoadProject: true,
                projectId: null,
                projectData: null,
                projectVersion: null,
                fetchingProject: false
            };
        }
        componentDidMount () {
            projectEvent.on(EVENT_UPDATE_PROJECT_ID_ONLY, this.updateProjectIdOnly);
            window.addEventListener('hashchange', this.updateProject);
            this.updateProject();
        }
        componentWillUpdate (nextProps, nextState) {
            if (this.state.projectId !== nextState.projectId && nextState.shouldLoadProject) {
                this.setState({fetchingProject: true}, () => {
                    storage
                        .load(storage.AssetType.Project, this.state.projectId, storage.DataFormat.JSON)
                        .then(projectAsset => projectAsset && this.setState({
                            projectData: projectAsset.data.toString(),
                            fetchingProject: false
                        }))
                        .catch(err => log.error(err));
                });
            }
        }
        componentWillUnmount () {
            projectEvent.removeListener(EVENT_UPDATE_PROJECT_ID_ONLY, this.updateProjectIdOnly);
            window.removeEventListener('hashchange', this.updateProject);
        }
        fetchProjectId () {
            return window.location.hash.substring(1);
        }
        updateProject () {
            let projectId = this.fetchProjectId();
            if (projectId !== this.state.projectId && this.state.shouldLoadProject) {
                if (projectId.length < 1) projectId = 0;
                this.setState({projectId: projectId});

                if (projectId !== 0) {
                    analytics.event({
                        category: 'project',
                        action: 'Load Project',
                        value: projectId,
                        nonInteraction: true
                    });
                }
            }
        }
        updateProjectIdOnly (projectId, projectVersion, projectData) {
            this.setState({projectId: projectId, projectData: projectData, projectVersion: projectVersion, shouldLoadProject: false},
                () => {
                    // TODO: 暂时不支持version
                    window.location.href = `${window.location.origin}/#${projectId}`;
                    this.setState({shouldLoadProject: true});
                }
            );
        }
        render () {
            if (!this.state.projectData) return null;
            return (
                <WrappedComponent
                    fetchingProject={this.state.fetchingProject}
                    projectData={this.state.projectData}
                    shouldLoadProject={this.state.shouldLoadProject}
                    {...this.props}
                />
            );
        }
    }

    return ProjectLoaderComponent;
};


export {
    ProjectLoaderHOC as default
};
