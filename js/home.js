
window.addEventListener('load', () => {
    visualizza_prodotti("");
    const user = localStorage.getItem('user');
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
    
    if (user) {
        const userData = JSON.parse(user);
        const welcomeElement = document.getElementById('welcome');
        welcomeElement.textContent = `Benvenuto ${userData.utente}`;
    }else{
        window.location.href = '../Login/login.html?error=' + encodeURIComponent('Devi effettuare il login per accedere a questa pagina.');
    }
});




async function visualizza_prodotti(filter) {
    const categorieContainer = document.getElementById('lista-categorie');
    categorieContainer.style.display = 'none';
    const prezzoContainer = document.getElementById('filtri-prezzi');
    prezzoContainer.style.display = 'none';
    const ordinealfabeticoContainer = document.getElementById('filtri-ordine-alfabetico');
    ordinealfabeticoContainer.style.display = 'none';


    const priceContainer = document.getElementById('filtri-prezzi');
    if (window.getComputedStyle(priceContainer).display == 'block') {
        priceContainer.style.display = 'none';
    }
    const alphabeticOrderContainer = document.getElementById('filtri-ordine-alfabetico');
    if (window.getComputedStyle(alphabeticOrderContainer).display == 'block') {
        alphabeticOrderContainer.style.display = 'none';
    }

    let url = '../api/load_products.php';
    url += filter ? `?${filter}` : '';
    
    try {
        const response = await fetch(url);
        const products = await response.json();

        if (!products || products.length === 0) {
            document.getElementById('products-grid').innerHTML = '<p class="no-products">Nessun prodotto trovato.</p>';
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        mostraPaginaProdotti(products, 1);
    } catch (error) {
        console.error("Errore nel caricamento dei prodotti:", error);
        document.getElementById('products-grid').innerHTML = '<p>Errore nel caricamento dei prodotti.</p>';
    }
}

function mostraPaginaProdotti(products, pagina) {
    const prodottiPerPagina = 10;
    const totalePagine = Math.ceil(products.length / prodottiPerPagina);
    const inizio = (pagina - 1) * prodottiPerPagina;
    const fine = inizio + prodottiPerPagina;
    const prodottiPagina = products.slice(inizio, fine);

    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    prodottiPagina.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `<a href="../Product/product.html?id=${product.id}">
            <div class="product-image">
                <img src="https://placehold.co/200x200?text=${encodeURIComponent(product.nome)}" alt="${product.nome}">
            </div>
            </a>
            <div class="product-info">
                <h3>${product.nome}</h3>
                <p class="product-price">${product.prezzo}€</p>
                <button class="btn-aggiungi" onclick="aggiungi_al_carrello(${product.id})">Aggiungi</button>
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
        btn.onclick = () => mostraPaginaProdotti(products, i);
        paginationDiv.appendChild(btn);
    }
}

async function visualizza_categorie() {
    const categoryContainer = document.getElementById('lista-categorie');

    
    const prezzoContainer = document.getElementById('filtri-prezzi');
    prezzoContainer.style.display = 'none';
    const ordinealfabeticoContainer = document.getElementById('filtri-ordine-alfabetico');
    ordinealfabeticoContainer.style.display = 'none';

    if (window.getComputedStyle(categoryContainer).display == 'block') {
        categoryContainer.style.display = 'none';
        return;
    }
    else {
        categoryContainer.style.display = 'block';

    }

    
    categoryContainer.innerHTML = '';
    const response = await fetch('../api/load_categories.php');
    const categories = await response.json();

    categories.forEach(category => {
        const categoryElement = document.createElement('button');
        categoryElement.className = 'category-button';
        categoryElement.innerText = category.categoria;
        console.log("Categoria:", category.categoria);
        
        categoryElement.onclick = () => {
            categoryContainer.style.display = 'none';
            visualizza_prodotti("filter=category=" + encodeURIComponent(category.categoria));
        };
        categoryContainer.appendChild(categoryElement);
    });
    //console.log("Categorie caricate:", categoryContainer);
}
async function visualizza_filtri_ordine_alfabetico() {

    const categorieContainer = document.getElementById('lista-categorie');
    categorieContainer.style.display = 'none';
    const prezzoContainer = document.getElementById('filtri-prezzi');
    prezzoContainer.style.display = 'none';


    const filtriOrdineAlfabetico = document.getElementById('filtri-ordine-alfabetico');
    if (window.getComputedStyle(filtriOrdineAlfabetico).display == 'block') {
        filtriOrdineAlfabetico.style.display = 'none';
        return;
    }
    else {
        filtriOrdineAlfabetico.style.display = 'block';
    }
}

async function visualizza_filtri_prezzo() {
    const categorieContainer = document.getElementById('lista-categorie');
    categorieContainer.style.display = 'none';

    const ordinealfabeticoContainer = document.getElementById('filtri-ordine-alfabetico');
    ordinealfabeticoContainer.style.display = 'none';
    

    const filtriPrezzi = document.getElementById('filtri-prezzi');
    if (window.getComputedStyle(filtriPrezzi).display == 'block') {
        filtriPrezzi.style.display = 'none';
        return;
    }
    else {
        filtriPrezzi.style.display = 'block';
    }
}

async function filtrapertesto(testo) {
    visualizza_prodotti("filter=text=" + encodeURIComponent(testo));
}



async function aggiungi_al_carrello(productId) {
    utente=JSON.parse(localStorage.getItem('user'));

    try {
        const response = await fetch('../api/add_to_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_prodotto: productId, id_utente: utente.id })
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Prodotto aggiunto al carrello:", data);
            mostra_messaggio('success',"Prodotto aggiunto al carrello!", 250);
            
        } else {
            console.error('Errore nell\'aggiunta al carrello: ' + data.error);
            mostra_messaggio('error','Errore nell\'aggiunta al carrello: ' + data.error, 250);
        }
    } catch (error) {
        console.error("Errore carrello:", error);
        mostra_messaggio('error','Errore di rete o del server durante l\'aggiunta al carrello.', 250);
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