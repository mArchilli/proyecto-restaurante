import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Seguimos usando Link
import { auth } from '../services/firebase'; // Importa Firebase Auth

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú desplegable
  // const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para saber si el usuario está autenticado
  const [setIsAuthenticated] = useState(false); 

  // Efecto para verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true); // Si hay usuario, está autenticado
      } else {
        setIsAuthenticated(false); // Si no, no está autenticado
      }
    });

    // Limpia el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Alternar el estado
  };

  return (
    <nav className="fixed top-0 left-0 w-full text-white py-4 shadow-md z-10 bg-black">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold "><a href="#header" className='text-white'>Tosca La Fundicion</a></div>
        <button 
          onClick={toggleMenu} 
          className="md:hidden focus:outline-none bg-white text-black"
        >
          {isOpen ? 'Cerrar' : 'Menú'}
        </button>
        <ul className={`flex space-x-4 z-10 ${isOpen ? 'flex-col absolute top-full left-0 bg-black w-full ' : 'hidden md:flex'}`}>
          <li><a href="#about" className="hover:text-gray-300 text-white">Sobre Nosotros</a></li>
          <li><a href="#menu" className="hover:text-gray-300 text-white">Menú</a></li>
          <li><a href="#contact" className="hover:text-gray-300 text-white">Ubicacion</a></li>
          
          {/* Aquí se renderiza condicionalmente el Link según el estado de autenticación */}
          {/* {isAuthenticated ? (
            <li>
              <Link to="/upload-images" className="hover:text-gray-300 text-white">
                Panel de Administración
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/login" className="hover:text-gray-300 text-white">
                Ingresar
              </Link>
            </li>
          )} */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
