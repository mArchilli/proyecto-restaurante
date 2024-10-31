import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/login';
import UploadImages from './components/uploadImages'; // Asegúrate de importar tu componente

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<UploadImages />} /> {/* Añadir ruta para panel de administracion */}
      </Routes>
    </Router>
  );
};

export default App;
