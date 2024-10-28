import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Retos.css';

const Retos = () => {
    const [retos, setRetos] = useState([]);
    const [expandedReto, setExpandedReto] = useState(null); // Estado para el reto expandido
    const [draggedIndex, setDraggedIndex] = useState(null); // Índice del reto arrastrado

    // Función para obtener retos desde el servidor
    const fetchRetos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/retos'); // Asegúrate de que la ruta sea correcta
            setRetos(response.data || []); // Asumimos que la respuesta tiene una lista de retos
        } catch (error) {
            console.error("Error al obtener los retos:", error);
        }
    };

    useEffect(() => {
        fetchRetos(); // Llama a la función al cargar el componente
    }, []);

    // Función para manejar el clic en el título del reto
    const handleToggle = (id) => {
        setExpandedReto(expandedReto === id ? null : id); // Cambiar el estado del reto expandido
    };

    // Función para eliminar un reto
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/retos/${id}`); // Asegúrate de que la ruta sea correcta
            fetchRetos(); // Vuelve a obtener los retos después de eliminar uno
        } catch (error) {
            console.error("Error al eliminar el reto:", error);
        }
    };

    // Función para manejar el inicio del arrastre
    const handleMouseDown = (index) => {
        setDraggedIndex(index); // Establecer el índice del reto arrastrado
    };

    // Función para manejar el fin del arrastre
    const handleMouseUp = () => {
        setDraggedIndex(null); // Limpiar el índice arrastrado
    };

    // Función para manejar el movimiento del mouse
    const handleMouseMove = (event) => {
        if (draggedIndex !== null) {
            const { clientY } = event;
            const listItems = document.querySelectorAll('.reto-item'); // Selecciona todos los items de la lista
            listItems.forEach((item, index) => {
                const { top, bottom } = item.getBoundingClientRect();
                if (clientY > top && clientY < bottom && index !== draggedIndex) {
                    const updatedRetos = [...retos];
                    const [movedReto] = updatedRetos.splice(draggedIndex, 1); // Quitar el reto de la posición actual
                    updatedRetos.splice(index, 0, movedReto); // Insertar en la nueva posición
                    setRetos(updatedRetos); // Actualizar el estado con los nuevos retos
                    setDraggedIndex(index); // Actualizar el índice arrastrado
                }
            });
        }
    };

    useEffect(() => {
        // Añadir y eliminar eventos para el mouse
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [draggedIndex]); // Solo se ejecuta cuando cambia el índice arrastrado

    return (
        <div className="retos-list">
            <h2>Retos Creados</h2>
            <ul>
                {retos.map((reto, index) => (
                    <li key={reto.id} className={`reto-item ${draggedIndex === index ? 'dragging' : ''}`}>
                        <div
                            className="reto-title"
                            onClick={() => handleToggle(reto.id)}
                            style={{ cursor: draggedIndex === index ? 'grabbing' : 'grab' }} // Cambia el cursor para indicar que se puede arrastrar
                        >
                            {reto.titulo} 
                            <span 
                                className="move-icon" 
                                onMouseDown={() => handleMouseDown(index)} 
                                onMouseUp={handleMouseUp} // Evitar la selección de texto
                                onDragStart={(e) => e.preventDefault()} // Prevenir la selección de texto al arrastrar
                            >
                                &#9776; {/* Icono de tres líneas */}
                            </span>
                        </div>
                        {expandedReto === reto.id && (
                            <div className="reto-details">
                                <strong>Descripción:</strong> {reto.descripcion} <br />
                                <strong>Lenguaje:</strong> {reto.lenguaje} <br />
                                <button className="delete-button" onClick={() => handleDelete(reto.id)}>Eliminar Reto</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Retos;
