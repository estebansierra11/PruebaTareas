// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
//import SideBar from './componentes/SideBar';
import Home from './componentes/home';
import Login from './componentes/login';
import TaskList from './componentes/TaskList';
import './App.css'; 

const App = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Router>
            <div className="App">
                {/*<SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />*/}
               
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirige la ruta base a "/TaskList" */}
                        <Route path="/Home" element={<Home />} />
                        <Route path="/TaskList" element={<TaskList />} />
                        <Route path="/login" element={<Login />} />
                        {/* Agrega rutas adicionales según sea necesario */}
                    </Routes>
              
            </div>
        </Router>
    );
};

export default App;
