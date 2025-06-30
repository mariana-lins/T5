import axios from 'axios';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.baseURL;

export class RelatorioService {
  static async top10ClientesQuantidade() {
    const response = await axios.get(`${API_BASE_URL}/relatorios/top10-clientes-quantidade`);
    return response.data;
  }
  static async clientesPorGenero() {
    const response = await axios.get(`${API_BASE_URL}/relatorios/clientes-por-genero`);
    return response.data;
  }
  static async produtosMaisConsumidos() {
    const response = await axios.get(`${API_BASE_URL}/relatorios/produtos-mais-consumidos`);
    return response.data;
  }
  static async produtosPorGenero() {
    const response = await axios.get(`${API_BASE_URL}/relatorios/produtos-por-genero`);
    return response.data;
  }
  static async top10ClientesMenosConsumo() {
    const response = await axios.get(`${API_BASE_URL}/relatorios/top10-clientes-menos-consumo`);
    return response.data;
  }
  static async top5ClientesValor() {
    const response = await axios.get(`${API_BASE_URL}/relatorios/top5-clientes-valor`);
    return response.data;
  }
  static async servicosMaisConsumidos() {
    const response = await axios.get(`${API_BASE_URL}/relatorios/servicos-mais-consumidos`);
    return response.data;
  }
}
