import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- CONTEXT PROVIDERS ---
import { CartProvider } from './context/CartContext';
import { UserProvider, useUser } from './context/UserContext';

// --- CSS IMPORTS ---
import './assets/css/style.css'; 
import './assets/css/latest_style.css';

// --- PAGE IMPORTS ---
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/user/Profile';

// --- ROUTING COMPONENTS ---
import ProtectedRoute from './routing/ProtectedRoute';
import AdminProtectedRoute from './routing/AdminProtectedRoute';

// --- ADMIN PAGE IMPORTS ---
import AdminDashboard from './pages/admin/AdminDashboard';

// This helper component redirects logged-in users away from the login/signup pages.
const AuthRedirect = () => {
    const { userInfo } = useUser();
    return !userInfo ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* ========================================
                PUBLIC ROUTES (ACCESSIBLE TO EVERYONE)
            =========================================== */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* ========================================
                AUTHENTICATION ROUTES (FOR GUESTS)
            =========================================== */}
            <Route element={<AuthRedirect />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* ========================================
                USER PROTECTED ROUTES (LOGGED-IN USERS)
            =========================================== */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
            
            {/* ========================================
                ADMIN PROTECTED ROUTES (LOGGED-IN ADMINS)
            =========================================== */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Future admin routes like /admin/products can be added here */}
            </Route>

          </Routes>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;