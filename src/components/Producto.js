import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Producto.css';

const Producto = () => {
  const navigate = useNavigate();
  const categories = ['Todas', 'ALIMENTOS', 'BEBIDAS', 'Z CABINAS', 'ESPECIAL DEL DIA'];

  // Estados para productos y otros estados
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://localhost:44393/api/productos/Producto');
        if (!response.ok) {
          throw new Error(`Error al obtener productos: ${response.statusText}`);
        }
        const data = await response.json();

        // Mapear los datos de la API al formato esperado por el componente
        const mappedProducts = data.map((product) => ({
          id: product.id_producto,
          name: product.nombre,
          description: product.descripcion,
          price: product.precio,
          category: categories[product.id_categoria] || 'Otras',
          image: product.imagen_url || 'https://via.placeholder.com/150', // Imagen por defecto
          stock: product.stock,
        }));

        setProducts(mappedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    if (product.stock > 0) {
      setCart((prevCart) => {
        const existingProduct = prevCart.find((item) => item.id === product.id);
        if (existingProduct) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { ...product, quantity: 1, discount: 0 }];
      });
    } else {
      alert('Este producto está agotado.');
    }
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalCartPrice = cart.reduce((total, item) => {
    return total + item.quantity * (item.price - (item.price * item.discount) / 100);
  }, 0);

  const handlePayment = () => {
    // Cuando el usuario presione "Pagar", se redirige directamente al PaymentGateway
    navigate('/payment', {
      state: {
        totalAmount: totalCartPrice,
        paymentMethod: 'Tarjeta', // O puedes usar un valor fijo como 'Efectivo' si prefieres
        cartProducts: cart,
      },
    });
  };

  const filteredProducts =
    selectedCategory === 'Todas'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <nav className="categories">
          <h3>Categorías</h3>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className="category-item"
                onClick={() => setSelectedCategory(category)}
              >
                <span className="category-name">{category}</span>
                <i className="category-icon">🔹</i>
              </li>
            ))}
          </ul>
        </nav>

        <main className="products-grid">
          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p>Error al cargar los productos: {error}</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <p className="product-name">{product.name}</p>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-stock">
                  {product.stock > 0 ? `Disponibles: ${product.stock}` : 'Agotado'}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                </button>
              </div>
            ))
          ) : (
            <p>No hay productos disponibles en esta categoría.</p>
          )}
        </main>

        <aside className="cart">
          <h3>Carrito de Compras</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <p>{item.name}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Descuento: {item.discount} %</p>
                  <p>
                    Total: ${(
                      (item.price - (item.price * item.discount) / 100) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
              </li>
            ))}
          </ul>
          <p className="cart-total">Total: ${totalCartPrice.toFixed(2)}</p>
          <button className="pay-button" onClick={handlePayment}>
            Pagar
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Producto;









