import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/login';
import UploadImages from './components/uploadImages';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" 
        element={
          <ProtectedRoute>
            <UploadImages />
          </ProtectedRoute>
          } 
        /> 
      </Routes>
    </Router>
  );
};

export default App;
