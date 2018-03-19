const parseProjectFromUrl = () => {
    // 去掉#
    const project = window.location.hash.substring(1).split('.');
    if (project.length === 0) {
        return {
            projectId: null,
            projectVersion: 0
        };
    } else if (project.length === 1) {
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
