import React, { useState } from 'react';
import SideBar from '../componentes/SideBar';
import '../App.css';
const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    
    <div className={`content ${isOpen ? 'content-shift' : ''}`}>
        <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <h1>Home Page</h1>
        <p>Welcome to the Home page!</p>
      </div>
    
  );
};

export default Home;
