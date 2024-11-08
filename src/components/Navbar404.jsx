import { useState } from 'react';
import { Link } from 'react-router-dom';


const Navbar404 = () => {
  const [isOpen, setIsOpen] = useState(false);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full py-4 z-10 transition-colors duration-300 bg-black">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold text-white">
          Tasca La Fundicion
        </div>

        {/* Botón para abrir/cerrar el menú en vista móvil */}
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
            <Link to="/" className="relative text-white hover:text-gray-300 transition duration-300">
              Volver al Sitio
            </Link>
          </li>
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar404;