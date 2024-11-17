import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProdutosLista = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({ nome: '', descricao: '', tipo: '', imagem: null });

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/produtos');
        setProdutos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
    fetchProdutos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNovoProduto({ ...novoProduto, [name]: files[0] });
    } else {
      setNovoProduto({ ...novoProduto, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nome', novoProduto.nome);
    formData.append('descricao', novoProduto.descricao);
    formData.append('tipo', novoProduto.tipo);
    formData.append('imagem', novoProduto.imagem);

    try {
      await axios.post('http://localhost:8000/produtos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const handleUpdate = async (id, updatedProduto) => {
    try {
      await axios.put(`http://localhost:8000/produtos/${id}`, updatedProduto);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/produtos/${id}`);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  return (
    <div className="ProdutosLista">
      <h1>Gerenciamento de Produtos</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="nome" placeholder="Nome do Produto" required onChange={handleInputChange} />
        <input type="text" name="descricao" placeholder="Descrição" required onChange={handleInputChange} />
        <input type="text" name="tipo" placeholder="Tipo" required onChange={handleInputChange} />
        <input type="file" name="imagem" accept="image/*" required onChange={handleInputChange} />
        <button type="submit">Adicionar Produto</button>
      </form>

      <ul>
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <li key={produto.id}>
              <img src={produto.imagemURL} alt={produto.nome} width="100" />
              <h2>Nome: {produto.nome}</h2>
              <p>Descrição: {produto.descricao}</p>
              <p>Tipo: {produto.tipo}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updatedProduto = {
                    nome: e.target.nome.value,
                    descricao: e.target.descricao.value,
                    tipo: e.target.tipo.value,
                  };
                  handleUpdate(produto.id, updatedProduto);
                }}
              >
                <input type="text" name="nome" defaultValue={produto.nome} required />
                <input type="text" name="descricao" defaultValue={produto.descricao} required />
                <input type="text" name="tipo" defaultValue={produto.tipo} required />
                <button type="submit">Atualizar Produto</button>
              </form>
              <button onClick={() => handleDelete(produto.id)}>Deletar Produto</button>
            </li>
          ))
        ) : (
          <p>Carregando produtos...</p>
        )}
      </ul>
    </div>
  );
};

export default ProdutosLista;