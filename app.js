const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1); 

const fetchPokemonData = (nombrePokemon) => {
    const data = fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            return response.json();
        });

    return data
}

const apiSearch = (nombrePokemon) => {
    fetchPokemonData(nombrePokemon)
        .then(displayPokemonData)
        .catch(error => {
            console.error('Error al obtener el Pokémon:', error.message);
        })
}

const updateDOM = (data, dataPokemonName, dataPokemonHeight, dataPokemonWeight, dataPokemonTipos) => {
    const pokemonSection = document.getElementById('pokemonSection');
    pokemonSection.style.display = 'flex';

    const img = document.getElementById('pokemonImg');
    img.src = data.sprites.front_default;
    img.alt = `Imagen de ${data.name}`;

    const pokemonName = document.getElementById('pokemonName');
    pokemonName.textContent = dataPokemonName;

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

    console.log('Nombre:', dataPokemonName);
    console.log('Altura:', dataPokemonHeight);
    console.log('Peso:', dataPokemonWeight);
    console.log('Tipos:', dataPokemonTipos);

    updateDOM(data, dataPokemonName, dataPokemonHeight, dataPokemonWeight, dataPokemonTipos);

}

const inputHandler = () => {
    const input = document.getElementById('placeholder__input')

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            const nombrePokemon = input.value.trim().toLowerCase();
            if (nombrePokemon) {
                apiSearch(nombrePokemon);
                input.value = '';
            }
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    inputHandler();
});