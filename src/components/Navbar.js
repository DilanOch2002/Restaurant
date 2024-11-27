import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate(); // Hook para navegación

  const handleNavigateToMesas = () => {
    navigate("/mesas");
  };

  const handleNavigateToFactura = () => {
    navigate("/factura");
  };

  const handleNavigateToProducto = () => {
    navigate("/producto");
  };

  const handleLogout = () => {
    navigate("/login"); // Redirige al login
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
      <button onClick={handleNavigateToMesas} className="navbar-item">
          Mesas
        </button>
        <button onClick={handleNavigateToProducto} className="navbar-item">
          Agregar Orden
        </button>
        <button onClick={handleNavigateToFactura} className="navbar-item">
          Facturación
        </button>
      </div>
      <div className="navbar-right">
        <button className="navbar-icon">
          <i className="fas fa-user-circle"></i> {/* Ícono de usuario */}
        </button>
        <button onClick={handleLogout} className="navbar-button">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
