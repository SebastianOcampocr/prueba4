import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegistroCoder.css';
import muneno1 from './templates/muñeco1.png';

const Registrocoder = () => {
    const [numeroCelular, setNumeroCelular] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [edad, setEdad] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Navegación para redirigir después del registro

   const handleSubmit = async () => {
    if (!numeroCelular || !nombreCompleto || !edad || !contrasena) {
        setError('Por favor, rellena todos los campos.');
        return; // Asegúrate de salir de la función si hay un error
    } else {
        setError('');
        // Intentar registrarse
        try {
            const response = await fetch('https://timedata-ruddy.vercel.app/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: nombreCompleto,
                    password: contrasena,
                    accountType: 'Coder', // Agregar el tipo de cuenta
                    phone: numeroCelular, // Asegúrate de enviar el número de celular aquí
                }),
            });

            const responseData = await response.json(); // Leer el cuerpo como JSON

            if (!response.ok) {
                // Si no es ok, lanza un error con el mensaje del servidor
                throw new Error(responseData.message || 'Error en el registro');
            }

            console.log(responseData); // Aquí puedes manejar la respuesta

            // Iniciar sesión automáticamente
            const loginResponse = await fetch('https://timedata-ruddy.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: numeroCelular, // Usar el número de celular para iniciar sesión
                    password: contrasena,
                }),
            });

            const loginData = await loginResponse.json(); // Leer el cuerpo de la respuesta de inicio de sesión

            if (!loginResponse.ok) {
                // Si no es ok, lanza un error con el mensaje del servidor
                throw new Error(loginData.message || 'Error al iniciar sesión automáticamente');
            }

            console.log(loginData); // Manejar los datos de inicio de sesión

            // Redirigir después de registrarse e iniciar sesión
            navigate('/cuenta', { state: { accountType: 'Coder', user: loginData.user } });
        } catch (error) {
            setError('Error al registrarse: ' + error.message);
        }
    }
};

    return (
        <div className="registrocoder">
            <div className="registro-del-coder-parent">
                <div className="registro-del-coder">Registro del Coder</div>
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
                <div className="email">
                    <div className="correo-celular-wrapper">
                        <div className="correo-celular">Edad</div>
                    </div>
                    <select 
                        className="escribirlo"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                    >
                        <option value="">Seleccione edad</option>
                        {Array.from({ length: 100 }, (_, i) => (
                            <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>
                <div className="contrasea">
                    <div className="correo-celular-wrapper">
                        <div className="correo-celular">Contraseña</div>
                        <div className="ocultar">
                            <div className="ojo" />
                            <div className="ocultar1" />
                        </div>
                    </div>
                    <input 
                        type="password" 
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
                    <a href="/help" className="help-link">¿Necesitas ayuda?</a>
                </div>
            </div>
            <div className="ya-tienes-una-container">
                <span>{`¿Ya tienes una cuenta? `}</span>
                <Link to="/iniciarsecion" className="iniciar-sesion">
                    Iniciar sesión
                </Link>
            </div>
            <img className="mueco1-icon" alt="" src={muneno1} />
        </div>
    );
};

export default Registrocoder;
