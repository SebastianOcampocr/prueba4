import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegistroCrafter.css';
import muneno2 from './templates/muñeco2.png';

const Registrocrafter = () => {
    const [numeroCelular, setNumeroCelular] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!numeroCelular || !nombreCompleto || !contrasena) {
            setError('Por favor, rellena todos los campos.');
            return; // Agregar un retorno aquí para evitar seguir ejecutando el código
        }
        setError('');

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: nombreCompleto,
                    phone: numeroCelular, // Cambiado de email a phone
                    password: contrasena,
                    accountType: 'Crafter',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Obtener datos del error
                throw new Error(errorData.message || 'Error en el registro');
            }

            const data = await response.json();
            console.log(data);

            // Iniciar sesión automáticamente
            const loginResponse = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: numeroCelular, // Cambiado de email a phone
                    password: contrasena,
                }),
            });

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json(); // Obtener datos del error
                throw new Error(errorData.message || 'Error al iniciar sesión automáticamente');
            }

            const loginData = await loginResponse.json();
            console.log(loginData);

            navigate('/cuenta', { state: { accountType: 'Crafter', user: loginData.user } });
        } catch (error) {
            setError('Error al registrarse: ' + error.message);
        }
    };

    return (
        <div className="registrocrafter">
            <div className="registro-del-crafter-parent">
                <div className="registro-del-crafter">Registro del Crafter</div>
                <div className="email">
                    <div className="correo-celular-wrapper">
                        <div className="correo-celular">Número de celular</div>
                    </div>
                    <input 
                        type="text" 
                        className="escribirlo" 
                        value={numeroCelular}
                        onChange={(e) => setNumeroCelular(e.target.value)}
                    />
                </div>
                <div className="email">
                    <div className="correo-celular-wrapper">
                        <div className="correo-celular">Nombre completo</div>
                    </div>
                    <input 
                        type="text" 
                        className="escribirlo" 
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                    />
                </div>
                <div className="contrasea">
                    <div className="correo-celular-wrapper">
                        <div className="correo-celular">Contraseña</div>
                        <div className="ocultar" onClick={() => setShowPassword(!showPassword)}>
                            <div className="ojo" />
                            <div className="ocultar1" />
                        </div>
                    </div>
                    <input 
                        type={showPassword ? 'text' : 'password'} // Cambiar tipo según el estado
                        className="escribirlo" 
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button className="boton" onClick={handleSubmit}>
                    Registrarse
                </button>
                <div className="ayudaaa">
                    <a href="#" className="help-link">¿Necesitas ayuda?</a>
                </div>
            </div>
            <div className="ya-tienes-una-container">
                <span>{`¿Ya tienes una cuenta? `}</span>
                <Link to="/iniciarsecion" className="iniciar-sesion">
                    Iniciar sesión
                </Link>
            </div>
            <img className="mueco2-icon" alt="" src={muneno2} />
        </div>
    );
};

export default Registrocrafter;
