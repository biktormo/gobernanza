// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../firebase/authService'; 
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginPromise = logIn(email, password);

    toast.promise(loginPromise, {
      loading: 'Iniciando sesión...',
      success: '¡Bienvenido!',
      error: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
    });

    try {
      await loginPromise;
      navigate('/'); // Redirigir al panel principal
    } catch (err) {
      // El toast ya maneja el mensaje de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        
        {/* --- LOGO AÑADIDO AQUÍ --- */}
        <div className="auth-logo">
          <img src="/Sartor_Logos_1.png" alt="SARTOR" />
        </div>
        
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="primary-button auth-button" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;