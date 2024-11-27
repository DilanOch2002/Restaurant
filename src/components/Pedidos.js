import React, { useState } from 'react';
import './Pedidos.css'; // Archivo CSS para el componente

const Pedidos = () => {
    const [nombre, setNombre] = useState('');
    const [numeroMesa, setNumeroMesa] = useState('');
    const [caracteristicas, setCaracteristicas] = useState('');
    const [pedidos, setPedidos] = useState([]);

    const agregarPedido = () => {
        if (nombre && numeroMesa && caracteristicas) {
            const nuevoPedido = { nombre, numeroMesa, caracteristicas };
            setPedidos([...pedidos, nuevoPedido]);
            setNombre('');
            setNumeroMesa('');
            setCaracteristicas('');
        } else {
            alert('Por favor, completa todos los campos');
        }
    };

    const eliminarPedido = (index) => {
        const nuevosPedidos = pedidos.filter((_, i) => i !== index);
        setPedidos(nuevosPedidos);
    };

    return (
        <div>
            <div className="container">
                <h2>Agregar Pedido</h2>
                <label>Nombre del Cliente</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                />

                <label>Número de Mesa</label>
                <input
                    type="number"
                    value={numeroMesa}
                    onChange={(e) => setNumeroMesa(e.target.value)}
                    placeholder="Número de Mesa"
                />

                <label>Características del Pedido</label>
                <input
                    type="text"
                    value={caracteristicas}
                    onChange={(e) => setCaracteristicas(e.target.value)}
                    placeholder="Características"
                />

                <button onClick={agregarPedido}>Agregar Pedido</button>

                <h3>Lista de Pedidos</h3>
                <div className="pedidos-container">
                    {pedidos.map((pedido, index) => (
                        <div className="pedido-card" key={index}>
                            <div><strong>Cliente:</strong> {pedido.nombre}</div>
                            <div><strong>Mesa:</strong> {pedido.numeroMesa}</div>
                            <div><strong>Características:</strong> {pedido.caracteristicas}</div>
                            <button className="eliminar-btn" onClick={() => eliminarPedido(index)}>Eliminar</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pedidos;

