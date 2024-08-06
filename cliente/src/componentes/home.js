import React, { useState } from 'react';
import SideBar from '../componentes/SideBar';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <h1>Home Page</h1>
      <p>Welcome to the Home page!</p>
    </div>
  );
};

export default Home;
