import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchTrips from './pages/SearchTrips';
import TripDetails from './pages/TripDetails';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchTrips />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
              <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            </Routes>
          </div>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;