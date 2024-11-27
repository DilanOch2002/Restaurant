import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Producto from "./components/Producto";
import PaymentGateway from "./components/PaymentGateway";
import DashboardAdmin from "./components/DashboardAdmin";
import Pedidos from "./components/Pedidos";
import Mesas from "./components/Mesas";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Factura from "./components/Factura";
import Usuario from "./components/Usuario";
import Reportes from "./components/Reportes";
import Sidebar from "./components/Sidebar"; // Importar Sidebar

const App = () => {
  const [users, setUsers] = useState([]);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const handleRegister = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const handleLogin = (user) => {
    setAuthenticatedUser(user);
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
  };

  const location = useLocation();

  // Lista de rutas donde NO quieres mostrar el Navbar
  const isNavbarVisible = !['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div>
      {/* Si la ruta no está en la lista, mostramos el Navbar */}
      {isNavbarVisible && <Navbar />}
      <div style={{ display: "flex" }}>
        {/* Mostrar Sidebar solo en rutas específicas */}
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login users={users} onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/payment" element={<PaymentGateway />} />
            <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
            <Route path="/Pedidos" element={<Pedidos />} />
            <Route path="/mesas" element={<Mesas />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/producto" element={<Producto />} />
            <Route path="/factura" element={<Factura />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;



