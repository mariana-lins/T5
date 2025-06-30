import axios from 'axios';
import { Servico } from '../modelo';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.baseURL;

export interface ServicoComID extends Servico {
  id?: number;
}

export class ServicoService {
  static async listarServicos(): Promise<ServicoComID[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/servicos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      throw new Error('Erro ao buscar serviços do servidor');
    }
  }

  static async obterServico(id: number): Promise<ServicoComID> {
    try {
      const response = await axios.get(`${API_BASE_URL}/servico/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter serviço:', error);
      throw new Error('Erro ao buscar serviço do servidor');
    }
  }

  static async cadastrarServico(servico: Servico): Promise<ServicoComID> {
    try {
      const response = await axios.post(`${API_BASE_URL}/servico/cadastrar`, servico);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      throw new Error('Erro ao cadastrar serviço');
    }
  }

  static async atualizarServico(servico: ServicoComID): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/servico/atualizar`, servico);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw new Error('Erro ao atualizar serviço');
    }
  }

  static async excluirServico(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/servico/excluir`, { data: { id } });
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      throw new Error('Erro ao excluir serviço');
    }
  }
}
