import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import { auth } from '../services/firebase'; // Importa Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para almacenar el mensaje de error
  const navigate = useNavigate(); // Inicializa useNavigate para la redirección

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar el mensaje de error antes de intentar iniciar sesión
    try {
      // Intento de inicio de sesión con Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Redirige al componente UploadImages tras el inicio de sesión exitoso
      navigate('/upload-images');
      
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

  // Función para volver al inicio
  const goToHome = () => {
    navigate('/');
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-6xl font-bold text-center mb-4 font-DancingScript">Iniciar Sesión</h2>
          {error && <p className="text-red-500 text-center">{error}</p>} {/* Mostrar mensaje de error si existe */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded w-full"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded w-full"
          />
          <button type="submit" className="bg-black-500 text-white py-3 px-4 rounded w-full hover:bg-white hover:text-black">
            Ingresar
          </button>
          <button
            type="button"
            onClick={goToHome}
            className="bg-gray-500 text-white py-3 px-4 rounded w-full hover:bg-gray-600 mt-2"
          >
            Volver al Inicio
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
