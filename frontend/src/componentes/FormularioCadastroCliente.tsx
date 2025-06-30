import { useState, useCallback, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import type { PropsComEmpresa } from '../tipos';
import { Cliente, CPF, RG, Telefone } from '../modelo';

interface StateFormularioCliente {
  nome: string;
  nomeSocial: string;
  cpf: string;
  rg: string;
  telefone: string;
  genero: string;
  // Campos de endereço
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  codigoPostal: string;
  informacoesAdicionais: string;
  mensagem: string;
  tipoMensagem: 'success' | 'error' | 'info';
}

export default function FormularioCadastroCliente({ empresa, atualizarInterface, clientesAPI }: PropsComEmpresa) {
  const [state, setState] = useState<StateFormularioCliente>({
    nome: '',
    nomeSocial: '',
    cpf: '',
    rg: '',
    telefone: '',
    genero: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    codigoPostal: '',
    informacoesAdicionais: '',
    mensagem: '',
    tipoMensagem: 'info',
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      mensagem: ''
    }));
  }, []);

  const validarFormulario = useCallback((): boolean => {
    const { nome, cpf, rg, telefone, genero, estado, cidade, bairro, rua, numero, codigoPostal } = state;
    // Validação básica dos campos obrigatórios
    if (!nome || !cpf || !rg || !telefone || !genero || !estado || !cidade || !bairro || !rua || !numero || !codigoPostal) {
      setState(prev => ({
        ...prev,
        mensagem: 'Preencha todos os campos obrigatórios, incluindo endereço.',
        tipoMensagem: 'error'
      }));
      return false;
    }
    return true;
  }, [state]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validarFormulario()) {
      return;
    }
    try {
      const { nome, nomeSocial, cpf, rg, telefone, genero, estado, cidade, bairro, rua, numero, codigoPostal, informacoesAdicionais } = state;
      const novoCpf = new CPF(cpf);
      const novoRg = new RG(rg);
      const telefoneNumeros = telefone.replace(/\D/g, '');
      let ddd = '';
      let numeroTelefone = '';
      if (telefoneNumeros.length >= 10) {
        ddd = telefoneNumeros.substring(0, 2);
        numeroTelefone = telefoneNumeros.substring(2);
      } else {
        setState(prev => ({
          ...prev,
          mensagem: 'Telefone deve conter DDD e número completo (mínimo 10 dígitos)',
          tipoMensagem: 'error'
        }));
        return;
      }
      const novoTelefone = new Telefone(ddd, numeroTelefone);
      const novoCliente = new Cliente(nome, nomeSocial, novoCpf, genero);
      novoCliente.adicionarRG(novoRg);
      novoCliente.adicionarTelefone(novoTelefone);
      // Adiciona endereço ao cliente
      novoCliente.endereco = {
        estado,
        cidade,
        bairro,
        rua,
        numero,
        codigoPostal,
        informacoesAdicionais
      };
      // Tentar usar a API primeiro, depois fallback para empresa local
      if (clientesAPI?.adicionarCliente) {
        await clientesAPI.adicionarCliente(novoCliente);
        setState(prev => ({
          ...prev,
          mensagem: `Cliente ${nome} cadastrado com sucesso na API!`,
          tipoMensagem: 'success',
          nome: '',
          nomeSocial: '',
          cpf: '',
          rg: '',
          telefone: '',
          genero: '',
          estado: '',
          cidade: '',
          bairro: '',
          rua: '',
          numero: '',
          codigoPostal: '',
          informacoesAdicionais: ''
        }));
      } else {
        empresa.adicionarCliente(novoCliente);
        setState(prev => ({
          ...prev,
          mensagem: `Cliente ${nome} cadastrado localmente!`,
          tipoMensagem: 'success',
          nome: '',
          nomeSocial: '',
          cpf: '',
          rg: '',
          telefone: '',
          genero: '',
          estado: '',
          cidade: '',
          bairro: '',
          rua: '',
          numero: '',
          codigoPostal: '',
          informacoesAdicionais: ''
        }));
      }
      if (atualizarInterface) {
        atualizarInterface();
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao cadastrar cliente.',
        tipoMensagem: 'error'
      }));
    }
  }, [state, clientesAPI, empresa, atualizarInterface, validarFormulario]);

  const { nome, nomeSocial, cpf, rg, telefone, genero, mensagem, tipoMensagem } = state;
  const isLoading = clientesAPI?.loading || false;
  const apiError = clientesAPI?.error;

  // Mostra erro da API se houver
  useEffect(() => {
    if (apiError) {
      setState(prev => ({
        ...prev,
        mensagem: apiError,
        tipoMensagem: 'error'
      }));
    }
  }, [apiError]);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {(mensagem || apiError) && (
        <Alert 
          severity={apiError ? 'error' : tipoMensagem} 
          sx={{ mb: 3 }}
          onClose={apiError ? clientesAPI?.limparErro : () => setState(prev => ({ ...prev, mensagem: '' }))}
        >
          {apiError || mensagem}
        </Alert>
      )}

      <TextField
        label="Nome"
        value={nome}
        onChange={(e) => handleInputChange('nome', e.target.value)}
        fullWidth
        disabled={isLoading}
      />

      <TextField
        label="Nome Social"
        value={nomeSocial}
        onChange={(e) => handleInputChange('nomeSocial', e.target.value)}
        fullWidth
        disabled={isLoading}
      />

      <TextField
        label="CPF"
        value={cpf}
        onChange={(e) => handleInputChange('cpf', e.target.value)}
        fullWidth
        disabled={isLoading}
      />

      <TextField
        label="RG"
        value={rg}
        onChange={(e) => handleInputChange('rg', e.target.value)}
        fullWidth
        disabled={isLoading}
      />

      <TextField
        label="Telefone"
        placeholder="(11) 99999-9999"
        value={telefone}
        onChange={(e) => handleInputChange('telefone', e.target.value)}
        fullWidth
        helperText="Digite com DDD obrigatório: (11) 99999-9999"
        disabled={isLoading}
      />

      <FormControl fullWidth disabled={isLoading}>
        <InputLabel>Gênero</InputLabel>
        <Select
          value={genero}
          onChange={(e) => handleInputChange('genero', e.target.value)}
        >
          <MenuItem value="M">Masculino</MenuItem>
          <MenuItem value="F">Feminino</MenuItem>
          <MenuItem value="O">Outro</MenuItem>
        </Select>
      </FormControl>

      <TextField label="Estado" value={state.estado} onChange={e => handleInputChange('estado', e.target.value)} fullWidth margin="normal" required />
      <TextField label="Cidade" value={state.cidade} onChange={e => handleInputChange('cidade', e.target.value)} fullWidth margin="normal" required />
      <TextField label="Bairro" value={state.bairro} onChange={e => handleInputChange('bairro', e.target.value)} fullWidth margin="normal" required />
      <TextField label="Rua" value={state.rua} onChange={e => handleInputChange('rua', e.target.value)} fullWidth margin="normal" required />
      <TextField label="Número" value={state.numero} onChange={e => handleInputChange('numero', e.target.value)} fullWidth margin="normal" required />
      <TextField label="CEP" value={state.codigoPostal} onChange={e => handleInputChange('codigoPostal', e.target.value)} fullWidth margin="normal" required />
      <TextField label="Informações Adicionais" value={state.informacoesAdicionais} onChange={e => handleInputChange('informacoesAdicionais', e.target.value)} fullWidth margin="normal" />

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth
        size="large"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
      >
        {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
      </Button>
    </Box>
  );
}