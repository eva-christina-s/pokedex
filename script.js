let pokemon = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let allPokemon = [];
let displayedPokemon = [];
let startIndex = 0;
let endIndex = 4; // Anzahl der initial zu ladenden Pokémon
let loadMoreExecuted = false;


async function init() {
    await loadPokemon(startIndex, endIndex);
}


// -------- HILFSFUNKTION ERSTER BUCHSTABE CAPITALIZE -------- //

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


// -------- DATEN LADEN -------- //

async function loadPokemon(start, end) {
    for (let i = start; i <= end && i < pokemon.length; i++) {
        let cardID = pokemon[i];
        let url = `https://pokeapi.co/api/v2/pokemon/${cardID}`;
        let response = await fetch(url);

        let currentPokemon = await response.json();
        allPokemon.push(currentPokemon);
        displayedPokemon.push(currentPokemon);
        let pokemonName = capitalize(currentPokemon['name']);
        let pokemonImage = currentPokemon['sprites']['other']['official-artwork']['front_default'];
        let pokemonSpecies = capitalize(currentPokemon['species']['name']);
        let pokemonHeight = currentPokemon['height'];
        let pokemonWeight = currentPokemon['weight'];

        renderCards(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight);
    }
}


// -------- KARTEN ANZEIGEN -------- //

function renderCards(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight) {
    const pokemonTypes = allPokemon[i]['types'];
    const mainType = pokemonTypes[0]['type']['name'];

    document.getElementById('container').innerHTML += /*html*/`
    <div class="card-small ${mainType}" id="card_small_${cardID}" onclick="openBigCard(${cardID}, ${i}, '${pokemonName}', '${pokemonImage}', '${pokemonSpecies}', '${pokemonHeight}', '${pokemonWeight}')">
    <h1>${pokemonName}</h1>
    <div class="image"><img src="${pokemonImage}" alt=""></div>
    <div class="properties-overview" id="properties-overview-${cardID}">
    </div>
</div>`;
    renderTypes(cardID, i);
    if (!loadMoreExecuted) {
        document.getElementById('button-div').style.display = "flex";
    }
}


// -------- WEITERE KARTEN ANZEIGEN -------- //

async function loadMore() {
    startIndex = endIndex + 1;
    endIndex += 5; // Anzahl der zusätzlich zu ladenden Karten
    await loadPokemon(startIndex, endIndex);
    loadMoreExecuted = true;
    document.getElementById('button-div').style.display = "none";

}


// -------- KARTEN FILTERN -------- //

// Event Listener für Suchleiste
document.getElementById('search-bar').addEventListener('input', filterPokemon);

function filterPokemon() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredPokemon = displayedPokemon.filter(function (pokemon) {
        return pokemon.name.toLowerCase().includes(searchTerm);
    });

    document.getElementById('container').innerHTML = ''; // aktuellen Karten löschen

    filteredPokemon.forEach(function (pokemon, i) { // gefilterten Karten neu rendern
        let cardID = pokemon.id;
        let pokemonName = capitalize(pokemon.name);
        let pokemonImage = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonSpecies = capitalize(pokemon.species.name);
        let pokemonHeight = pokemon.height;
        let pokemonWeight = pokemon.weight;

        renderCards(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight);
    });

    if (searchTerm.trim() === '') {
        if (!loadMoreExecuted) {
            document.getElementById('button-div').style.display = "flex";
        }
    } else {
        document.getElementById('button-div').style.display = "none";
    }
}


// -------- GROSSE KARTE ANZEIGEN -------- //

function openBigCard(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight) {
    document.getElementById('bigCardContainer').innerHTML = '';
    document.getElementById('bigCardContainer').innerHTML += returnHTMLBigCard(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight);

    renderTypesBigCard(cardID, i);
    renderAbilities(cardID, i);
    showChart(cardID);
}


// -------- GROSSE KARTE HTML -------- //

function returnHTMLBigCard(cardID, i, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight) {
    const pokemonTypes = allPokemon[i]['types'];
    const mainType = pokemonTypes[0]['type']['name'];

    return /*html*/`
    <div class="dialog-bg" id="dialog_${cardID}">
    <img id="close-icon" src="./img/x-lg-white.svg" onclick="closeBigCard('${cardID}')">
    <div class="card-big ${mainType}">
        <h1>${pokemonName}</h1>
        <div class="image"><img src="${pokemonImage}" alt=""></div>
        <div class="properties-overview" id="properties-overview-bc-${cardID}"></div>
        <div class="details">
            <div class="card-menu">
                <div class="menu-item" id="menu-about" onclick="openTabAbout()">About</div>
                <div class="menu-item" id="menu-stats" onclick="openTabStats()">Base Stats</div>
                </div>
                <div class="property-details" id="about">
                <div><b>Species: </b>${pokemonSpecies}</div>
                <div><b>Height: </b>${pokemonHeight}</div>
                <div><b>Weight: </b>${pokemonWeight}</div>
                <div class="abilities" id="abilities${cardID}"><div><b>Abilities: </b></div></div>
                </div>
                <div class="property-details" id="base-stats"><div>
    <canvas id="base-stats-charts"></canvas>
    </div>
 </div>
</div>
</div>
<div id="chevrons">
    <img id="chev-left" src="img/chevron-left-white.svg" onclick="previousCard(${cardID})">
    <img id="chev-right" src="img/chevron-right-white.svg" onclick="nextCard(${cardID})">
    </div>
</div>`;
}


// -------- TYPEN ANZEIGEN -------- //

function renderTypes(cardID, i) {
    for (let j = 0; j < allPokemon[i]['types'].length; j++) {
        let pokemonType = capitalize(allPokemon[i]['types'][j]['type']['name']);
        document.getElementById(`properties-overview-${cardID}`).innerHTML += /*html*/`
    <div class="property">${pokemonType}</div>`;
    }
}


function renderTypesBigCard(cardID, i) {
    for (let j = 0; j < allPokemon[i]['types'].length; j++) {
        let pokemonType = capitalize(allPokemon[i]['types'][j]['type']['name']);
        document.getElementById(`properties-overview-bc-${cardID}`).innerHTML += /*html*/`
        <div class="property">${pokemonType}</div>`;
    }
}


// -------- FÄHIGKEITEN ANZEIGEN -------- //

function renderAbilities(cardID, i) {
    for (let k = 0; k < allPokemon[i]['abilities'].length; k++) {
        let pokemonAbility = allPokemon[i]['abilities'][k]['ability']['name'];
        document.getElementById(`abilities${cardID}`).innerHTML += /*html*/`
    <div class="ability">${pokemonAbility}</div>`
    }
}


// -------- GROSSE KARTE SCHLIESSEN -------- //

function closeBigCard() {
    document.getElementById('bigCardContainer').innerHTML = '';
}


// -------- TABS GROSSE KARTE -------- //

function openTabAbout() {
    document.getElementById('about').style.display = "block";
    document.getElementById('base-stats').style.display = "none";
    document.getElementById('menu-about').style.color = "#000";
    document.getElementById('menu-stats').style.color = "#565656";
}

function openTabStats() {
    document.getElementById('base-stats').style.display = "block";
    document.getElementById('about').style.display = "none";
    document.getElementById('menu-stats').style.color = "#000";
    document.getElementById('menu-about').style.color = "#565656";
}


// -------- CHARTS GROSSE KARTE -------- //

async function showChart(cardID) {
    const ctx = document.getElementById('base-stats-charts');

    // Pokemon im allPokemon Array finden
    let currentPokemon;
    for (let i = 0; i < allPokemon.length; i++) {
        if (allPokemon[i].id === cardID) {
            currentPokemon = allPokemon[i];
            break;
        }
    }

    // Base-Stats-Daten aktuelle Karte
    let baseStats = [];
    let labels = [];
    for (let i = 0; i < currentPokemon.stats.length; i++) {
        baseStats.push(currentPokemon.stats[i].base_stat);
        labels.push(capitalize(currentPokemon.stats[i].stat.name)); // Labels aus dem stat.name Feld extrahieren
    }

    // Sicherstellen, dass der Chart Canvas leer ist, bevor ein neuer Chart erstellt wird
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    // Neue Chart.js-Instanz erstellen
    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // Dynamisch generierte Labels verwenden
            datasets: [{
                label: '',
                data: baseStats,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        autoSkip: false, // Deaktivieren von autoSkip, um alle Labels anzuzeigen
                    }
                }
            }
        }
    });
}


// -------- KARTEN DURCHBLÄTTERN -------- //

function previousCard(cardID) {
    let currentIndex = allPokemon.findIndex(pokemon => pokemon.id === cardID);
    let newIndex = currentIndex - 1;

    if (newIndex >= 0) {
        let prevPokemon = allPokemon[newIndex];
        let prevCardID = pokemon[newIndex];

        openBigCard(
            prevCardID,
            newIndex,
            capitalize(prevPokemon.name),
            prevPokemon.sprites.other['official-artwork'].front_default,
            capitalize(prevPokemon.species.name),
            prevPokemon.height,
            prevPokemon.weight
        );
    } else {
        closeBigCard(cardID);
    }
}


function nextCard(cardID) {
    let currentIndex = allPokemon.findIndex(pokemon => pokemon.id === cardID);
    let newIndex = currentIndex + 1;

    if (newIndex < allPokemon.length) {
        let nextPokemon = allPokemon[newIndex];
        let nextCardID = pokemon[newIndex];

        openBigCard(
            nextCardID,
            newIndex,
            capitalize(nextPokemon.name),
            nextPokemon.sprites.other['official-artwork'].front_default,
            capitalize(nextPokemon.species.name),
            nextPokemon.height,
            nextPokemon.weight
        );
    } else {
        closeBigCard(cardID);
    }
}