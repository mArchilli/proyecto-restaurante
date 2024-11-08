import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import UploadImages from './components/uploadImages';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
