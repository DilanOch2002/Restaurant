import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importar ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importar CSS de react-toastify
import './Register.css';

const Register = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // Ahora el rol es editable
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación de campos
    if (!name || !username || !password || !confirmPassword || !role) {
      setErrorMessage('Por favor, completa todos los campos.');
      toast.error('Por favor, completa todos los campos.'); // Notificación de error
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      toast.error('Las contraseñas no coinciden.'); // Notificación de error
      return;
    }

    // Preparar los datos para enviar a la API
    const userData = { nombre: name, username, password, rol: role };

    // Llamada a la API para registrar el nuevo usuario
    try {
      const response = await fetch('https://localhost:44393/api/usuarios/Usuarios/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Enviar los datos como JSON
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso
        toast.success('Registro exitoso. Ahora puedes iniciar sesión.'); // Notificación de éxito
        toast.info('Revisa tu correo para confirmar tu cuenta si es necesario.'); // Advertencia adicional
        
        // Redirigir al login
        navigate('/login');
      } else {
        // Mostrar error en caso de fallo
        toast.error(data.message || 'Hubo un error al registrar el usuario.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      toast.error('Hubo un problema al conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle-password-button"
            >
              {showPassword ? 'Ocultar Contraseña' : 'Mostrar Contraseña'}
            </button>
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="toggle-password-button"
            >
              {showConfirmPassword ? 'Ocultar Contraseña' : 'Mostrar Contraseña'}
            </button>
          </div>
          <div className="form-group">
            <label>Rol (admin, mesero, etc.):</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="input-field"
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="submit-button">Registrarse</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;



