window.addEventListener('load', () => {
    const user = localStorage.getItem('user');
    visualizza_prodotto();
    if (!user) {
        window.location.href = '../Login/login.html?error=' + encodeURIComponent('Devi effettuare il login per accedere a questa pagina.');
    }
});


async function aggiungi_al_carrello(id_prodotto,quantita) {

    const utente = localStorage.getItem('user'); 
    const obj=JSON.parse(utente);
    const id_utente = obj.id;
    const nome_utente = obj.utente;


try {

    const response = await fetch('../api/add_to_cart.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_prodotto: id_prodotto,
            id_utente: id_utente,
            quantita: quantita
        })
    });
    const data = await response.json();
    if (response.ok) {
        console.log("Prodotto aggiunto al carrello:", data);
        mostra_messaggio('success',"Prodotto aggiunto al carrello!", 1000);
    } else {
        console.error("Errore nell'aggiunta al carrello:", data);
        mostra_messaggio('error','Errore nell\'aggiunta al carrello: ' + data.message, 1000);
    }
    }
    catch (error) {
        console.error("Errore carrello:", error);
        mostra_messaggio('error','Errore di rete o del server durante l\'aggiunta al carrello.', 1000);
    }
}


async function visualizza_prodotto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Controllo di sicurezza: se non c'è l'ID, non procedere
    if (!productId) return;

    try {
        const response = await fetch('../api/get_product.php?id=' + encodeURIComponent(productId));
        const product = await response.json();

        document.getElementById('product-details').innerText = product.nome;
        document.getElementById('product-description').innerText = product.descrizione;
        document.getElementById('prezzo').innerText = '€' + product.prezzo;
        const imgUrl = `https://placehold.co/400x400?text=${encodeURIComponent(product.nome)}`;
        
        document.getElementById('product-img').innerHTML = `
            <img src="${imgUrl}" alt="${product.nome}" style="max-width: 100%;height: auto; border-radius: 8px;">`;

    } catch (error) {
        console.error("Errore nel caricamento del prodotto:", error);
        mostra_messaggio('error','Errore nel caricamento del prodotto.', 1000);
    }
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