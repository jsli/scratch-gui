// 模拟fetch-Response类的接口
class ErrorResponseWrapper {

    constructor (response) {
        this.response = response;
    }

    json () {
        return Promise.resolve(this.response);
    }
}

// 第一步check
const checkResponse = response => {
    if (response.ok) {
        return response.json();
    }
    return Promise.reject(response);
};

// 成功后解析response
const successResponse = response => {
    return Promise.resolve(response);
};

// 解析错误信息
const catchResponse = response => {
    if (response instanceof Response) {
        return Promise.reject(response);
    }

    throw new ErrorResponseWrapper(response);
};

export {
    catchResponse,
    checkResponse,
    successResponse
};
