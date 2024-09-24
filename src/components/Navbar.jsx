import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú desplegable

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Alternar el estado
  };

  return (
    <nav className="fixed top-0 left-0 w-full text-white py-4 shadow-md z-10 bg-black">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold">Restaurante</div>
        <button 
          onClick={toggleMenu} 
          className="md:hidden focus:outline-none"
        >
          {isOpen ? 'Cerrar' : 'Menú'}
        </button>
        <ul className={`flex space-x-4 z-10 ${isOpen ? 'flex-col absolute top-full left-0 bg-black w-full ' : 'hidden md:flex'}`}>
          <li><a href="#header" className="hover:text-gray-300 text-white pl-4">Inicio</a></li>
          <li><a href="#about" className="hover:text-gray-300 text-white">Sobre Nosotros</a></li>
          <li><a href="#menu" className="hover:text-gray-300 text-white">Menú</a></li>
          <li><a href="#contact" className="hover:text-gray-300 text-white">Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;