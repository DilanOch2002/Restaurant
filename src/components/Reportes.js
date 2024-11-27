import React, { useState, useEffect } from "react";
import "./Reportes.css";

const Reportes = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [ventaEncontrada, setVentaEncontrada] = useState(null);
  const [error, setError] = useState("");

  // Obtener los datos de todas las ventas desde la API
  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = () => {
    setLoading(true);
    fetch("https://localhost:44393/api/Ventas")
      .then((response) => response.json())
      .then((data) => {
        setVentas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de ventas:", error);
        setLoading(false);
      });
  };

  // Buscar venta por ID
  const buscarPorId = () => {
    if (!searchId) {
      setError("Por favor, ingrese un ID válido.");
      setVentaEncontrada(null);
      return;
    }

    fetch(`https://localhost:44393/api/Ventas/${searchId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Venta no encontrada.");
        }
        return response.json();
      })
      .then((data) => {
        setVentaEncontrada(data);
        setError("");
      })
      .catch((error) => {
        setError(error.message);
        setVentaEncontrada(null);
      });
  };

  // Eliminar venta por ID
  const eliminarVenta = (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la venta con ID ${id}?`)) {
      return;
    }

    fetch(`https://localhost:44393/api/Ventas/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`No se pudo eliminar la venta: ${text}`);
          });
        }
        // Actualizar el estado local eliminando la venta
        setVentas(ventas.filter((venta) => venta.id_venta !== id));
        alert("Venta eliminada con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar la venta:", error);
        alert("Error al eliminar la venta. " + error.message);
      });
  };

  return (
    <div className="reportes-container">
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <a href="#ventas" className="navbar-link">Ventas</a>
          </li>
          <li className="navbar-item">
            <a href="#comidas" className="navbar-link">Comidas</a>
          </li>
          <li className="navbar-item">
            <a href="#producto-mas-vendido" className="navbar-link">Producto Más Vendido</a>
          </li>
          <li className="navbar-item">
            <a href="#movimiento-inventario" className="navbar-link">Movimiento de Inventario</a>
          </li>
        </ul>
      </nav>

      <div className="reportes-section">
        <h1>Bienvenido a los Reportes</h1>
        <p>Seleccione una opción del menú para ver los reportes correspondientes.</p>

        <div id="ventas">
          <h2>Ventas Realizadas</h2>

          {/* Formulario de búsqueda por ID */}
          <div className="buscar-venta">
            <input
              type="text"
              placeholder="Buscar por ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="buscar-input"
            />
            <button onClick={buscarPorId} className="buscar-btn">
              Buscar
            </button>
          </div>

          {/* Mostrar resultados de búsqueda */}
          {ventaEncontrada && (
            <div className="venta-encontrada">
              <h3>Venta Encontrada:</h3>
              <table className="ventas-table">
                <thead>
                  <tr>
                    <th>ID Venta</th>
                    <th>ID Mesa</th>
                    <th>ID Usuario</th>
                    <th>ID Método</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{ventaEncontrada.id_venta}</td>
                    <td>{ventaEncontrada.id_mesa}</td>
                    <td>{ventaEncontrada.id_usuario}</td>
                    <td>{ventaEncontrada.id_metodo}</td>
                    <td>${ventaEncontrada.total}</td>
                    <td>{ventaEncontrada.estado}</td>
                    <td>{new Date(ventaEncontrada.fecha).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Mostrar mensaje de error */}
          {error && <p className="error">{error}</p>}

          {/* Tabla general de ventas */}
          {loading ? (
            <p>Cargando datos de ventas...</p>
          ) : (
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>ID Venta</th>
                  <th>ID Mesa</th>
                  <th>ID Usuario</th>
                  <th>ID Método</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr key={venta.id_venta}>
                    <td>{venta.id_venta}</td>
                    <td>{venta.id_mesa}</td>
                    <td>{venta.id_usuario}</td>
                    <td>{venta.id_metodo}</td>
                    <td>${venta.total}</td>
                    <td>{venta.estado}</td>
                    <td>{new Date(venta.fecha).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => eliminarVenta(venta.id_venta)}
                        className="eliminar-btn"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reportes;

