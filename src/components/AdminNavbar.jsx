import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase'; // Importa Firebase Auth
import { signOut } from 'firebase/auth'; // Importa el método de cierre de sesión

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú desplegable
  const navigate = useNavigate(); // Para redirigir después de cerrar sesión

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra la sesión en Firebase
      navigate('/login'); // Redirige al usuario a la página de login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Alterna el estado del menú
  };

  return (
    <nav className="fixed top-0 left-0 w-full text-white py-4 shadow-md z-10 bg-black">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold">Admin Panel</div>
        {/* Botón para abrir/cerrar el menú en vista móvil */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden focus:outline-none bg-white text-black px-4 py-2 rounded-lg"
        >
          {isOpen ? 'Cerrar' : 'Menú'}
        </button>

        {/* Menú desplegable */}
        <ul 
          className={`flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 transition-all duration-300 ease-in-out 
                      ${isOpen ? 'absolute top-full left-0 bg-black w-full py-4 md:py-0 md:relative md:w-auto' : 'hidden md:flex'}`}
        >
          <li className="text-center">
            <Link to="/upload-images" className="block px-4 py-2 hover:bg-gray-700 rounded-md transition-all text-white">
              Subir Imagen
            </Link>
          </li>
          <li className="text-center">
            <Link to="/" className="block px-4 py-2 hover:bg-gray-700 rounded-md transition-all text-white">
              Volver al Inicio
            </Link>
          </li>
          <li className="text-center">
            <Link 
              to="/login" 
              className="block px-4 py-2 hover:bg-gray-700 rounded-md transition-all text-white" 
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
