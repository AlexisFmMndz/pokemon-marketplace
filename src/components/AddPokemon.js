import React, { useState, useEffect } from 'react';
import getWeb3 from '../utils/web3';
import PokemonStoreABI from '../abis/PokemonStore.json';
import '../components/BuyPokemon.css';

const PokemonStoreAddress = '0x98C281a11a6C8151ca978d40be55Edb51756189d'; // Actualiza con la dirección correcta

const AddPokemon = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [pokemonStore, setPokemonStore] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
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
      } catch (error) {
        console.error('Error initializing web3 or contract:', error);
        setErrorMessage('Error inicializando web3 o contrato.');
      }
    };
    init();
  }, []);

  const handleAddPokemon = async () => {
    if (pokemonStore) {
      try {
        console.log('Adding Pokemon:', name, price, stock);
        await pokemonStore.methods
          .addPokemon(name, web3.utils.toWei(price, 'ether'), stock)
          .send({ from: account });
        alert('Pokemon agregado con éxito');
      } catch (error) {
        console.error('Error adding Pokemon:', error);
        alert('Error agregando el Pokemon');
      }
    } else {
      console.error('PokemonStore contract is not loaded.');
      setErrorMessage('PokemonStore contract is not loaded.');
    }
  };

  return (
    <div>
      <h2>Agregar Pokemon</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del Pokemon"
      />
      <input
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Precio en tokens"
      />
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Cantidad en stock"
      />
      <button onClick={handleAddPokemon}>Agregar</button>
    </div>
  );
};

export default AddPokemon;
