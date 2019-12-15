import React, {Component} from 'react';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemons: [],
            page: 1,
            perPage: 5,
            filter: ''
        }
    }

    componentDidMount = async () => {
        let list = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=50`).then(resp => {
            if (resp.ok) return resp.json()
            else {
                throw new Error(`${resp.status}: ${resp.statusText}`)
            }
        })
        let sortedList = this.sortByName(list.results)
        let pokemons = sortedList.map(pokemon => {
            let id = pokemon.url.slice(0, -1).split('/').pop()
            return {
                id: Number(id),
                name: pokemon.name,
                src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
            }
        })
        await this.setState({
            pokemons
        })
    }

    sortByName = (list) => {
        return list.sort(function (a, b) {
            return a.name === b.name ? 0 : a.name < b.name ? -1 : 1
        })
    }

    changePage = (event) => {
        this.setState({
            page: Number(event.target.id)
        });
    }

    render() {
        const {pokemons, page, perPage} = this.state
        const indexOfLastPokemon = page * perPage;
        const indexOfFirstPokemon = indexOfLastPokemon - perPage;
        const pokemonsPerPage = pokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(pokemons.length / perPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            const {page} = this.state
            return (
                <button
                    key={number}
                    id={number}
                    style={{background: number === page ? 'lightblue' : '', margin: "2px"}}
                    onClick={this.changePage}
                >
                    {number}
                </button>
            );
        });
        return <div>
            {pokemonsPerPage.map(pokemon => {
                return <div key={pokemon.id} style={{display: 'flex', alignItems: "center"}}>
                    <img src={pokemon.src} alt={`Photo of ${pokemon.name}`}/>
                    <p>{pokemon.name}</p>
                </div>
            })}
            <div style={{display: 'flex'}}>
                {renderPageNumbers}
            </div>
        </div>
    }
}

