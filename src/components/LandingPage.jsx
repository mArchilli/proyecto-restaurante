import Header from '../components/Header';
import Navbar from '../components/Navbar';
import About from '../components/About';
import GridMenu from '../components/GridMenu';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Header />
      <About />
      <GridMenu />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;
