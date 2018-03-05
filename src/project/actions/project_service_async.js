import api from '../../api/apis.js';
import {checkResponse} from '../../api/gateway';
import {authHeader} from '../../api/auth';

// 保存项目-在线
const saveOnlineProject = (project, sourceCode) => {
    const auth = authHeader();
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
            source_code: sourceCode
        })
    };

    return fetch(`${api.project}/${project.no}`, requestOptions)
        .then(checkResponse)
        .then(
            data => {
                // TODO: 保存项目成功
                console.warn(data);
            }
        )
        .catch(
            errorResponse => {
                errorResponse.json().then(
                    error => {
                        // TODO: 保存项目失败
                        console.error(error);
                    }
                );
            }
        );
};

// 保存项目-本地
const saveOfflineProject = (sourceCode, projectName = '') => {
    // Download project data into a file - create link element,
    // simulate click on it, and then remove it.
    const saveLink = document.createElement('a');
    document.body.appendChild(saveLink);

    const data = new Blob([sourceCode], {type: 'text'});
    const url = window.URL.createObjectURL(data);
    saveLink.href = url;

    if (projectName === '') {
        // File name: project-DATE-TIME
        const date = new Date();
        const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
        projectName = `project-${timestamp}.json`;
    }

    saveLink.download = projectName;
    saveLink.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(saveLink);
};

// 新建项目-在线
const newOnlineProject = project => {
    // todo: 刷新playgroud，是否需要放在这里？

    const auth = authHeader();
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
            name: project.name,
            source_code: project.source_code,
            version: 3,
            memo: project.memo
        })
    };

    return fetch(api.project, requestOptions)
        .then(checkResponse)
        .then(
            data => {
                console.warn(data);
            }
        )
        .catch(
            errorResponse => {
                errorResponse.json().then(
                    error => {
                        console.error(error);
                    }
                );
            }
        );
};

// 新建项目-本地
const newOfflineProject = project => {
    // todo: 刷新playgroud，是否需要放在这里？
};

export const projectService = {
    saveOnlineProject,
    saveOfflineProject,
    newOfflineProject,
    newOnlineProject
};
