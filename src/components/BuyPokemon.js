import React, { useState, useEffect } from 'react';
import getWeb3 from '../utils/web3';
import PokemonStoreABI from '../abis/PokemonStore.json';
import BN from 'bn.js'; // Importar BN desde bn.js
import './BuyPokemon.css';

const PokemonStoreAddress = '0x98C281a11a6C8151ca978d40be55Edb51756189d'; // Actualiza con la dirección correcta

const BuyPokemon = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [pokemonStore, setPokemonStore] = useState(null);
  const [pokemonId, setPokemonId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);
        console.log('Web3 instance:', web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          setErrorMessage('MetaMask no está conectado.');
          return;
        }
        setAccount(accounts[0]);
        console.log('Account:', accounts[0]);

        const storeInstance = new web3Instance.eth.Contract(
          PokemonStoreABI,
          PokemonStoreAddress
        );
        setPokemonStore(storeInstance);
        console.log('PokemonStore contract:', storeInstance);

        const totalPokemons = await storeInstance.methods.pokemonCount().call();
        console.log('Total Pokemons:', totalPokemons);

        const loadedPokemons = [];
        for (let i = 1; i <= totalPokemons; i++) {
          const pokemon = await storeInstance.methods.pokemons(i).call();
          loadedPokemons.push({ id: i, ...pokemon });
        }
        setPokemons(loadedPokemons);
        console.log('Loaded Pokemons:', loadedPokemons);
      } catch (error) {
        console.error('Error initializing web3 or contract:', error);
        setErrorMessage('Error inicializando web3 o contrato.');
      }
    };
    init();
  }, []);

  const handleBuyPokemon = async () => {
    if (pokemonStore) {
      try {
        const pokemon = await pokemonStore.methods.pokemons(pokemonId).call();
        const cost = new BN(pokemon.price).mul(new BN(quantity));
        console.log('Cost in BN:', cost.toString());

        await pokemonStore.methods.approve(PokemonStoreAddress, cost.toString()).send({ from: account });
        await pokemonStore.methods.buyPokemon(pokemonId, quantity).send({ from: account });
        alert('Pokemon comprado con éxito');
      } catch (error) {
        console.error('Error buying Pokemon:', error);
        alert('Error comprando el Pokemon');
      }
    } else {
      console.error('PokemonStore contract is not loaded.');
      setErrorMessage('PokemonStore contract is not loaded.');
    }
  };

  return (
    <div>
      <h2>Comprar Pokemon</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <select onChange={(e) => setPokemonId(e.target.value)}>
        <option value="">Selecciona un Pokemon</option>
        {pokemons.map((pokemon) => (
          <option key={pokemon.id} value={pokemon.id}>
            {pokemon.name} - {web3 ? web3.utils.fromWei(pokemon.price, 'ether') : ''} PKT (Stock: {pokemon.stock})
          </option>
        ))}
      </select>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Cantidad"
      />
      <button onClick={handleBuyPokemon}>Comprar</button>
    </div>
  );
};

export default BuyPokemon;
