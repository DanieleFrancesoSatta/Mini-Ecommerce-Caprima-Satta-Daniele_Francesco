async function logout() {
    localStorage.removeItem('user');
    window.location.href = '../Login/login.html';
}