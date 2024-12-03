import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importar los estilos del toast
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email === '') {
      setMessage('Por favor, ingresa tu correo electrónico.');
      return;
    }

    // Aquí agregarías la lógica para enviar el correo de restablecimiento
    console.log('Correo enviado a:', email);

    // Mostrar el toast de éxito
    toast.success('Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.', {
      position: 'top-center',  // Cambio aquí
      autoClose: 3000,  // El toast desaparecerá en 3 segundos
    });
    

    // Limpiar el formulario y el mensaje
    setEmail('');
    setMessage('');

    // Redirige al usuario al login después de mostrar el toast
    setTimeout(() => {
      navigate('/login');
    }, 3000); // Retraso de 3 segundos para coincidir con el tiempo del toast
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
      <ToastContainer /> {/* Aquí se coloca el contenedor del Toast */}
    </div>
  );
};

export default ForgotPassword;

