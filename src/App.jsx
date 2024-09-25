import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa react-router-dom
import LandingPage from './components/LandingPage';
import Login from './components/Login'; // Importa el componente Login

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta principal para la landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Ruta para el componente de login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
