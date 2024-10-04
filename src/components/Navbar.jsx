import { useState, useEffect } from 'react';
import { auth } from '../services/firebase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú desplegable
  const [setIsAuthenticated] = useState(false); // Cambié esto para que funcione correctamente
  const [navbarBackground, setNavbarBackground] = useState('transparent'); // Estado para el background del navbar

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

  // Efecto para cambiar el background del navbar en función del scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarBackground('bg-black'); // Cambia a negro después de hacer scroll
      } else {
        setNavbarBackground('bg-transparent'); // Transparente al estar en el tope de la página
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Limpia el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Alternar el estado del menú
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full py-4 z-10 transition-colors duration-300 ${navbarBackground}`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold">
          <a href="#header" className="relative text-white py-2 hover:text-gray-300 transition duration-300 transform scale-100 hover:scale-110 before:absolute before:content-[''] before:w-0 before:h-[2px] before:bg-white before:bottom-0 before:left-1/2 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0">
            Tosca La Fundicion
          </a>
        </div>
        <button 
          onClick={toggleMenu} 
          className="md:hidden focus:outline-none bg-white text-black"
        >
          {isOpen ? 'Cerrar' : 'Menú'}
        </button>
        <ul className={`flex space-x-4 z-10 ${isOpen ? 'flex-col absolute top-full left-0 bg-black w-full ' : 'hidden md:flex'}`}>
          <li><a href="#about" className="relative text-white py-2 hover:text-gray-300 transition duration-300 before:absolute before:content-[''] before:w-0 before:h-[2px] before:bg-white before:bottom-0 before:left-1/2 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0">Sobre Nosotros</a></li>
          <li><a href="#menu" className="relative text-white py-2 hover:text-gray-300 transition duration-300 before:absolute before:content-[''] before:w-0 before:h-[2px] before:bg-white before:bottom-0 before:left-1/2 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0">Menú</a></li>
          <li><a href="#contact" className="relative text-white py-2 hover:text-gray-300 transition duration-300 before:absolute before:content-[''] before:w-0 before:h-[2px] before:bg-white before:bottom-0 before:left-1/2 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0">Ubicación</a></li>

          
          {/* Aquí se renderiza condicionalmente el Link según el estado de autenticación
          {isAuthenticated ? (
            <li>
              <a href="/upload-images" className="hover:text-gray-300 text-white">
                Panel de Administración
              </a>
            </li>
          ) : (
            <li>
              <a href="/login" className="hover:text-gray-300 text-white">
                Ingresar
              </a>
            </li>
          )} */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
