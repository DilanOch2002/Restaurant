import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username === '' || password === '') {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    // Realizar solicitud POST a la API para verificar el usuario
    try {
      const response = await fetch('https://localhost:44393/api/usuarios/Usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Enviar username y password
      });

      const data = await response.json();

      if (response.ok) {
        // Si la respuesta es exitosa, proceder con el login
        onLogin(data); // Pasar la respuesta al componente padre (si es necesario)
        navigate(data.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        // Si la API devuelve un error (por ejemplo, credenciales incorrectas)
        setErrorMessage(data.message || 'Credenciales inválidas. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setErrorMessage('Hubo un problema al conectar con el servidor. Inténtalo de nuevo.');
    }

    // Limpiar campos después de intentar iniciar sesión
    setUsername('');
    setPassword('');
  };

  const handleForgotPasswordRedirect = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="welcome-section">
          <div className="image-container">
            <img
              src="https://via.placeholder.com/100" // Asegúrate de colocar una imagen de perfil aquí
              alt="Imagen de usuario"
              className="user-image"
            />
          </div>
          <h2>Bienvenido</h2>
          <p className="subtitle">Por favor, ingresa tus datos para iniciar sesión</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
              placeholder="Ingresa tu username"
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="submit-button">Ingresar</button>
        </form>
        <div className="additional-links">
          <p>
            ¿No tienes una cuenta?{' '}
            <span onClick={() => navigate('/register')} className="link">Registrarse</span>
          </p>
          <p>
            <span onClick={handleForgotPasswordRedirect} className="link">¿Olvidaste tu contraseña?</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

