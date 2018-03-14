import {EventEmitter} from 'events';

// 与project-load-hoc.jsx通信
const projectEventEmitter = new EventEmitter();

const EVENT_UPDATE_PROJECT_ID_ONLY = 'UPDATE_PROJECT_ID_ONLY';

export default projectEventEmitter;
export {EVENT_UPDATE_PROJECT_ID_ONLY};
