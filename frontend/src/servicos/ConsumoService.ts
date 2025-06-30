import axios from 'axios';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.baseURL;

export interface ConsumoDTO {
  id?: number;
  clienteId?: number; // Para criação/atualização
  cliente?: { // Para leitura da API
    id: number;
    nome: string;
    sobreNome: string;
  };
  produtoId?: number; // Para criação/atualização
  produto?: { // Para leitura da API
    id: number;
    nome: string;
    preco: number;
  };
  servicoId?: number; // Para criação/atualização
  servico?: { // Para leitura da API
    id: number;
    nome: string;
    preco: number;
  };
  dataHora?: string;
  quantidade: number;
}

export class ConsumoService {
  static async listarConsumos(): Promise<ConsumoDTO[]> {
    const response = await axios.get(`${API_BASE_URL}/consumo/consumos`);
    return response.data;
  }

  static async cadastrarConsumo(consumo: ConsumoDTO): Promise<ConsumoDTO> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/consumo/cadastrar`,
        consumo,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar consumo:', error);
      throw error;
    }
  }

  static async atualizarConsumo(consumo: ConsumoDTO): Promise<ConsumoDTO> {
    const response = await axios.put(`${API_BASE_URL}/consumo/atualizar`, consumo);
    return response.data;
  }

  static async excluirConsumo(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/consumo/excluir`, { params: { id } });
  }
}
