async function logout() {
    localStorage.clear();
    window.location.href = '/api/logout.php';
}