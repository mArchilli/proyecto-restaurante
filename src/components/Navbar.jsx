import { useState, useEffect } from 'react';
import { auth } from '../services/firebase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú desplegable
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación del usuario
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
          <a
            href="#header"
            className="relative text-white py-2 hover:text-gray-300 transition duration-300 transform scale-100 hover:scale-110 before:absolute before:content-[''] before:w-0 before:h-[2px] before:bg-white before:bottom-0 before:left-1/2 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0"
          >
            Tosca La Fundicion
          </a>
        </div>

        {/* Botón de Menú para vista móvil */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none bg-white text-black py-2 px-3 rounded transition duration-300 hover:bg-gray-200"
        >
          {isOpen ? 'Cerrar' : 'Menú'}
        </button>

        {/* Menú */}
        <ul
          className={`flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 absolute md:relative top-full left-0 w-full md:w-auto transition-all duration-300 transform md:transform-none ${
            isOpen ? 'opacity-100 bg-black' : 'opacity-0 pointer-events-none'
          } md:opacity-100 md:pointer-events-auto md:bg-transparent`}
        >
          <li className="py-2 px-4">
            <a
              href="#about"
              className="relative text-white hover:text-gray-300 transition duration-300 before:absolute before:content-[''] before:w-0 before:h-[2px] before:bg-white before:bottom-0 before:left-1/2 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0"
            >
              Sobre Nosotros
            </a>
          </li>
          <li className="py-2 px-4">
            <a
              href="#menu"
              className="relative text-white hover:text-gray-300 transition duration-300 before:absolute before:content-[''] before:w-0 before:h-[2px] before:bg-white before:bottom-0 before:left-1/2 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0"
            >
              Menú
            </a>
          </li>
          <li className="py-2 px-4">
            <a
              href="#contact"
              className="relative text-white hover:text-gray-300 transition duration-300 before:absolute before:content-[''] before:w-0 before:h-[2px] before:bg-white before:bottom-0 before:left-1/2 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0"
            >
              Ubicación
            </a>
          </li>

          {/* Renderiza condicionalmente el enlace de Panel de Administración o Ingresar */}
          {isAuthenticated ? (
            <li className="py-2 px-4">
              <a
                href="/upload-images"
                className="relative text-white hover:text-gray-300 transition duration-300"
              >
                
              </a>
            </li>
          ) : (
            <li className="py-2 px-4">
              <a
                href="/login"
                className="relative text-white hover:text-gray-300 transition duration-300"
              >
                
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
