async function overlay_form(event){
    event.preventDefault();
    
    const login_button = document.getElementById('login-button');
    login_button.classList.add('hidden');
    
    const overlay = document.getElementById('overlay-form');
    overlay.classList.remove('hidden');
    
    const logout_message = document.getElementById('logout-message');
    logout_message.classList.add('hidden');
}


async function handleLogin(event) {
    event.preventDefault();
    const utente = document.getElementById('login-utente').value;
    const password = document.getElementById('login-password').value;
    
    
    const errorMsg = document.getElementById('error-message');

    errorMsg.classList.add('hidden');
    errorMsg.innerText = "";

    try {

        const response = await fetch('../api/ceck_login.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({utente: utente, password: password })
        });

        console.log("Response status:", response.status);
        
        const responseText = await response.text();
        console.log("Response text:", responseText);
        
        if (!responseText) {
            console.error("Empty response from server");
            errorMsg.innerText = "Errore: Il server non ha risposto. Riprova.";
            errorMsg.classList.remove('hidden');
            return;
        }
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("JSON parse error:", e);
            console.error("Invalid response:", responseText);
            errorMsg.innerText = "Errore del server. Contatta l'amministratore.";
            errorMsg.classList.remove('hidden');
            return;
        }

        
        if (response.ok) {
            console.log("Login riuscito:", data);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '../Home/home.html';

        } else {
            
            errorMsg.innerText = data.message || "Credenziali non valide.";
            errorMsg.classList.remove('hidden');
        }

    } catch (error) {
        
        console.error("Errore Fetch:", error);
        errorMsg.innerText = error;
        errorMsg.classList.remove('hidden');
    }
}