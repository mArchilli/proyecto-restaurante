const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full text-white py-4 shadow-md z-10 bg-black">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold">
          Restaurante
        </div>
        <ul className="flex space-x-4">
          <li><a href="#header" className="hover:text-gray-300 text-white ">Inicio</a></li>
          <li><a href="#about" className="hover:text-gray-300 text-white ">Sobre Nosotros</a></li>
          <li><a href="#menu" className="hover:text-gray-300 text-white ">Menú</a></li>
          <li><a href="#contact" className="hover:text-gray-300 text-white ">Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
