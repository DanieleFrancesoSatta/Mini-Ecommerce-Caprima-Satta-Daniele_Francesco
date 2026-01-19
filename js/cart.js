async function checkout() {

    mostra_messaggio('error','Funzionalità di checkout non ancora implementata.', 1000);
}

window.addEventListener('load', () => {
    visualizza_carrello();
    const successErrorBox = document.getElementById('success-error-box');
    successErrorBox.classList.add('hidden');
    
});

async function visualizza_carrello() {

    const utente = localStorage.getItem('user'); 
    const obj=JSON.parse(utente);
    const id_utente = obj.id;
    const nome_utente = obj.utente;
    
    try {
        const response = await fetch('../api/get_cart.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({id: id_utente})
        });
        const products = await response.json();
        console.log("Prodotti nel carrello:", products);
        if (products.items.length === 0) {
            document.getElementById('products-grid').innerHTML = '<p>Il carrello è vuoto.</p>';
            return;
        }
        const total_cart=products.total;
        console.log("Totale carrello:", total_cart);
        const total_cart_info=document.getElementById('total-cart');
        total_cart_info.innerText="Totale carrello: €"+total_cart;
        mostraProdottiCarrello(products.items, 1);
    } catch (error) {
        console.error("Errore nel caricamento dei prodotti:", error);
        document.getElementById('products-grid').innerHTML = '<p>Errore nel caricamento dei prodotti.</p>';
    }
       
}

function mostraProdottiCarrello(products, pagina) {

    const prodottiPerPagina =7;
    const totalePagine = Math.ceil(products.length / prodottiPerPagina);
    const inizio = (pagina - 1) * prodottiPerPagina;
    const fine = inizio + prodottiPerPagina;
    const prodottiPagina = products.slice(inizio, fine);

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
                <p class="product-total">Totale: €${product.totale_prodotto}</p>
            </div>
        
        `;
        grid.appendChild(productCard);
    });

    
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';
    
    for (let i = 1; i <= totalePagine; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn' + (i === pagina ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => mostraProdottiCarrello(products, i);
        paginationDiv.appendChild(btn);
    }
}


async function modifica_quantita(id_prodotto, nuova_quantita) {
    visualizza_carrello();
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
        const success_box=document.getElementById('success-error-box');
        
        visualizza_carrello();
        mostra_messaggio('success','Quantità modificata con successo!', 2000);
    } else {
        console.error("Errore nella modifica della quantità:", data);
        mostra_messaggio('error','Errore nella modifica della quantità: ' + data.message, 2000);
        
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