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
    id_categoria: '', // Now expects a number
    fecha_registro: new Date().toISOString(),
    imagen_url: '', // Image is optional
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

  // Function to handle form submission (Add or Update product)
  const handleSubmitProduct = async () => {
    console.log('Producto a enviar:', newProduct); // Logs the product before sending

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
      id_categoria: Number(newProduct.id_categoria), // Ensure it's a number
      imagen_url: newProduct.imagen_url || '', // Image is optional
      fecha_registro: newProduct.fecha_registro || new Date().toISOString(), // Automatically set if not provided
    };

    try {
      let response;
      if (newProduct.id_producto === 0) {
        // Add new product (POST)
        response = await fetch('https://localhost:44393/api/productos/Producto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productToSubmit),
        });
      } else {
        // Update existing product (PUT)
        response = await fetch(`https://localhost:44393/api/productos/Producto/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productToSubmit),
        });
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      alert('Producto procesado exitosamente!');

      // Clear form fields
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

      // Refetch the products list
      fetchProducts();
    } catch (error) {
      console.error('Error al procesar el producto:', error);
      alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
  };

  // Function to handle product click (for editing)
  const handleEditProduct = (product) => {
    console.log('Producto a editar:', product); // Logs the product being edited
    setNewProduct(product);
  };

  const handleDeleteProduct = async (id_producto) => {
    console.log('Producto a eliminar:', id_producto); // Log para verificar el ID
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const response = await fetch(`https://localhost:44393/api/productos/Producto/${id_producto}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
  
        // Actualiza el estado eliminando el producto de la lista
        setProducts(products.filter(product => product.id_producto !== id_producto));
        alert('Producto eliminado exitosamente!');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Ocurrió un error al eliminar el producto');
      }
    }
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
            onChange={(e) => {
              setNewProduct({ ...newProduct, id_categoria: e.target.value });
              console.log('Nuevo producto:', { ...newProduct, id_categoria: e.target.value }); // Logs the updated product
            }}
          />
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newProduct.nombre}
            onChange={(e) => {
              setNewProduct({ ...newProduct, nombre: e.target.value });
              console.log('Nuevo producto:', { ...newProduct, nombre: e.target.value }); // Logs the updated product
            }}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newProduct.descripcion}
            onChange={(e) => {
              setNewProduct({ ...newProduct, descripcion: e.target.value });
              console.log('Nuevo producto:', { ...newProduct, descripcion: e.target.value }); // Logs the updated product
            }}
          />
          <input
  type="number"
  step="0.01"  // Allows decimal input
  placeholder="Precio"
  value={newProduct.precio}
  onChange={(e) => {
    // Convert the input value to a decimal (float)
    setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) });
    console.log('Nuevo producto:', { ...newProduct, precio: parseFloat(e.target.value) }); // Logs the updated product
  }}
/>
<input
  type="number"
  placeholder="Stock"
  value={newProduct.stock}
  onChange={(e) => {
    // Convert the input value to an integer
    setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) });
    console.log('Nuevo producto:', { ...newProduct, stock: parseInt(e.target.value, 10) }); // Logs the updated product
  }}
/>
          <input
            type="text"
            placeholder="URL de la imagen (opcional)"
            value={newProduct.imagen_url}
            onChange={(e) => {
              setNewProduct({ ...newProduct, imagen_url: e.target.value });
              console.log('Nuevo producto:', { ...newProduct, imagen_url: e.target.value }); // Logs the updated product
            }}
          />
          <button onClick={handleSubmitProduct}>
            {newProduct.id_producto ? 'Actualizar Producto' : 'Añadir Producto'}
          </button>
        </div>

        {/* Product grid to show all products */}
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
                <button onClick={() => handleDeleteProduct(product.id_producto)}>Eliminar</button>
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

