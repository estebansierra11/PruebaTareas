import React from 'react';
import { Link } from 'react-router-dom';
import './js/SideBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faEnvelope, faBars, faTimes, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const SideBar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>
            <div className="sidebar-content">
                <ul>
                    <li title='Inicio'>
                        <Link to="/home">
                            <FontAwesomeIcon icon={faHome} />
                            {isOpen && <span>Inicio</span>}
                        </Link>
                    </li>
                    <li title='Tareas'>
                        <Link to="/TaskList">
                            <FontAwesomeIcon icon={faClipboardList} />
                            {isOpen && <span>Tareas</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/login">
                            <FontAwesomeIcon icon={faUsers} />
                            {isOpen && <span>Empleados</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact">
                            <FontAwesomeIcon icon={faEnvelope} />
                            {isOpen && <span>Info</span>}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
