import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        axios.post('http://localhost/prueba/servidor/api.php?action=login', { username, password })
            .then(response => {
                setMessage(response.data.message);
                if (response.data.username) {
                    onLogin(response.data.username, response.data.id);
                    navigate('/TaskList');
                }
            })
            .catch(error => {
                console.error('Error logging in!', error);
            });
    };

    return (
        <div className='content-login'>
            <div className="card p-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h1 className="mb-4">Login</h1>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control mb-2"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary mb-2" onClick={handleLogin}>Login</button>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Login;
