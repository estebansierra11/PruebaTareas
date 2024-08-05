// App.js
import React, { useState } from 'react';
import SideBar from './componentes/SideBar';
//import Login from './componentes/login';
import './App.css';
import TaskList from './componentes/TaskList';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App">
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`content ${isOpen ? 'content-shift' : ''}`}>
        <TaskList/>
      </div>
    </div>
  );
};

export default App;
