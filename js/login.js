async function load_user_data() {
    try {
        const response = await fetch('../api/get_user_data.php');
        
        if (!response.ok) {
            throw new Error("Errore nel recupero dei dati utente");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errore sessione:", error);
        return { logged_in: false };
    }
}


window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('success')) {
        const messaggio = urlParams.get('success');
        if (messaggio) {
            mostra_messaggio('success', messaggio, 1000);
        }
    } 
    else if (urlParams.has('error')) {
        const messaggio = urlParams.get('error');
        if (messaggio) {
            mostra_messaggio('error', messaggio, 1000);
        }
    }
});




async function overlay_form(event){
    event.preventDefault();
    
    const login_button = document.getElementById('login-button');
    login_button.classList.add('hidden');
    
    const register_button = document.getElementById('registrati-button');
    register_button.classList.add('hidden');

    const overlay = document.getElementById('overlay-form');
    overlay.classList.remove('hidden');

    const overlay_registrati = document.getElementById('overlay-form-registrati');
    overlay_registrati.classList.add('hidden');
}


async function handleLogin(event) {
    event.preventDefault();
    const utente = document.getElementById('login-utente').value;
    const password = document.getElementById('login-password').value;
    
    
    try {

        const response = await fetch('../api/check_login.php', {
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
            mostra_messaggio('error', 'Il server non ha risposto. Riprova.', 1000);
            return;
        }
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("JSON parse error:", e);
            console.error("Invalid response:", responseText);
            mostra_messaggio('error', data.error, 1000);
            return;
        }

        
        if (response.ok) {
            console.log("Login riuscito:", data);
            window.location.href = '../Home/home.html';

        } else {
            mostra_messaggio('error', data.error, 1000);
            
        }

    } catch (error) {
        
        console.error("Errore Fetch:", error);
        mostra_messaggio('error', error, 1000);
        
    }
}

async function handleRegistrati(event) {
    event.preventDefault();
    const utente = document.getElementById('registrati-utente').value;
    const password = document.getElementById('registrati-password').value;
    const passwordConfirm = document.getElementById('registrati-password-confirm').value;
    if (password !== passwordConfirm) {
        mostra_messaggio('error', 'Le password non corrispondono.', 1000);
        return;
    }
    try {

        const response = await fetch('../api/registra_utente.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({utente: utente, password: password })
        });

        console.log("Response status:", response.status);
        
        const responseText = await response.text();
        console.log("Response text:", responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            mostra_messaggio('error','Risposta non valida dal server. Riprova più tardi.',1000);
            return;
        }

        
        if (response.ok) {
            console.log("Registrazione avvenuta con successo:", data);
            
            window.location.href = '../Home/home.html?success=Registrazione avvenuta con successo';

        } else {
            console.log("Errore nella registrazione:", data.error);
            mostra_messaggio('error', data.error, 1000);
            
        }

    } catch (error) {
        
        console.error("Errore Fetch:", error);
        mostra_messaggio('error', error, 1000);
        
    }
}


async function registrati_view() {
    
    const login_button = document.getElementById('login-button');
    login_button.classList.add('hidden');
    
    const register_button = document.getElementById('registrati-button');
    register_button.classList.add('hidden');
    
    const login_form = document.getElementById('overlay-form');
    login_form.classList.add('hidden');

    const overlay = document.getElementById('overlay-form-registrati');
    overlay.classList.remove('hidden');
    
}


async function mostra_messaggio(tipo,messaggio, millisecondi) {
    const successErrorBox = document.getElementById('success-error-box');
    successErrorBox.innerHTML = `<p style='font-weight:bold'>${messaggio}</p>`;

    if(tipo === 'success'){
        successErrorBox.classList.add('success-color')
    }else{
        successErrorBox.classList.add('error-color')
    }

    successErrorBox.classList.remove('hidden');
    successErrorBox.style.display = 'block';
    successErrorBox.style.opacity = '1';
    setTimeout(() => {
       
        setTimeout(() => {
            successErrorBox.classList.add('hidden');
            successErrorBox.style.display = 'none';
        }, 500); 

    }, millisecondi);
}