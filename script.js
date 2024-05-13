let pokemon = ['bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon'];
let currentPokemon;
let cardID;
let pokemonName;
let pokemonImage;
let pokemonType;
let pokemonSpecies;
let pokemonHeight;
let pokemonWeight;
let pokemonAbility;



async function init() {
    await loadPokemon();
}

async function loadPokemon() {
    for (let i = 0; i < pokemon.length; i++) {
        cardID = pokemon[i];
        let url = `https://pokeapi.co/api/v2/pokemon/${cardID}`;
        let response = await fetch(url);

        currentPokemon = await response.json();
        pokemonName = currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1);
        pokemonImage = currentPokemon['sprites']['other']['official-artwork']['front_default'];
        pokemonSpecies = currentPokemon['species']['name'].charAt(0).toUpperCase() + currentPokemon['species']['name'].slice(1);
        pokemonHeight = currentPokemon['height'];
        pokemonWeight = currentPokemon['weight'];

        renderCards();
    }
}


// -------- KARTEN ANZEIGEN -------- //

function renderCards() {
    // document.getElementById('container').innerHTML = '';
    document.getElementById('container').innerHTML += /*html*/`
    <div class="card-small" id="card_small_${cardID}" onclick="openBigCard('${cardID}', '${pokemonName}', '${pokemonImage}', '${pokemonSpecies}', '${pokemonHeight}', '${pokemonWeight}', '${pokemonAbility}')">
    <h1>${pokemonName}</h1>
    <div class="image"><img src="${pokemonImage}" alt=""></div>
    <div class="properties-overview" id="properties-overview${cardID}">
    </div>
</div>
<div id="bigCardContainer"></div>`
    renderTypes();
    console.log(cardID);
    console.log(currentPokemon);
}


// -------- GROSSE KARTE ANZEIGEN -------- //

function openBigCard(bigCardID, pokemonName, pokemonImage, pokemonSpecies, pokemonHeight, pokemonWeight) {
    console.log(bigCardID);
    console.log(pokemonName);

    document.getElementById('bigCardContainer').innerHTML = '';
    document.getElementById('bigCardContainer').innerHTML += /*html*/`
    <div class="dialog-bg" id="dialog(${bigCardID})">
    <img id="close-icon" src="./img/x-lg-white.svg" onclick="closeBigCard()">
    <div class="card-big">
        <h1>${pokemonName}</h1>
        <div class="image"><img src="${pokemonImage}" alt=""></div>
        <div class="properties-overview">
        <div class="property">X</div>
        <div class="property">Y</div>
        </div>
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

                <div class="property-details" id="base-stats">
<div>
    <canvas id="base-stats-charts"></canvas>
    </div>
 </div>
</div>
</div>
<div id="chevrons">
    <img id="chev-left" src="img/chevron-left-white.svg" onclick="previousCard()">
    <img id="chev-right" src="img/chevron-right-white.svg" onclick="nextCard()">
    </div>
</div>`
    showChart();
    renderAbilities();
}


// -------- TYPEN ANZEIGEN -------- //

function renderTypes() {
    for (let j = 0; j < currentPokemon['types'].length; j++) {
        pokemonType = currentPokemon['types'][j]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][j]['type']['name'].slice(1);
        document.getElementById(`properties-overview${cardID}`).innerHTML += /*html*/`
    <div class="property">${pokemonType}</div>`;
    }
}


// -------- FÄHIGKEITEN ANZEIGEN -------- //

function renderAbilities() {
    for (let k = 0; k < currentPokemon['abilities'].length; k++) {
        pokemonAbility = currentPokemon['abilities'][k]['ability']['name'];
        document.getElementById(`abilities${cardID}`).innerHTML += /*html*/`
    <div class="ability">${pokemonAbility} </div>`
    }
}



// -------- GROSSE KARTE SCHLIESSEN -------- //

function closeBigCard() {
    document.getElementById('bigCardContainer').innerHTML = '';
}


// -------- NÄCHSTE KARTE -------- //

function nextCard(i) {
    let nextCard = i + 1;

    if (i < images.length - 1) {
        openBigCard(nextCard);
    } else {
        closeBigCard(i);
    }
}


// -------- VORHERIGE KARTE -------- //

function previousCard(i) {
    let nextCard = i - 1;

    if (i > 0) {
        openBigCard(nextCard);
    } else {
        closeBigCard(i);
    }
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

function showChart() {
    const ctx = document.getElementById('base-stats-charts');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['HP', 'Attack', 'Defense', 'Sp. Atk.', 'Sp. Def.', 'Speed', 'Total'],
            datasets: [{
                label: '',
                data: [45, 49, 49, 65, 65, 45, 318],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(139, 69, 19, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(139, 69, 19, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}






// -------- BEISPELCODE-------- //


// BEISPIEL CHART loadCHart wird innerhalb der Funktion openBIgCard aufgerufen
// function loadChart(i) {
//     let hp = pokemonStatsArray[i]['0']['base_stat'];
//     let attack = pokemonStatsArray[i]['1']['base_stat'];
//     let defense = pokemonStatsArray[i]['2']['base_stat'];
//     let spAtk = pokemonStatsArray[i]['3']['base_stat'];
//     let spDef = pokemonStatsArray[i]['4']['base_stat'];
//     let speed = pokemonStatsArray[i]['5']['base_stat'];
//     const ctx = document.getElementById('myChart').getContext('2d');
//     const myChart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'],
//             datasets: [{
//                 data: [hp, attack, defense, spAtk, spDef, speed],
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.2)',
//                     'rgba(54, 162, 235, 0.2)',
//                     'rgba(255, 206, 86, 0.2)',
//                     'rgba(75, 192, 192, 0.2)',
//                     'rgba(153, 102, 255, 0.2)',
//                     'rgba(255, 159, 64, 0.2)'
//                 ],
//                 borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)',
//                     'rgba(255, 159, 64, 1)'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             indexAxis: 'y',
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 },
//                 x: {
//                     display: false,
//                     beginAtZero: true,
//                     max: 250
//                 }
//             },
//             plugins: {
//                 title: {
//                     display: true,
//                     text: 'Base Stats'
//                 },
//                 legend: {
//                     display: false,
//                 },
//                 datalabels: {
//                     display: true,
//                 },
//             }
//         }
//     });
// }