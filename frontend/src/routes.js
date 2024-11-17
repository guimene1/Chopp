import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProdutosLista from './pages/Produtos'

function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Produtos" element={<ProdutosLista />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;