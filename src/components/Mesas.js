import React, { useState, useEffect } from 'react';
import './Mesas.css';

const Mesas = () => {
    const [numeroMesa, setNumeroMesa] = useState(0);
    const [capacidad, setCapacidad] = useState(0);
    const [descripcion, setDescripcion] = useState('');
    const [mesas, setMesas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [mensajeError, setMensajeError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    // Función para obtener las mesas de la API
    const obtenerMesas = async () => {
        try {
            const response = await fetch('https://localhost:44393/api/Mesas/obtener');
            if (!response.ok) throw new Error('Error al cargar las mesas');
            const data = await response.json();
            setMesas(data);
        } catch (error) {
            setMensajeError('Error: No se pueden mostrar las mesas.');
        }
    };

    // Cargar mesas al montar el componente
    useEffect(() => {
        obtenerMesas();
    }, []);

    // Validación para entradas de solo números positivos
    const handlePositiveNumberInput = (setter) => (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0) {
            setter(value);
        }
    };

    // Función para actualizar el estado de la mesa
    const actualizarEstado = async (id, estadoActual) => {
        try {
            const nuevoEstado = !estadoActual; // Cambiar el estado: si es false, se pone true, y viceversa
            const response = await fetch(`https://localhost:44393/api/Mesas/${id}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la mesa');
            }

            // Actualizar el estado de la mesa en la lista
            const mesasActualizadas = mesas.map((mesa) =>
                mesa.id_mesa === id ? { ...mesa, estado: nuevoEstado } : mesa
            );
            setMesas(mesasActualizadas);

            setMensajeExito('Estado de la mesa actualizado con éxito.');
            setTimeout(() => setMensajeExito(''), 3000); // Limpiar mensaje después de 3 segundos
        } catch (error) {
            setMensajeError(error.message || 'Hubo un error al actualizar el estado de la mesa.');
        }
    };

    // Guardar o actualizar mesa
    const guardarMesa = async () => {
        // Validaciones de campos
        if (!numeroMesa || !capacidad || !descripcion) {
            setMensajeError('Por favor, completa todos los campos.');
            return;
        }

        const nuevaMesa = {
            numeromesa: numeroMesa,
            capacidad: capacidad,
            estado: false,
            descripcion,
        };

        try {
            console.log('Datos enviados:', JSON.stringify(nuevaMesa));

            const response = isEditing
                ? await fetch(`https://localhost:44393/api/Mesas/${mesas[editIndex].id_mesa}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(nuevaMesa),
                  })
                : await fetch('https://localhost:44393/api/Mesas/obtener', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(nuevaMesa),
                  });

            if (!response.ok) {
                const errorResponse = await response.json().catch(() => null);
                throw new Error(errorResponse?.message || 'Error desconocido al guardar la mesa.');
            }
            const data = await response.json();

            if (isEditing) {
                const mesasActualizadas = mesas.map((mesa, index) =>
                    index === editIndex ? data : mesa
                );
                setMesas(mesasActualizadas);
            } else {
                setMesas([...mesas, data]);
            }

            setMensajeExito('Mesa agregada con éxito.');
            setTimeout(() => setMensajeExito(''), 3000);
            setShowModal(false);
            setNumeroMesa(0);
            setCapacidad(0);
            setDescripcion('');
            setMensajeError('');
        } catch (error) {
            console.error('Error al guardar la mesa:', error);
            setMensajeError(error.message || 'Hubo un error al guardar la mesa.');
        }
    };

    return (
        <div className="mesas-page">
            <div className="mesas-content">
                <h3>Gestión de Mesas</h3>
                <div className="acciones">
                    <button className="agregar-btn" onClick={() => setShowModal(true)}>
                        Agregar Mesa
                    </button>
                </div>
                {mensajeError && <div className="mensaje error">{mensajeError}</div>}
                {mensajeExito && <div className="mensaje exito">{mensajeExito}</div>}
                <div className="mesas-container">
                    {mesas.map((mesa, index) => (
                        <div className="mesa-card" key={mesa.id_mesa}>
                            <div>Numero de Mesa: {mesa.numero_mesa}</div>
                            <div>Capacidad: {mesa.capacidad}</div>
                            <div>Descripción: {mesa.descripcion}</div>
                            <div>Estado: {mesa.estado ? 'Disponible' : 'No disponible'}</div>
                            <button
                                onClick={() => actualizarEstado(mesa.id_mesa, mesa.estado)}
                                className={mesa.estado ? 'desactivar-btn' : 'activar-btn'}
                            >
                                {mesa.estado ? 'Desactivar' : 'Activar'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Editar Mesa' : 'Agregar Mesa'}</h2>
                        <label>Numero de Mesa</label>
                        <input
                            type="number"
                            value={numeroMesa}
                            onChange={handlePositiveNumberInput(setNumeroMesa)}
                            placeholder="Número de mesa"
                        />
                        <label>Capacidad</label>
                        <input
                            type="number"
                            value={capacidad}
                            onChange={handlePositiveNumberInput(setCapacidad)}
                            placeholder="Capacidad"
                        />
                        <label>Descripción</label>
                        <input
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción"
                        />
                        <button onClick={guardarMesa}>
                            {isEditing ? 'Actualizar' : 'Guardar'}
                        </button>
                        <button onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mesas;





