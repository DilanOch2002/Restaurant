import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PaymentGateway.css';

const PaymentGateway = ({ onPaymentSuccess }) => {
  const location = useLocation();
  const totalAmount = location.state?.totalAmount || 0;
  const cartProducts = location.state?.cartProducts || [];
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Cargar los métodos de pago desde la API
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('https://localhost:44393/api/MetodosPago');
        const data = await response.json();
        setPaymentMethods(data);
      } catch (error) {
        console.error('Error al cargar los métodos de pago:', error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePayment = () => {
    if (selectedPaymentMethod) {
      setPaymentConfirmed(true);
      onPaymentSuccess();
    }
  };

  return (
    <div className="payment-gateway">
      <h2>Elige el método de pago</h2>
      <p>Total a pagar: ${totalAmount.toFixed(2)}</p>
      
      {/* Opción desplegable para seleccionar el método de pago */}
      <div className="payment-options">
        <label htmlFor="payment-method">Selecciona un método de pago:</label>
        <select
          id="payment-method"
          value={selectedPaymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <option value="">--Seleccione--</option>
          {paymentMethods.map((method) => (
            <option key={method.metodo} value={method.metodo}>
              {method.metodo}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar los detalles del método de pago si es necesario */}
      {selectedPaymentMethod && selectedPaymentMethod === 'card' && (
        <div className="card-details">
          <label>
            Número de tarjeta:
            <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" />
          </label>
          <label>
            Fecha de vencimiento:
            <input type="text" placeholder="MM/AA" />
          </label>
          <label>
            CVV:
            <input type="text" placeholder="123" />
          </label>
        </div>
      )}

      <button className="pay-button" onClick={handlePayment} disabled={!selectedPaymentMethod}>
        Confirmar Pago
      </button>

      {paymentConfirmed && <p className="payment-confirmation">¡Pago exitoso!</p>}

      {/* Mostrar productos del carrito */}
      <h3>Productos en el carrito</h3>
      <div className="cart-products">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cartProducts.map((product) => (
              <tr key={product.id}>
                <td className="product-name">{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>${(product.price * product.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentGateway;

