import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './componentes/home';
import Login from './componentes/login';
import TaskList from './componentes/TaskList';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = (username, id) => {
        setIsAuthenticated(true);
        setUser({ username, id });
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to={isAuthenticated ? "/TaskList" : "/login"} />} />
                    <Route path="/Home" element={isAuthenticated ? <Home/> : <Navigate to="/login" />} />
                    <Route path="/TaskList" element={isAuthenticated ? <TaskList user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
