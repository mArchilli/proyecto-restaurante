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
        <Route path="/upload-images" element={<UploadImages />} /> {/* Añadir ruta para UploadImages */}
      </Routes>
    </Router>
  );
};

export default App;
