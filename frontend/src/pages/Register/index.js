import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:8000/register', { username, email, password });
        if (response.status === 200) {
          // Redireciona para o login após registro bem-sucedido
          navigate('/');
        }
      } catch (err) {
        setError('Erro ao registrar. Tente novamente.');
      }
    };
  
    return (
      <div className="register-container">
        <h1>Registro</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Registrar</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    );
  }
  
  export default Register;
  