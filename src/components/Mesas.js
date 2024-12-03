import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

    useEffect(() => {
        obtenerMesas();
    }, []);

    const handlePositiveNumberInput = (setter) => (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0) {
            setter(value);
        }
    };

    const actualizarActivo = async (id_mesa, activoActual) => {
        const endpoint = activoActual
            ? `https://localhost:44393/api/Mesas/${id_mesa}/desactivar`
            : `https://localhost:44393/api/Mesas/${id_mesa}/activar`;

        const action = activoActual ? 'desactivar' : 'activar';

        if (window.confirm(`¿Estás seguro de que deseas ${action} esta mesa?`)) {
            try {
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Error al intentar ${action} la mesa.`);
                }

                const mesasActualizadas = mesas.map((mesa) =>
                    mesa.id_mesa === id_mesa ? { ...mesa, activo: !activoActual } : mesa
                );
                setMesas(mesasActualizadas);

                toast.success(`Mesa ${activoActual ? 'desactivada' : 'activada'} exitosamente!`);
            } catch (error) {
                console.error(`Error al ${action} la mesa:`, error);
                toast.error(`Ocurrió un error al intentar ${action} la mesa.`);
            }
        }
    };

    const guardarMesa = async () => {
        if (!numeroMesa || !capacidad || !descripcion) {
            setMensajeError('Por favor, completa todos los campos.');
            return;
        }

        const nuevaMesa = {
            numeromesa: numeroMesa,
            capacidad: capacidad,
            activo: true,
            descripcion,
        };

        try {
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

            toast.success('Mesa guardada con éxito.');
            setShowModal(false);
            setNumeroMesa(0);
            setCapacidad(0);
            setDescripcion('');
            setMensajeError('');
        } catch (error) {
            console.error('Error al guardar la mesa:', error);
            toast.error(error.message || 'Hubo un error al guardar la mesa.');
        }
    };

    return (
        <div className="mesas-page">
            <ToastContainer />
            <div className="mesas-content">
                <h3>Gestión de Mesas</h3>
                <div className="acciones">
                    <button className="agregar-btn" onClick={() => setShowModal(true)}>
                        Agregar Mesa
                    </button>
                </div>
                {mensajeError && <div className="mensaje error">{mensajeError}</div>}
                <div className="mesas-container">
                    {mesas.map((mesa) => (
                        <div className="mesa-card" key={mesa.id_mesa}>
                            <div>Numero de Mesa: {mesa.numero_mesa}</div>
                            <div>Capacidad: {mesa.capacidad}</div>
                            <div>Descripción: {mesa.descripcion}</div>
                            <div>Estado: {mesa.activo ? 'Disponible' : 'No disponible'}</div>
                            <button
                                onClick={() => actualizarActivo(mesa.id_mesa, mesa.activo)}
                                className={mesa.activo ? 'desactivar-btn' : 'activar-btn'}
                            >
                                {mesa.activo ? 'Desactivar' : 'Activar'}
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

