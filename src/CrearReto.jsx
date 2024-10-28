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
            const response = await fetch('http://localhost:3000/crear-reto', {
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
                className="input-field"
                onChange={(e) => setTitulo(e.target.value)}
            />
            <textarea
                placeholder="Descripción del reto"
                value={descripcion}
                className="textarea-field"
                onChange={(e) => setDescripcion(e.target.value)}
            />
            <select
                value={lenguaje}
                className="select-field"
                onChange={(e) => setLenguaje(e.target.value)} // Manejo del lenguaje
            >
                <option value="" disabled>Selecciona el lenguaje del reto</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
                <option value="Java">Java</option>
                <option value="C#">C#</option>
                <option value="PHP">PHP</option>
                <option value="Ruby">Ruby</option>
                <option value="Swift">Swift</option>
            </select>
            <button className="submit-button" onClick={handleSubmit}>Crear Reto</button>
        </div>
    );
};

export default CrearReto;

