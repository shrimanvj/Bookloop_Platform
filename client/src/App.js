import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import BookRequest from './components/BookRequest';
import Upload from './components/Upload';
import Discussion from './components/Discussion';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import About from './components/About';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import './App.css';

// Private Route component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Navigation component
const Navigation = () => {
    const { isAuthenticated, logout } = useAuth();
    
    return (
        <nav className="main-nav">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <div className="logo-icon"></div>
                    BookLoop
                </Link>
                <div className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/requests" className="nav-link">Request Books</Link>
                            <Link to="/profile" className="nav-link">Profile</Link>
                            <button onClick={logout} className="logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="nav-link">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navigation />
                    <main>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route 
                                path="/requests" 
                                element={
                                    <PrivateRoute>
                                        <BookRequest />
                                    </PrivateRoute>
                                } 
                            />
                            <Route 
                                path="/profile" 
                                element={
                                    <PrivateRoute>
                                        <Profile />
                                    </PrivateRoute>
                                } 
                            />
                            <Route 
                                path="/upload/:requestId" 
                                element={
                                    <PrivateRoute>
                                        <Upload />
                                    </PrivateRoute>
                                } 
                            />
                            <Route 
                                path="/discussion/:bookId" 
                                element={
                                    <PrivateRoute>
                                        <Discussion />
                                    </PrivateRoute>
                                } 
                            />
                        </Routes>
                    </main>
                    <footer className="main-footer">
                        <div className="footer-content">
                            <p>&copy; 2024 BookLoop. All rights reserved.</p>
                            <div className="footer-links">
                                <Link to="/about">About</Link>
                                <Link to="/terms">Terms</Link>
                                <Link to="/privacy">Privacy</Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
