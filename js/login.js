const token = localStorage.getItem("token");

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = atob(base64Url);
    return JSON.parse(base64);
}

const checkUser = () => {
    if (token) {
        const payload = parseJwt(token);
        const expiresAt = payload.exp * 1000;

        if (Date.now() < expiresAt) {
            window.location.replace('file:///C:/Users/Kaizen/Desktop/examination-system/examination-system-front/index.html')
        }
    }
}

checkUser();

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.replace("file:///C:/Users/Kaizen/Desktop/examination-system/examination-system-front/index.html");

    } else {
        alert(data.message);
    }

});
