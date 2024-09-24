import Header from './components/Header';
import Navbar from './components/Navbar';
import About from './components/About';
import Menu from './components/Menu';
import Contact from './components/Contact';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-16">
      <Navbar />
      <Header />
      <About />
      <Menu />
      <Contact />
    </div>
  );
};

export default LandingPage;
