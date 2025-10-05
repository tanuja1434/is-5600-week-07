import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CartProvider } from './state/CartProvider';
import Header from './components/Header';
import CardList from './components/CardList';
import SingleView from './components/SingleView';
import Orders from './components/Orders';
import Cart from './components/Cart';
import './App.css';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<CardList />} />
          <Route path="/product/:id" element={<SingleView />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;