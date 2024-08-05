import React, { useState } from 'react';
import axios from 'axios';

function Login({ setLoggedInUser, setLoggedInId }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    axios.post('http://localhost/prueba/servidor/api.php?action=login', { username, password })
      .then(response => {
        setMessage(response.data.message);
        if (response.data.username) {
          setLoggedInUser(response.data.username);
          setLoggedInId(response.data.id);
        }
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
      });
  };

  return (
    <div className="card p-4">
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
  );
}

export default Login;
