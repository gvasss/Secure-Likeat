import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Navbar from './layout/Navbar';
import UpButton from './layout/UpButton';
import Footer from './layout/Footer';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import Profile from './pages/Profile';

import Dashboard from './admin/Dashboard';
import EditUser from './admin/Users/EditUser';
import ViewUser from './admin/Users/ViewUser';
import AddAdmin from './admin/Users/AddAdmin';

import AddReview from './customer/AddReview';
import EditReview from './admin/Review/EditReview';
import ViewReview from './admin/Review/ViewReview';

import AddRestaurant from './client/AddRestaurant';
import EditRestaurant from './admin/Restaurant/EditRestaurant';
import ViewRestaurant from './admin/Restaurant/ViewRestaurant';

import RestaurantDetail from './pages/RestaurantDetail';
import ClientRestaurantReviews from './client/ClientRestaurantReviews';
import ClientRestaurant from './client/ClientRestaurant';
import CustomerReview from './customer/CustomerReview';

function App() {

  useEffect(() => {
    document.title = "LikEat";
  }, []);

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || "";
  });

  const isLoggedIn = userRole !== "";

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

  return (
    <div className="App">
      <Router>
        <Navbar userRole={userRole} setUserRole={setUserRole} />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/userlogin" element={<UserLogin setUserRole={setUserRole} />} />
            
            {isLoggedIn && (
              <>
                <Route path="/profile" element={<Profile />} />
                <Route path="/edituser/:id" element={<EditUser />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />

                <Route path="/clientrestaurant" element={<ClientRestaurant />} />
                <Route path="/restaurant/:id/reviews" element={<ClientRestaurantReviews />} />
                <Route path="/addrestaurant" element={<AddRestaurant />} />
                <Route path="/editrestaurant/:id" element={<EditRestaurant />} />
                <Route path="/viewrestaurant/:id" element={<ViewRestaurant />} />

                <Route path="/customerreview" element={<CustomerReview />} />
                <Route path="/addreview/:id" element={<AddReview />} />
                <Route path="/editreview/:id" element={<EditReview />} />
                <Route path="/viewreview/:id" element={<ViewReview />} />

                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/viewuser/:id" element={<ViewUser />} />
                <Route path="/addadmin" element={<AddAdmin />} />
              </>
            )}

            {!isLoggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
          </Routes>
        </div>
        <UpButton />
      </Router>
      <Footer />
    </div>
  );
}

export default App;
