async function logout() {
    localStorage.removeItem('user');
    localStorage.clear();
    window.location.href = '/logout.php';
}