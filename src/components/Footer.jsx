const Footer = () => {
    return (
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto text-center">
          <p className="mb-4">© 2024 Tasca la Fundicion - Todos los derechos reservados.</p>
          <div className="flex justify-center space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  