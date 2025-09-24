// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Componentes de layout y protección de rutas
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

// Importa las diferentes páginas de la aplicación
import Login from './pages/Login';
import HomeDashboard from './pages/HomeDashboard'; // El menú principal de 3 tarjetas
import Diagnostico from './pages/Diagnostico';
import PlanesDeAccion from './pages/PlanesDeAccion';
import Seguimiento from './pages/Seguimiento'; // El dashboard de KPIs que acabamos de crear

// Importa el archivo principal de estilos
import './App.css';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomeDashboard />} />
            <Route path="diagnostico" element={<Diagnostico />} />
            <Route path="planes-de-accion" element={<PlanesDeAccion />} />
            <Route path="seguimiento" element={<Seguimiento />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;