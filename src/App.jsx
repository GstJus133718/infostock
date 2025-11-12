import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Customers from './pages/Suppliers/Customers';
import Sales from './pages/Sales/Sales';
import './index.css';
import Relatorios from './pages/Relatorios/Relatorios';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Customers />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/relatorios" element={<Relatorios />} />
          {/* Outras rotas serão adicionadas aqui */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;