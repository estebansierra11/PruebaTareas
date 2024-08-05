import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import './js/profileMenu.css';

const ProfileMenu = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', closeMenu);
        return () => {
            document.removeEventListener('click', closeMenu);
        };
    }, []);

    return (
        <div className="profile-menu" ref={menuRef}>
            <div className="profile-icon" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faUserCircle} size="2x" />
            </div>
            {isOpen && (

                <div className="menu">
                    <ul>
                        <li>
                            <button>
                                <FontAwesomeIcon icon={faUser} className="menu-icon" />
                                Perfil
                            </button>
                        </li>

                        <li>
                            <button onClick={onLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                                Cerrar Sesión
                            </button>
                        </li>

                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
