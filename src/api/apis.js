import host from './hosts';

const getApi = api => {
    return host + api;
};

export default {
    // 用户相关
    login: getApi('/user/login'),
    logout: getApi('/user/logout'),
    register: getApi('/user/register'),

    // 项目相关
    project: getApi('/scratch/project')
};
