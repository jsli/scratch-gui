const parseProjectFromUrl = () => {
    const project = window.location.hash.split('.');
    if (project.length === 1) {
        return {
            projectId: project[0],
            projectVersion: 1
        };
    } else {
        return {
            projectId: project[0],
            projectVersion: project[1]
        };
    }
};

const projectUtils = {
    parseProjectFromUrl
};

export default projectUtils;
