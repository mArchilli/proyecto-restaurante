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

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {error && <p className="text-red-500">{error}</p>} {/* Mostrar mensaje de error si existe */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Ingresar
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
