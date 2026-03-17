const loginPage= 'login.html'
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = atob(base64Url);
    return JSON.parse(base64);
}

const initUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
        const payload = parseJwt(token);
        const expiresAt = payload.exp * 1000;

        if (Date.now() > expiresAt) {
            console.log("to login");
            window.location.replace(loginPage)
        } else {
            const res = await fetch(`http://44.222.255.219:3000/api/v1/users/${payload.userId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // <-- Bearer token here
                }
            })
            const user = await res.json();
            document.getElementById("username").innerText = `${user.firstname}.${user.lastname.split('')[0]}`;
        }
    } else {
        window.location.replace(loginPage)
    }
}
initUser();

const logoutBtn = document.getElementById('logout-btn');
const modal = document.querySelector(".modal-overlay");

function openModal() {
    modal.classList.remove("hide");
}

function closeModal(e, clickedOutside) {
    if (clickedOutside) {
        if (e.target.classList.contains("modal-overlay"))
            modal.classList.add("hide");
    } else modal.classList.add("hide");
}


const logoutConfirmBtn = document.getElementById('logout-confirm');
const logoutCancelBtn = document.getElementById('logout-cancel');

modal.addEventListener("click", (e) => closeModal(e, true));
logoutBtn.addEventListener("click", openModal);
logoutCancelBtn.addEventListener('click', closeModal)
logoutConfirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.replace(loginPage)
});
