import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/dashboard', { withCredentials: true });
        if (response.status === 200) {
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do dashboard:', error);
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/logout', { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Bem-vindo, {username}!</h1>
        <nav>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main>
        <h2>Painel de Controle</h2>
      </main>
    </div>
  );
}

export default Dashboard;