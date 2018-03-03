import api from '../../api/apis.js';
import {checkResponse} from '../../api/gateway';
import {authHeader} from '../../api/auth';

const saveOnlineProject = project => {
    const auth = authHeader();
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
            source_code: project
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

const saveOfflineProject = (project, projectName = '') => {
    // Download project data into a file - create link element,
    // simulate click on it, and then remove it.
    const saveLink = document.createElement('a');
    document.body.appendChild(saveLink);

    const data = new Blob([project], {type: 'text'});
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

export const projectService = {
    saveOnlineProject,
    saveOfflineProject
};
