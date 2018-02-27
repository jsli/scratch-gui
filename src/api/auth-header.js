const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        if (user.expires_at && (user.expires_at > new Date())) {
            const auth = new Buffer(user.token).toString('base64');
            return auth;
        }
    }

    return '';
};

export default authHeader;
