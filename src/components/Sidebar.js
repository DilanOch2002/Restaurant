import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Rutas donde el Sidebar será visible
  const visibleRoutes = ['/dashboard', '/reportes', '/usuario', '/dashboardadmin'];
  const isSidebarVisible = visibleRoutes.includes(location.pathname);

  // Ocultar Sidebar si no corresponde
  if (!isSidebarVisible) return null;

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remover token al cerrar sesión
    navigate('/login'); // Redirigir al login
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Botón para colapsar */}
      <button className="toggle-button" onClick={() => setIsCollapsed(!isCollapsed)}>
        ☰
      </button>
      {!isCollapsed && (
        <>
          {/* Sección del perfil */}
          <div className="profile-section">
            <img src="https://via.placeholder.com/100" alt="Perfil" className="profile-icon" />
            <p className="profile-name">Nombre de Usuario</p>
          </div>

          {/* Menú de navegación */}
          <div className="menu">
            <ul>
              <li onClick={() => navigate('/dashboard')} className={location.pathname === '/dashboard' ? 'active' : ''}>
                Sistema Principal
              </li>
              <li onClick={() => navigate('/reportes')} className={location.pathname === '/reportes' ? 'active' : ''}>
                Reportes
              </li>
              <li onClick={() => navigate('/usuario')} className={location.pathname === '/usuario' ? 'active' : ''}>
                Gestionar Usuarios
              </li>
              <li onClick={() => navigate('/dashboardadmin')} className={location.pathname === '/dashboardadmin' ? 'active' : ''}>
                Gestionar Productos
              </li>
            </ul>
          </div>

          {/* Botón de cierre de sesión */}
          <div className="logout-section">
            <button onClick={handleLogout} className="logout-button">
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;



