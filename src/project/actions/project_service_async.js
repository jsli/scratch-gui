import api from '../../api/apis.js';
import {checkResponse, catchResponse, successResponse} from '../../api/gateway';
import {authHeader} from '../../api/auth';

import log from '../../lib/log.js';


// 获取上传token
const _getUploadToken = key => {
    const auth = authHeader();
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        }
    };

    return fetch(`${api.uploadToken}?key=${key}`, requestOptions)
        .then(checkResponse)
        .then(successResponse)
        .catch(catchResponse);
};


// 获取项目列表
const fetchProjectList = () => {
    const auth = authHeader();
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        }
    };

    return fetch(`${api.project}/list`, requestOptions)
        .then(checkResponse)
        .then(successResponse)
        .catch(catchResponse);
};

// 上传项目
const uploadProject = (projectId, sourceCodeZip) => {
    const form = new FormData();
    form.append(`${projectId}.zip`, sourceCodeZip);

    const auth = authHeader();
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`
        },
        body: form
    };

    return fetch(`${api.project}/${projectId}/upload`, requestOptions)
        .then(checkResponse)
        .then(successResponse)
        .catch(catchResponse);
};

// 创建项目
const createProject = (project = null) => {
    const auth = authHeader();
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
            name: project ? project.name : '',
            memo: project ? project.memo : ''
        })
    };

    return fetch(api.project, requestOptions)
        .then(checkResponse)
        .then(successResponse)
        .catch(catchResponse);
};

export const projectService = {
    uploadProject,
    createProject,
    fetchProjectList
};
