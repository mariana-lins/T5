/**
 * Configuração centralizada da API
 * Permite alternar entre acesso direto e via proxy
 */

// Configuração da API
const API_CONFIG = {
  // Acesso direto (padrão)
  DIRECT: 'http://localhost:8080',
  
  // Via proxy do Vite (caso haja problemas de CORS)
  PROXY: '/api',
  
  // Configuração atual
  get baseURL() {
    // Em desenvolvimento, tenta usar acesso direto primeiro
    // Se houver problemas de CORS, mude para PROXY
    return this.DIRECT;
  }
};

export { API_CONFIG };
