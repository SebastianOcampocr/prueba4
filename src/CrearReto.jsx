import { useState } from 'react';
import './CrearReto.css';

const CrearReto = () => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [lenguaje, setLenguaje] = useState(''); // Estado para el lenguaje
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async () => {
        if (!titulo || !descripcion || !lenguaje) { // Validar todos los campos
            setError('Por favor, completa todos los campos.');
            return;
        }

        setError('');

        try {
            const response = await fetch('https://timedata-ruddy.vercel.app/crear-reto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo, descripcion, lenguaje }), // Enviar el lenguaje
            });

            if (!response.ok) {
                const errorData = await response.json(); // Obtener el mensaje de error del servidor
                throw new Error(errorData.message || 'Error al crear el reto'); // Utilizar el mensaje del servidor
            }

            const data = await response.json();
            setSuccessMessage(data.message); // Asumiendo que el servidor responde con un mensaje
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    return (
        <div className="crear-reto">
            <h2>Crear Reto</h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <input
                type="text"
                placeholder="Título del reto"
                value={titulo}
                className="input-field" // Clases ajustadas
                onChange={(e) => setTitulo(e.target.value)}
            />
            <textarea
                placeholder="Descripción del reto"
                value={descripcion}
                className="textarea-field" // Clases ajustadas
                onChange={(e) => setDescripcion(e.target.value)}
            />
            <input
                type="text"
                placeholder="Lenguaje del reto"
                value={lenguaje}
                className="input-field" // Clases ajustadas
                onChange={(e) => setLenguaje(e.target.value)} // Manejo del lenguaje
            />
            <button className="submit-button" onClick={handleSubmit}>Crear Reto</button> {/* Clases ajustadas */}
        </div>
    );
};

export default CrearReto;
