import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PaymentGateway.css';

const PaymentGateway = ({ onPaymentSuccess, clearCart }) => {
  const location = useLocation();
  const totalAmount = location.state?.totalAmount || 0;
  const cartProducts = location.state?.cartProducts || [];

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    accountNumber: '',
    cashReceived: '',
  });

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
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      bankName: '',
      accountNumber: '',
      cashReceived: '',
    }); // Reiniciar campos al cambiar método
  };

  const handlePaymentDetailsChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      toast.error('Por favor selecciona un método de pago.');
      return;
    }

    // Validar detalles de pago específicos según el método seleccionado
    if (
      selectedPaymentMethod === 'Tarjeta de Crédito' ||
      selectedPaymentMethod === 'Tarjeta de Débito'
    ) {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        toast.error('Por favor, completa todos los datos de la tarjeta.');
        return;
      }
    } else if (selectedPaymentMethod === 'Tranferencia') {
      if (!paymentDetails.bankName || !paymentDetails.accountNumber) {
        toast.error('Por favor, completa los datos de la transferencia bancaria.');
        return;
      }
    } else if (selectedPaymentMethod === 'Efectivo') {
      if (!paymentDetails.cashReceived) {
        toast.error('Por favor, indica la cantidad recibida en efectivo.');
        return;
      }
    }

    toast.success('¡Pago realizado con éxito!', {
      position: 'top-center',
      autoClose: 3000,
    });

    setTimeout(() => {
      setSelectedPaymentMethod('');
      setPaymentDetails({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        bankName: '',
        accountNumber: '',
        cashReceived: '',
      });
      if (clearCart) clearCart(); // Vaciar el carrito
      if (onPaymentSuccess) onPaymentSuccess(); // Notificar el éxito
    }, 3000);
  };

  return (
    <div className="payment-gateway">
      <ToastContainer />
      <h2>Elige el método de pago</h2>
      <p>Total a pagar: ${totalAmount.toFixed(2)}</p>

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

      {/* Renderizado de formularios específicos */}
      {['Tarjeta de Crédito', 'Tarjeta de Débito'].includes(selectedPaymentMethod) && (
        <div className="card-details">
          <h4>Detalles de Tarjeta</h4>
          <label>
            Número de tarjeta:
            <input
              type="text"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handlePaymentDetailsChange}
              placeholder="XXXX-XXXX-XXXX-XXXX"
            />
          </label>
          <label>
            Fecha de vencimiento:
            <input
              type="text"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={handlePaymentDetailsChange}
              placeholder="MM/AA"
            />
          </label>
          <label>
            CVV:
            <input
              type="text"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={handlePaymentDetailsChange}
              placeholder="123"
            />
          </label>
        </div>
      )}

      {selectedPaymentMethod === 'Tranferencia' && (
        <div className="transfer-details">
          <h4>Detalles de Transferencia Bancaria</h4>
          <label>
            Banco:
            <input
              type="text"
              name="bankName"
              value={paymentDetails.bankName}
              onChange={handlePaymentDetailsChange}
              placeholder="Nombre del banco"
            />
          </label>
          <label>
            Número de cuenta:
            <input
              type="text"
              name="accountNumber"
              value={paymentDetails.accountNumber}
              onChange={handlePaymentDetailsChange}
              placeholder="XXXXXXXXXX"
            />
          </label>
        </div>
      )}

      {selectedPaymentMethod === 'Efectivo' && (
        <div className="cash-details">
          <h4>Detalles de Pago en Efectivo</h4>
          <label>
            Cantidad recibida:
            <input
              type="text"
              name="cashReceived"
              value={paymentDetails.cashReceived}
              onChange={handlePaymentDetailsChange}
              placeholder="Cantidad en efectivo"
            />
          </label>
        </div>
      )}

      <button className="pay-button" onClick={handlePayment} disabled={!selectedPaymentMethod}>
        Confirmar Pago
      </button>

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

