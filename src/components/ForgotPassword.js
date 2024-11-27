import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === '') {
      setMessage('Por favor, ingresa tu correo electrónico.');
      return;
    }
    
    // Aquí agregarías la lógica para enviar el correo de restablecimiento
    console.log('Correo enviado a:', email);

    // Mensaje de confirmación
    setMessage('Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.');
    setEmail('');

    // Redirige al usuario al login
    setTimeout(() => {
      navigate('/login');
    }, 2000); // Retraso de 2 segundos antes de redirigir al login
  };

  return (
    <div className="forgot-password-container">
      <h2>Restablecer Contraseña</h2>
      <p>Introduce tu correo electrónico para restablecer tu contraseña.</p>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <button type="submit" className="submit-button">Enviar Enlace</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
