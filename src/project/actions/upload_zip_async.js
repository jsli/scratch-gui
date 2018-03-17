import api from '../../api/apis.js';
import {checkResponse, catchResponse, successResponse} from '../../api/gateway';
import {authHeader} from '../../api/auth';

import JSZip from 'jszip';
import qiniuUpload from './qiniu.js';

import log from '../../lib/log.js';

// TODO: 代码备份！
// 上传预处理
/*
 * 由于vm只export一个打包项目的方法，所以需要将打包好的文件解包，并修改默认的project.json文件名为 {projectId}.{version}.json
 * 将解压文件列表返回，每一个单独上传。
 */
// TODO: vm提供直接导出assets列表，优化上传流程
const preUploadProject = (projectId, projectVersion, sourceCodeZip) => {
    return JSZip.loadAsync(sourceCodeZip) // 1. 解压缩
        .then(zipFile => {
            const unzipPromiseList = [];
            zipFile.forEach((relativePath, file) => {
                if (relativePath === 'project.json') { // 重命名project.json => {projectId}.{version}.json
                    // 重命名project.json => {projectId}.{version}.json
                    unzipPromiseList.push(file.async('blob').then(content => {
                        return Promise.resolve({
                            fileName: `${projectId}.${projectVersion}.json`,
                            fileContent: content
                        });
                    }));
                    // 重命名project.json => {projectId}.json，表示最新版
                    unzipPromiseList.push(file.async('blob').then(content => {
                        return Promise.resolve({
                            fileName: `${projectId}.json`,
                            fileContent: content
                        });
                    }));
                } else {
                    // project元文件
                    unzipPromiseList.push(file.async('blob').then(content => {
                        return Promise.resolve({
                            fileName: relativePath,
                            fileContent: content
                        });
                    }));
                }
            });

            return Promise.all(unzipPromiseList) // 2. 遍历所有文件，单独获取上传token(覆盖上传)
                .then(values => {
                    // zip文件也一同上传
                    values.push({
                        fileName: `${projectId}.${projectVersion}.zip`,
                        fileContent: sourceCodeZip
                    });

                    const getTokenPromiseList = [];
                    for (let i = 0; i < values.length; i++) {
                        getTokenPromiseList.push(_getUploadToken(values[i].fileName)
                            .then(data => {
                                return Promise.resolve({
                                    fileName: values[i].fileName,
                                    fileContent: values[i].fileContent,
                                    token: data.data.upload_token
                                });
                            })
                        );
                    }
                    return getTokenPromiseList;
                })
                .then(promiseValues => {
                    return Promise.all(promiseValues)
                        .then((values => {
                            const uploadPromiseList = [];
                            let uploadedCounter = 0; // 已上传计数器
                            const cb = {
                                next (res) {
                                    log.debug('qiniuUpload-next: res = ', res);
                                },
                                error (err) {
                                    log.debug('qiniuUpload-error: err = ', err);
                                },
                                complete (res) {
                                    log.debug('qiniuUpload-complete: res = ', res);
                                    for (let j = 0; j < values.length; j++) {
                                        if (res.key === values[j].fileName) {
                                            // 表示上传完成1个
                                            uploadedCounter += 1;
                                        }
                                        // 当已上传计数与上传文件数量相等时，表示全部上传完成
                                        if (uploadedCounter === values.length) {
                                            log.warn('all files uploaded!');
                                        }
                                    }
                                }
                            };
                            for (let i = 0; i < values.length; i++) {
                                qiniuUpload(values[i].fileName, values[i].fileContent, values[i].token, cb);
                            }
                            return uploadPromiseList;
                        }));
                });
        });
};
