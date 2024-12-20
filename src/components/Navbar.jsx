import { useState, useEffect } from 'react';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú desplegable
  const [navbarBackground, setNavbarBackground] = useState('transparent'); // Estado para el background del navbar


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

    // Cambiar el color de fondo del navbar al abrir/cerrar el menú
    if (!isOpen) {
      setNavbarBackground('bg-black'); // Al abrir el menú, fondo negro
    } else {
      setNavbarBackground('bg-transparent'); // Al cerrar el menú, fondo transparente
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full py-4 z-10 transition-colors duration-300 ${navbarBackground}`}>
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold">
          <a
            href="#header"
            className="relative text-white py-2 hover:text-gray-300 transition duration-300 transform scale-100 hover:scale-110 before:absolute before:content-[''] before:w-0 before:h-[2px] before:bg-white before:bottom-0 before:left-1/2 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0"
          >
            Tasca La Fundicion
          </a>
        </div>

        {/* Botón de Menú para vista móvil */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none bg-white text-black py-2 px-3 rounded transition duration-300 hover:bg-gray-200"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
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
              className="relative text-white hover:text-gray-300 transition duration-300"
            >
              Sobre Nosotros
            </a>
          </li>
          <li className="py-2 px-4">
            <a
              href="#menu"
              className="relative text-white hover:text-gray-300 transition duration-300"
            >
              Menú
            </a>
          </li>
          <li className="py-2 px-4">
            <a
              href="#contact"
              className="relative text-white hover:text-gray-300 transition duration-300"
            >
              Ubicación
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
