import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    id_producto: 0,
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: '',
    fecha_registro: new Date().toISOString(),
    imagen_url: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://localhost:44393/api/productos/Producto');
      if (!response.ok) {
        throw new Error(`Error al obtener productos: ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Submit product (Add or Update)
  const handleSubmitProduct = async () => {
    if (
      !newProduct.id_categoria ||
      !newProduct.nombre ||
      !newProduct.precio ||
      !newProduct.stock ||
      !newProduct.descripcion
    ) {
      alert('Por favor, completa todos los campos requeridos antes de enviar.');
      return;
    }

    const productToSubmit = {
      ...newProduct,
      id_categoria: Number(newProduct.id_categoria),
      imagen_url: newProduct.imagen_url || '',
      fecha_registro: newProduct.fecha_registro || new Date().toISOString(),
    };

    try {
      const url = 'https://localhost:44393/api/productos/Producto';
      const method = newProduct.id_producto === 0 ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSubmit),
      });

      if (!response.ok) {
        throw new Error(`Error al procesar el producto: ${response.statusText}`);
      }

      alert('Producto procesado exitosamente!');
      setNewProduct({
        id_producto: 0,
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        id_categoria: '',
        fecha_registro: new Date().toISOString(),
        imagen_url: '',
      });
      fetchProducts();
    } catch (error) {
      console.error('Error al procesar el producto:', error);
      alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
  };

  // Toggle product status (Enable/Disable)
  const handleToggleProductStatus = async (id_producto, currentStatus) => {
    const action = currentStatus ? 'deshabilitar' : 'habilitar';
    if (window.confirm(`¿Estás seguro de que deseas ${action} este producto?`)) {
      try {
        const response = await fetch(`https://localhost:44393/api/productos/Producto/${id_producto}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activo: !currentStatus }),
        });

        if (!response.ok) {
          throw new Error(`Error al intentar ${action} el producto`);
        }

        setProducts(
          products.map((product) =>
            product.id_producto === id_producto ? { ...product, activo: !currentStatus } : product
          )
        );

        alert(`Producto ${action === 'habilitar' ? 'habilitado' : 'deshabilitado'} exitosamente!`);
      } catch (error) {
        console.error(`Error al ${action} el producto:`, error);
        alert(`Ocurrió un error al intentar ${action} el producto`);
      }
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setNewProduct(product);
  };

  return (
    <div className="dashboard-admin">
      <h2>Administración de Productos</h2>
      <button onClick={() => navigate('/producto')} className="back-to-dashboard-button">
        Volver a Productos
      </button>

      <div className="dashboard-layout">
        <div className="add-product">
          <h3>{newProduct.id_producto ? 'Actualizar Producto' : 'Añadir Producto'}</h3>
          <input
            type="number"
            placeholder="ID de Categoría"
            value={newProduct.id_categoria}
            onChange={(e) => setNewProduct({ ...newProduct, id_categoria: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newProduct.nombre}
            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newProduct.descripcion}
            onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={newProduct.precio}
            onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })}
          />
          <input
            type="text"
            placeholder="URL de la imagen (opcional)"
            value={newProduct.imagen_url}
            onChange={(e) => setNewProduct({ ...newProduct, imagen_url: e.target.value })}
          />
          <button onClick={handleSubmitProduct}>
            {newProduct.id_producto ? 'Actualizar Producto' : 'Añadir Producto'}
          </button>
        </div>

        <div className="product-grid">
          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p>Error al cargar los productos: {error}</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product.id_producto} className="product-card">
                <img
                  src={product.imagen_url && product.imagen_url !== 'null' ? product.imagen_url : '/img/defect.png'}
                  alt={product.nombre}
                  className="product-image"
                />
                <p className="product-name">{product.nombre}</p>
                <p className="product-description">{product.descripcion}</p>
                <p className="product-price">${product.precio}</p>
                <p className="product-stock">
                  {product.stock > 0 ? `Disponibles: ${product.stock}` : 'Agotado'}
                </p>
                <button onClick={() => handleEditProduct(product)}>Actualizar</button>
                <button onClick={() => handleToggleProductStatus(product.id_producto, product.activo)}>
                  {product.activo ? 'Deshabilitar' : 'Habilitar'}
                </button>
              </div>
            ))
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;


