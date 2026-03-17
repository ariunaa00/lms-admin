function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = atob(base64Url);
    return JSON.parse(base64);
}


const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (token) {
        const payload = parseJwt(token);
        const expiresAt = payload.exp * 1000;

        if (Date.now() > expiresAt) {
            window.location.replace('/login.html')
        } else {
            const res = await fetch(`http://44.222.255.219:3000/api/v1/users/${payload.userId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // <-- Bearer token here
                }
            })
            const user = await res.json();
            return user;
        }
    } else {
        window.location.replace('/login.html')
    }
}

export { checkAuth }