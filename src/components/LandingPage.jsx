import Header from '../components/Header';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Menu from '../components/Menu';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Header />
      <About />
      <Menu />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;
