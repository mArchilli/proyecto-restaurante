import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from '../components/Header';
import Navbar from '../components/Navbar';
import About from '../components/About';
import GridMenu from '../components/GridMenu';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de las animaciones en milisegundos
      once: true,     // Si `true`, la animación se activa solo una vez al hacer scroll
    });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Header />
      <div data-aos="fade-right">
        <About />
      </div>
      <div data-aos="fade-right">
        <GridMenu />
      </div>
      <div data-aos="fade-right">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
