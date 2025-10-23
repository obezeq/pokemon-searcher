'use strict'

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

var pokemons;

const fetchData = async (endpoint, customError = '') => {
    
    try {

        const response = await fetch(endpoint)
        if (!response.ok) {
            if (customError)  {
                throw new Error('No se ha podido encontrar la lista de pokemons');   
            } else {
                throw new Error('ERROR al hacer obtener los resultados de ' + endpoint)
            }
        }

        const responseJson = await response.json();
        return responseJson;

    } catch (error) {
        return error;
    }
}

const fetchPokemons = async () => {
    const data = await fetchData('https://pokeapi.co/api/v2/pokemon/?limit=100000');
    const results = data["results"];
    return results;
}

const fetchPokemonData = async (pokemonId) => {
    const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    return data;
}

const getPokemonsData = async () => {
    const results = await fetchPokemons();

    const pokemonsFull = await Promise.all(results.map(async pokemon => {
        const pokemonName = (pokemon.name).replaceAll('-', ' ');
        const pokemonId = (pokemon.url).split('/v2/pokemon/')[1].split('/')[0];
        const pokemonData = await fetchPokemonData(pokemonId);
        return { 'name': pokemonName, 'data': pokemonData };
    }));
    
    pokemons = pokemonsFull;
}

const apiSearch = (nombrePokemon) => {
    fetchPokemonData(nombrePokemon)
        .then(displayPokemonData)
        .catch(error => {
            console.error('Error al obtener el Pokémon:', error.message);
    });
}

const updateDOM = (data, dataPokemonName, dataPokemonHeight, dataPokemonWeight, dataPokemonTipos) => {
    const pokemonSection = document.getElementById('pokemonSection');
    pokemonSection.style.display = 'flex';

    const img = document.getElementById('pokemonImg');
    const frontDefaultSprite = data.sprites.front_default;
    if (frontDefaultSprite) {
        img.src = frontDefaultSprite;
        img.alt = `Imagen de ${data.name}`;
    }

    const pokemonName = document.getElementById('pokemonName');
    pokemonName.textContent = dataPokemonName.replaceAll("-", " ");

    const pokemonAltura = document.getElementById('pokemonAltura');
    pokemonAltura.textContent = `Altura: ${dataPokemonHeight}`;

    const pokemonPeso = document.getElementById('pokemonPeso');
    pokemonPeso.textContent = `Peso: ${dataPokemonWeight}`;

    const pokemonTipos = document.getElementById('pokemonTipos');
    pokemonTipos.textContent = `Tipos: ${dataPokemonTipos}`
}

const displayPokemonData = (data) => {
    const dataPokemonName = capitalizeFirstLetter(data.name);
    const dataPokemonHeight = data.height;
    const dataPokemonWeight = data.weight;
    const dataPokemonTipos = data.types.map(tipoInfo => tipoInfo.type.name).join(', ');

    console.log('- Nombre:', dataPokemonName);
    console.log('- Altura:', dataPokemonHeight);
    console.log('- Peso:', dataPokemonWeight);
    console.log('- Tipos:', dataPokemonTipos);

    updateDOM(data, dataPokemonName, dataPokemonHeight, dataPokemonWeight, dataPokemonTipos);

}

const searchMatches = (pokemonSearch) => {
    const matches = pokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(pokemonSearch.toLowerCase())
    );

    return matches;
}

const inputHandler = async () => {
    const input = document.getElementById('placeholder__input')

    input.addEventListener('keyup', (event) => {
        event.preventDefault();

        const pokemonSearch = input.value.trim().toLowerCase();
        const matches = searchMatches(pokemonSearch);
        
        matches.forEach(pokemon => {
            displayPokemonData(pokemon["data"])
        });
    });

}

document.addEventListener('DOMContentLoaded', async() => {
    await getPokemonsData();
    await inputHandler();
});