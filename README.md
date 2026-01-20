# Mini E-Commerce Caprima

Un'applicazione web e-commerce completa, sviluppata con **PHP nativo**, **JavaScript (Vanilla)** e **MySQL**.

Il progetto include funzionalità essenziali come autenticazione utenti, gestione del carrello, filtraggio prodotti e checkout simulato.

## Funzionalità Principali

### Autenticazione Utente
* **Login e Registrazione:** Sistema sicuro con hashing delle password.
* **Gestione Sessione:** Utilizzo di `localStorage` lato client per mantenere la sessione attiva tra le pagine.
* **Logout:** Funzionalità di disconnessione.

### Navigazione e Prodotti
* **Catalogo Prodotti:** Visualizzazione a griglia con paginazione dinamica.
* **Filtri Avanzati:**
    * Ricerca testuale in tempo reale.
    * Filtro per Categoria.
    * Ordinamento per Prezzo (Crescente/Decrescente).
    * Ordinamento Alfabetico (A-Z, Z-A).
* **Dettaglio Prodotto:** Pagina dedicata con descrizione, prezzo, selezione quantità e aggiunta al carrello.

### Carrello e Checkout
* **Gestione Carrello:** Aggiunta prodotti, modifica quantità (incremento/decremento) e rimozione articoli.
* **Persistenza Dati:** Il carrello è salvato nel database, permettendo all'utente di ritrovare i prodotti anche cambiando dispositivo.
* **Checkout:** Simulazione del processo di acquisto con svuotamento del carrello.

## Stack Tecnologico

* **Frontend:** HTML5, CSS3 (Responsive), JavaScript (Fetch API).
* **Backend:** PHP (Nativo, senza framework).
* **Database:** MySQL hostato su Aiven.
* **Deployment:** deployato su Vercel

## Struttura del Database
Il database è strutturato in tre entità principali:
![ER database](img/ER%20Caprima.svg)

- **UTENTI**: Memorizza le credenziali di accesso (`ID_UTENTE`, `NOME`, `PASSWORD`).
- **PRODOTTI**: Catalogo degli articoli disponibili (`ID_PRODOTTO`, `NOME`, `PREZZO`, `DESCRIZIONE`, `CATEGORIA`).
- **CARRELLO**: Tabella di relazione che associa gli utenti ai prodotti scelti, indicandone la `QUANTITA`.

## Cosa aggiungerei con più tempo:
Se avessi avuto più tempo avrei:
- **migliorato il front-end**
- **aggiunto lo storico degli ordini**
- **cercato di rendere più fluida la navigazione**

## Come avviare il progetto
Per avviare il progetto basta cliccare sul seguente link : [E-commerce Caprima](https://mini-ecommerce-caprima-satta-daniel.vercel.app), una volta effettuato il login o l'eventualer registrazione è possibile accedere all'E-Commerce e quindi testare tutte le funzionalità elencate sopra.

##  Struttura del Progetto

```text
├── api/                    # Endpoint PHP per le chiamate AJAX
│   ├── add_to_cart.php     # Aggiunge prodotti al carrello
│   ├── check_login.php     # Verifica credenziali utente
│   ├── checkout.php        # Finalizza l'ordine
│   ├── get_cart.php        # Recupera il contenuto del carrello
│   ├── get_product.php     # Dettagli singolo prodotto
│   ├── load_products.php   # Carica e filtra i prodotti
│   └── ...
├── config/
│   └── connect_database.php # Connessione al DB con variabili d'ambiente
├── Cart/                   # Pagina e stili del carrello
├── Home/                   # Pagina principale e stili
├── Login/                  # Pagina di login/registrazione
├── Product/                # Pagina dettaglio prodotto
├── js/                     # Logica Frontend
│   ├── home.js             # Gestione filtri e griglia prodotti
│   ├── cart.js             # Logica del carrello
│   ├── login.js            # Gestione auth
│   └── ...
├── ca.pem                  # Certificato SSL per connessione DB sicuro
└── vercel.json             # Configurazione per il deploy
