import React from 'react';
import BuyPokemon from './components/BuyPokemon';
import AddPokemon from './components/AddPokemon';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mercado de Pokemones</h1>
        <nav>
          <ul>
            <li><a href="#buy">Comprar Pokemon</a></li>
            <li><a href="#add">Agregar Pokemon</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section id="buy">
          <BuyPokemon />
        </section>
        <section id="add">
          <AddPokemon />
        </section>
      </main>
    </div>
  );
};

export default App;
