import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import '@fortawesome/fontawesome-free/css/all.min.css';

import AuthProvider from './context/AuthContext'
import ProtectedRoute from './misc/ProtectedRoute';

// Components
import Navbar from './layout/Navbar'
import UpButton from './layout/UpButton';
import Footer from './layout/Footer';

// Public endpoints
import Login from './components/login/SignInUp';
import Home from './components/pages/Home'
// User endpoints
import Profile from './components/pages/Profile';
import EditUser from './components/user/EditUser';
import RestaurantDetail from './components/pages/RestaurantDetail';
// Client endpoints
import ClientRestaurant from './components/user/client/ClientRestaurant';
import AddRestaurant from './components/user/client/AddRestaurant';
import EditRestaurant from './components/user/client/EditRestaurant';
import ViewRestaurant from './components/user/client/ViewRestaurant';
import ClientRestaurantReviews from './components/user/client/ClientRestaurantReviews';
// Customer endpoints
import CustomerReview from './components/user/customer/CustomerReview';
import AddReview from './components/user/customer/AddReview';
// Admin endpoints
import Dashboard from './components/user/admin/Dashboard';
import ViewUser from './components/user/admin/ViewUser';
import AddAdmin from './components/user/admin/AddAdmin';
import ViewReview from './components/user/admin/ViewReview';

function App() {
  
  return (
    <AuthProvider>
      <div className="app-container">
        <Router>
          <Navbar />   
          <main className="main-content">     
            <Routes>
              {/* Public endpoints */}
              <Route path='/' element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              {/* User endpoints */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/edituser/:id" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
              <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetail /></ProtectedRoute>} />
              {/* Client endpoints */}
              <Route path="/client/restaurants" element={<ProtectedRoute><ClientRestaurant /></ProtectedRoute>} />
              <Route path="/addrestaurant" element={<ProtectedRoute><AddRestaurant /></ProtectedRoute>} />
              <Route path="/editrestaurant/:id" element={<ProtectedRoute><EditRestaurant /></ProtectedRoute>} />
              <Route path="/viewrestaurant/:id" element={<ProtectedRoute><ViewRestaurant /></ProtectedRoute>} />
              <Route path="/restaurant/:id/reviews" element={<ProtectedRoute><ClientRestaurantReviews /></ProtectedRoute>} />
              {/* Customer endpoints */}
              <Route path="/customer/reviews" element={<ProtectedRoute><CustomerReview /></ProtectedRoute>} />
              <Route path="/addreview/:id" element={<ProtectedRoute><AddReview /></ProtectedRoute>} />
              {/* Customer endpoints */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/viewuser/:id" element={<ProtectedRoute><ViewUser /></ProtectedRoute>} />
              <Route path="/addadmin" element={<ProtectedRoute><AddAdmin /></ProtectedRoute>} />
              <Route path="/viewreview/:id" element={<ProtectedRoute><ViewReview /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </Router>
        <UpButton />
      </div>
    </AuthProvider>
  );
}

export default App