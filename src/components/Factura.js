import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Factura.css';

const Factura = () => {
  const [formData, setFormData] = useState({
    rfcReceptor: '',
    sucursalEmisora: '',
    ticket: '',
    fechaEmision: '',
    email: '',
    telefono: '',
    comentario: '',
    leyenda: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de un mensaje de éxito desde un servidor
    toast.success('Formulario enviado correctamente! Su factura será procesada en breve.');
    console.log('Datos enviados:', formData);
    
    // Limpiar los campos después del envío
    setFormData({
      rfcReceptor: '',
      sucursalEmisora: '',
      ticket: '',
      fechaEmision: '',
      email: '',
      telefono: '',
      comentario: '',
      leyenda: '',
    });
  };

  return (
    <div className="form-container">
      <h2>Solicitar Factura</h2>
      <form onSubmit={handleSubmit} className="factura-form">
        <div className="form-group">
          <label htmlFor="rfcReceptor">RFC Receptor</label>
          <input
            type="text"
            id="rfcReceptor"
            name="rfcReceptor"
            value={formData.rfcReceptor}
            onChange={handleChange}
            placeholder="Ingrese su RFC"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sucursalEmisora">Sucursal Emisora</label>
          <input
            type="text"
            id="sucursalEmisora"
            name="sucursalEmisora"
            value={formData.sucursalEmisora}
            onChange={handleChange}
            placeholder="Sucursal emisora"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ticket">Ticket</label>
          <input
            type="text"
            id="ticket"
            name="ticket"
            value={formData.ticket}
            onChange={handleChange}
            placeholder="Número de ticket"
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaEmision">Fecha de Emisión</label>
          <input
            type="date"
            id="fechaEmision"
            name="fechaEmision"
            value={formData.fechaEmision}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="10 dígitos"
          />
        </div>
        <div className="form-group">
          <label htmlFor="comentario">Comentario</label>
          <textarea
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
            placeholder="Añade un comentario..."
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="leyenda">Leyenda</label>
          <textarea
            id="leyenda"
            name="leyenda"
            value={formData.leyenda}
            onChange={handleChange}
            placeholder="Incluye una leyenda si aplica"
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          Enviar
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Factura;





