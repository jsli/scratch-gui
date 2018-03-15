import * as qiniu from 'qiniu-js';

import log from '../../lib/log.js';


const defaultCallback = {
    next (res) {
        log.debug('qiniuUpload-next: res = ', res);
    },
    error (err) {
        log.debug('qiniuUpload-error: err = ', err);
    },
    complete (res) {
        log.debug('qiniuUpload-complete: res = ', res);
        return Promise.resolve(res);
    }
};


const qiniuUpload = (fileName, fileContent, token, callback = defaultCallback) => {
    const observable = qiniu.upload(
        fileContent,
        fileName,
        token,
    );

    const subscription = observable.subscribe(callback);
    return subscription;
};

export default qiniuUpload;
