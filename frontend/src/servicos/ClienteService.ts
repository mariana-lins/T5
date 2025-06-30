import axios from 'axios';
import { Cliente, CPF, RG, Telefone, Endereco } from '../modelo';
import { API_CONFIG } from '../config/api';

// Configuração base da API
const API_BASE_URL = API_CONFIG.baseURL;

// Interface para o formato de dados que a API espera/retorna
interface ClienteAPI {
  id?: number;
  nome: string;
  sobreNome: string;
  email?: string | null;
  endereco?: {
    id: number;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    codigoPostal: string;
    informacoesAdicionais: string;
  };
  telefones: Array<{
    id: number;
    ddd: string;
    numero: string;
  }>;
  links?: Array<any>;
}

// Interface estendida do Cliente para incluir ID
export interface ClienteComID extends Cliente {
  id?: number;
}

export class ClienteService {
  
  /**
   * Busca todos os clientes da API
   */
  static async listarClientes(): Promise<ClienteComID[]> {
    try {
      const response = await axios.get<ClienteAPI[]>(`${API_BASE_URL}/clientes`, {
        headers: {
          'Accept': 'application/json; charset=utf-8'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Aceita 2xx e 3xx (incluindo 302)
        }
      });
      return response.data.map(clienteAPI => this.converterAPIParaModelo(clienteAPI));
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw new Error('Erro ao buscar clientes do servidor');
    }
  }

  /**
   * Busca um cliente específico por ID
   */
  static async buscarClientePorId(id: number): Promise<ClienteComID> {
    try {
      const response = await axios.get<ClienteAPI>(`${API_BASE_URL}/cliente/${id}`, {
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      return this.converterAPIParaModelo(response.data);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw new Error('Erro ao buscar cliente do servidor');
    }
  }

  /**
   * Cadastra um novo cliente na API
   */
  static async cadastrarCliente(cliente: Cliente): Promise<ClienteComID> {
    try {
      const clienteAPI = this.converterModeloParaAPI(cliente);
      const response = await axios.post<ClienteAPI>(`${API_BASE_URL}/cliente/cadastrar`, clienteAPI, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      
      // Se o backend retornar vazio (status 200/201), considera como sucesso
      if (!response.data || Object.keys(response.data).length === 0) {
        const clienteComId = this.converterAPIParaModelo({
          ...clienteAPI,
          id: Date.now(), // ID temporário até a próxima listagem
          endereco: {
            ...clienteAPI.endereco,
            id: Date.now() + 1 // ID temporário para o endereço
          },
          telefones: clienteAPI.telefones.map((t: any, index: number) => ({ 
            id: index + 1, 
            ...t 
          }))
        });
        return clienteComId;
      }
      
      return this.converterAPIParaModelo(response.data);
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      throw new Error('Erro ao cadastrar cliente no servidor');
    }
  }

  /**
   * Atualiza um cliente existente na API
   */
  static async atualizarCliente(id: number, cliente: Cliente): Promise<ClienteComID> {
    try {
      const clienteAPI = this.converterModeloParaAPI(cliente);
      // Adiciona o ID no objeto para atualização
      (clienteAPI as any).id = id;
      
      const response = await axios.put<ClienteAPI>(`${API_BASE_URL}/cliente/atualizar`, clienteAPI, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      
      // Se o backend retornar vazio (status 200), considera como sucesso
      if (!response.data || Object.keys(response.data).length === 0) {
        const clienteComId = this.converterAPIParaModelo({
          ...clienteAPI,
          id: id,
          endereco: {
            ...clienteAPI.endereco,
            id: Date.now() + 1
          },
          telefones: clienteAPI.telefones.map((t: any, index: number) => ({ 
            id: index + 1, 
            ...t 
          }))
        });
        return clienteComId;
      }
      
      return this.converterAPIParaModelo(response.data);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw new Error('Erro ao atualizar cliente no servidor');
    }
  }

  /**
   * Exclui um cliente da API
   */
  static async excluirCliente(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/cliente/excluir`, {
        data: { id },
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw new Error('Erro ao excluir cliente do servidor');
    }
  }

  /**
   * Converte dados da API para o modelo do front-end
   */
  private static converterAPIParaModelo(clienteAPI: ClienteAPI): ClienteComID {
    // Usa valores padrão para campos que são apenas do frontend
    const cpf = new CPF('000.000.000-00');
    const genero = 'Não informado';
    const cliente = new Cliente(
      clienteAPI.nome,
      clienteAPI.sobreNome || clienteAPI.nome,
      cpf,
      genero
    ) as ClienteComID;
    cliente.id = clienteAPI.id;
    // RG: valor padrão para frontend
    const rg = new RG('00.000.000-0');
    cliente.adicionarRG(rg);
    clienteAPI.telefones.forEach(telefoneAPI => {
      const telefone = new Telefone(telefoneAPI.ddd, telefoneAPI.numero);
      cliente.adicionarTelefone(telefone);
    });
    // Adiciona endereço se vier do backend
    if (clienteAPI.endereco) {
      cliente.endereco = new Endereco(
        clienteAPI.endereco.estado,
        clienteAPI.endereco.cidade,
        clienteAPI.endereco.bairro,
        clienteAPI.endereco.rua,
        clienteAPI.endereco.numero,
        clienteAPI.endereco.codigoPostal,
        clienteAPI.endereco.informacoesAdicionais
      );
    }
    return cliente;
  }

  /**
   * Converte modelo do front-end para formato da API
   */
  private static converterModeloParaAPI(cliente: Cliente): any {
    return {
      nome: cliente.nome,
      sobreNome: cliente.nomeSocial,
      genero: cliente.genero, // <-- garantir envio do campo genero
      cpf: cliente.getCpf?.getValor || '',
      rg: cliente.getRgs && cliente.getRgs.length > 0 ? cliente.getRgs[0].getValor : '',
      email: null,
      endereco: cliente.endereco ? {
        estado: cliente.endereco.estado,
        cidade: cliente.endereco.cidade,
        bairro: cliente.endereco.bairro,
        rua: cliente.endereco.rua,
        numero: cliente.endereco.numero,
        codigoPostal: cliente.endereco.codigoPostal,
        informacoesAdicionais: cliente.endereco.informacoesAdicionais || ''
      } : {
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        codigoPostal: '',
        informacoesAdicionais: ''
      },
      telefones: cliente.getTelefones.map(telefone => ({
        ddd: telefone.getDdd,
        numero: telefone.getNumero
      }))
    };
  }
}
