import api from '../../api/apis.js';
import {checkResponse} from '../../api/gateway';
import {authHeader} from '../../api/auth';

import {FormData} from 'form-data';

// 保存项目-在线
const saveOnlineProject = (project, sourceCodeZip) => {
    const auth = authHeader();
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/zip',
            'Authorization': `Basic ${auth}`
        },
        body: sourceCodeZip
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

// 新建项目-在线
const newOnlineProject = project => {
    const auth = authHeader();
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
            name: project.name,
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

export const projectService = {
    saveOnlineProject,
    newOnlineProject
};
