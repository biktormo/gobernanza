// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase/authService';
import { useTheme } from '../hooks/useTheme';

const Header = ({ isHomePage }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [theme, toggleTheme] = useTheme();

    // Esta es la función que se encarga de cerrar la sesión
    const handleLogout = async () => {
        try {
            await logOut();
            // Redirigimos al usuario a la página de login después de cerrar sesión
            navigate('/login');
        } catch (error) {
            console.error("Error al cerrar sesión", error);
            // Opcional: Mostrar una notificación de error al usuario
            // toast.error("No se pudo cerrar la sesión.");
        }
    };

    return (
        <header className="new-header">
            <Link to="/" className="logo-link">
                {/* Asumo que tienes un logo llamado 'SARTOR.png' en tu carpeta /public */}
                <img src="/Sartor_Logos_1.png" alt="SARTOR" className="logo-img" />
            </Link>
            
            {currentUser && (
                <div className="header-controls">
                    {!isHomePage && <Link to="/" className="nav-link">Panel de Control</Link>}
                    
                    <button onClick={toggleTheme} className="theme-toggle-button">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    
                    <span className="user-email">{currentUser.email}</span>

                    {/* --- CORRECCIÓN CLAVE AQUÍ --- */}
                    {/* Nos aseguramos de que el onClick llame a handleLogout */}
                    <button onClick={handleLogout} className="logout-button">
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;