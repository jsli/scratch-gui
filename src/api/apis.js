import host from './hosts';

const getApi = api => {
    return host + api;
};

export default {
    // 用户相关
    login: getApi('/staff/login'),
    logout: getApi('/user/logout'),
    register: getApi('/user/register')
};
