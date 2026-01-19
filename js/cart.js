async function checkout() {
    try {
        
        const user_data_string = localStorage.getItem('user');
        
        if (!user_data_string) {
            mostra_messaggio('error', 'Effettua il login per procedere', 1000);
            return;
        }


        const user_data = JSON.parse(user_data_string);
        const id_utente = user_data.id; 

        const response = await fetch('../api/checkout.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id_utente: id_utente})
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostra_messaggio('success', data.success, 250);
            visualizza_carrello(); 
        } else {
            mostra_messaggio('error', data.error || 'Errore durante l\'ordine', 1000);
        }
    } catch (error) {
        console.error("Errore durante il checkout:", error);
        mostra_messaggio('error', 'Errore di connessione al server', 1000);
    }
}

window.addEventListener('load', () => {
    //Qaundo viene caricata la pagina vien:
    visualizza_carrello();

    const successErrorBox = document.getElementById('success-error-box');
    successErrorBox.classList.add('hidden');
    const user = localStorage.getItem('user');
    //Se non c'è nessun utente loggato:
    if (!user) {
        window.location.href = '../Login/login.html?error=' + encodeURIComponent('Devi effettuare il login per accedere a questa pagina.');
    }
    
});

async function visualizza_carrello() {

    const utente = localStorage.getItem('user'); 
    const obj=JSON.parse(utente);
    const id_utente = obj.id;
    const nome_utente = obj.utente;
    
    try {
        //Effettuo la richiesta
        const response = await fetch('../api/get_cart.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({id: id_utente})
        });

        const products = await response.json(); //Converto in json
        console.log("Prodotti nel carrello:", products);

        const total_cart_info=document.getElementById('total-cart');
        const pagination = document.getElementById('pagination');
        const checkout_button = document.getElementById('checkout-button');

        if (products.items.length === 0) { //Se non ci son prodotti nel carrello nascondo:
            document.getElementById('products-grid').classList.add('hidden');
            total_cart_info.classList.add('hidden');
            document.getElementById('empty-cart-message-box').innerHTML = '<p class="empty-cart">Il carrello è vuoto.</p>';
            pagination.classList.add('hidden');
            checkout_button.classList.add('hidden');
            return;
        }

        const total_cart=products.total;
        console.log("Totale carrello:", total_cart);
        
        total_cart_info.innerText="Totale carrello: €"+Number(total_cart).toFixed(2);
        mostraProdottiCarrello(products.items, 1);
    } catch (error) {
        console.error("Errore nel caricamento dei prodotti:", error);
        document.getElementById('products-grid').innerHTML = '<p>Errore nel caricamento dei prodotti.</p>';
    }
       
}

function mostraProdottiCarrello(products, pagina) {

    const prodottiPerPagina = 7;
    const totalePagine = Math.ceil(products.length / prodottiPerPagina);

    const inizio = (pagina - 1) * prodottiPerPagina;
    const fine = inizio + prodottiPerPagina;
    const prodottiPagina = products.slice(inizio, fine);//Estraggo i prodotti dall'indice inizio a indice fine

    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    prodottiPagina.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `<a href="../Product/product.html?id=${product.id_prodotto}"> 
            <div class="product-image">
                <img src="https://placehold.co/200x200?text=${encodeURIComponent(product.nome)}" alt="${product.nome}">
            </div>
            </a>
            <div class="product-info">
                <h3>${product.nome}</h3>
                <p class="product-price">${product.prezzo}€/unità</p>
                <p class="product-quantity">Quantità: ${product.quantita}</p>
                <p class="increment-decrement">
                    <button onclick="modifica_quantita(${product.id_prodotto}, ${product.quantita - 1})">➖</button>
                    <button onclick="modifica_quantita(${product.id_prodotto}, ${product.quantita + 1})">➕</button>
                    <button onclick="modifica_quantita(${product.id_prodotto}, 0)">🗑️</button>
                </p>
                <p class="product-total">Totale: €${Number(product.totale_prodotto).toFixed(2)}</p>
            </div>
        
        `;
        
        grid.appendChild(productCard);
    });


    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';
    //pulsanti per muoversi nella paginazione
    for (let i = 1; i <= totalePagine; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn' + (i === pagina ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => mostraProdottiCarrello(products, i);
        paginationDiv.appendChild(btn);
    }
}


async function modifica_quantita(id_prodotto, nuova_quantita) {
    
    const utente = localStorage.getItem('user'); 
    const obj=JSON.parse(utente);
    const id_utente = obj.id;
    

    const response = await fetch('../api/modifica_quantita.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_prodotto: id_prodotto,
            id_utente: id_utente,
            nuova_quantita: nuova_quantita
        })
    });
    const data = await response.json();
    if (response.ok) {
        console.log("Quantità modificata:", data);
        
        visualizza_carrello();
        mostra_messaggio('success','Quantità modificata con successo!', 1000);
    } else {
        visualizza_carrello();
        console.error("Errore nella modifica della quantità:", data);
        mostra_messaggio('error','Errore nella modifica della quantità: ' + data.message, 1000);
        
    }
}


async function mostra_messaggio(tipo,messaggio, millisecondi) {
    const successErrorBox = document.getElementById('success-error-box');
    successErrorBox.innerHTML = `<p style='font-weight:bold'>${messaggio}</p>`;
    successErrorBox.classList.remove('success-color');
    successErrorBox.classList.remove('error-color');
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