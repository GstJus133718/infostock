import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Customers from './pages/Suppliers/Customers';
import Sales from './pages/Sales/Sales';
import SalesHistory from './pages/Sales/SalesHistory';
import Relatorios from './pages/Relatorios/Relatorios';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/history"
            element={
              <ProtectedRoute>
                <SalesHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <ProtectedRoute>
                <Relatorios />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
