let login = sessionStorage.getItem('login')
if (!login) {
    window.location.href = '403.php'
}
