import axios from 'axios';
import { Produto } from '../modelo';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.baseURL;

export interface ProdutoComID extends Produto {
  id?: number;
}

export class ProdutoService {
  static async listarProdutos(): Promise<ProdutoComID[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/produtos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw new Error('Erro ao buscar produtos do servidor');
    }
  }

  static async obterProduto(id: number): Promise<ProdutoComID> {
    try {
      const response = await axios.get(`${API_BASE_URL}/produto/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter produto:', error);
      throw new Error('Erro ao buscar produto do servidor');
    }
  }

  static async cadastrarProduto(produto: Produto): Promise<ProdutoComID> {
    try {
      const response = await axios.post(`${API_BASE_URL}/produto/cadastrar`, produto);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      throw new Error('Erro ao cadastrar produto');
    }
  }

  static async atualizarProduto(produto: ProdutoComID): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/produto/atualizar`, produto);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Erro ao atualizar produto');
    }
  }

  static async excluirProduto(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/produto/excluir`, { data: { id } });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      throw new Error('Erro ao excluir produto');
    }
  }
}
