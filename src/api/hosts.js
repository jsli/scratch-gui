const prodHost = `http://192.168.1.101:8000`;
const devHost = `http://192.168.1.101:8000`;
const defaultHost = `http://127.0.0.1:5000`;

const _host = () => {
    if (process.env.NODE_ENV === 'prod') {
        return prodHost;
    } else if (process.env.NODE_ENV === 'dev') {
        return devHost;
    }
    return defaultHost;
};

const host = _host();

export default host;
