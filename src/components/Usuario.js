import React, { useState, useEffect } from 'react';
import './Usuario.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]); // Estado para almacenar la lista de usuarios
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetch('https://localhost:44393/api/usuarios/Usuarios'); // Endpoint de tu API
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json(); // Convertir los datos a JSON
        setUsers(data); // Establecer la lista de usuarios
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos de los usuarios.');
      } finally {
        setIsLoading(false); // Finalizar estado de carga
      }
    };

    fetchUsersData(); // Llamar a la función para obtener los datos
  }, []);

  if (isLoading) return <p>Cargando datos de los usuarios...</p>; // Mostrar mensaje mientras se cargan los datos
  if (error) return <p>Error: {error}</p>; // Mostrar mensaje de error si ocurre uno

  return (
    <div className="usuarios-container">
      <h2>Lista de Usuarios</h2>
      {users.length > 0 ? (
        <div className="usuarios-scroll">
          {users.map((user) => (
            <div key={user.id_usuario} className="usuario-card">
              <p><strong>ID Usuario:</strong> {user.id_usuario}</p>
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Correo (Username):</strong> {user.username}</p>
              <p><strong>Contraseña:</strong> {user.password}</p>
              <p><strong>Rol:</strong> {user.rol}</p>
              <p><strong>Fecha de Registro:</strong> {new Date(user.fecha_registro).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron usuarios.</p>
      )}
    </div>
  );
};

export default Usuarios;









