import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { PropsComEmpresa } from '../tipos';
import { ConsumoService, type ConsumoDTO } from '../servicos/ConsumoService';
import { ProdutoService } from '../servicos/ProdutoService';
import { ServicoService } from '../servicos/ServicoService';
import { ClienteService } from '../servicos/ClienteService';

interface StateRegistroConsumo {
  clienteSelecionado: number;
  tipoConsumo: 'produto' | 'servico';
  itemSelecionado: number;
  quantidade: number;
  mensagem: string;
  tipoMensagem: 'success' | 'error' | 'info';
}

interface ConsumoExtendido {
  id: number;
  cliente: { id: number; nome: string; sobreNome: string };
  produto?: { id: number; nome: string; preco: number };
  servico?: { id: number; nome: string; preco: number };
  quantidade: number;
  dataHora: string;
}

export default function RegistroConsumo({ atualizarInterface }: PropsComEmpresa) {
  const [tabAtual, setTabAtual] = useState(0);
  const [state, setState] = useState<StateRegistroConsumo>({
    clienteSelecionado: -1,
    tipoConsumo: 'produto',
    itemSelecionado: -1,
    quantidade: 1,
    mensagem: '',
    tipoMensagem: 'info',
  });
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [consumos, setConsumos] = useState<ConsumoExtendido[]>([]);
  const [consumoEditando, setConsumoEditando] = useState<ConsumoExtendido | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [clientesAPI, produtosAPI, servicosAPI] = await Promise.all([
        ClienteService.listarClientes(),
        ProdutoService.listarProdutos(),
        ServicoService.listarServicos()
      ]);
      
      setClientes(clientesAPI);
      setProdutos(produtosAPI.map((p: any) => p.id ? p : { ...p, id: Math.random() }));
      setServicos(servicosAPI.map((s: any) => s.id ? s : { ...s, id: Math.random() }));
      
      await carregarConsumos();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const carregarConsumos = async () => {
    try {
      const consumosAPI = await ConsumoService.listarConsumos();

      const consumosExtendidos = consumosAPI.map((consumo: any) => {
        return {
          id: consumo.id,
          cliente: consumo.cliente ? { 
            id: consumo.cliente.id || 0, 
            nome: consumo.cliente.nome || 'N/A', 
            sobreNome: consumo.cliente.sobreNome || '' 
          } : { id: 0, nome: 'Cliente não encontrado', sobreNome: '' },
          produto: consumo.produto ? { 
            id: consumo.produto.id || 0, 
            nome: consumo.produto.nome, 
            preco: consumo.produto.preco 
          } : undefined,
          servico: consumo.servico ? { 
            id: consumo.servico.id || 0, 
            nome: consumo.servico.nome, 
            preco: consumo.servico.preco 
          } : undefined,
          quantidade: consumo.quantidade,
          dataHora: consumo.dataHora || new Date().toISOString(),
        };
      });

      setConsumos(consumosExtendidos);
    } catch (error) {
      console.error('Erro ao carregar consumos:', error);
    }
  };

  const handleInputChange = useCallback((field: string, value: any) => {
    setState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const registrarConsumo = async () => {
    const { clienteSelecionado, itemSelecionado, quantidade } = state;

    if (clienteSelecionado === -1 || itemSelecionado === -1) {
      setState(prev => ({
        ...prev,
        mensagem: 'Por favor, selecione um cliente e um item.',
        tipoMensagem: 'error',
      }));
      return;
    }

    try {
      const consumoDTO: ConsumoDTO = {
        clienteId: clienteSelecionado,
        quantidade: quantidade,
        ...(state.tipoConsumo === 'produto' 
          ? { produtoId: itemSelecionado } 
          : { servicoId: itemSelecionado }
        )
      };

      await ConsumoService.cadastrarConsumo(consumoDTO);
      
      setState(prev => ({
        ...prev,
        mensagem: 'Consumo registrado com sucesso!',
        tipoMensagem: 'success',
        clienteSelecionado: -1,
        itemSelecionado: -1,
        quantidade: 1,
      }));

      await carregarConsumos();
      if (atualizarInterface) {
        atualizarInterface();
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao registrar consumo.',
        tipoMensagem: 'error',
      }));
    }
  };

  const editarConsumo = (consumo: ConsumoExtendido) => {
    setConsumoEditando(consumo);
    setDialogAberto(true);
  };

  const salvarEdicaoConsumo = async () => {
    if (!consumoEditando) return;

    try {
      const consumoDTO: ConsumoDTO = {
        id: consumoEditando.id,
        clienteId: consumoEditando.cliente.id,
        quantidade: consumoEditando.quantidade,
        produtoId: consumoEditando.produto?.id,
        servicoId: consumoEditando.servico?.id,
      };

      await ConsumoService.atualizarConsumo(consumoDTO);
      await carregarConsumos();
      setDialogAberto(false);
      setConsumoEditando(null);
      
      setState(prev => ({
        ...prev,
        mensagem: 'Consumo atualizado com sucesso!',
        tipoMensagem: 'success',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao atualizar consumo.',
        tipoMensagem: 'error',
      }));
    }
  };

  const excluirConsumo = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este consumo?')) return;

    try {
      await ConsumoService.excluirConsumo(id);
      await carregarConsumos();
      
      setState(prev => ({
        ...prev,
        mensagem: 'Consumo excluído com sucesso!',
        tipoMensagem: 'success',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        mensagem: 'Erro ao excluir consumo.',
        tipoMensagem: 'error',
      }));
    }
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleString('pt-BR');
    } catch {
      return dataString;
    }
  };

  const itensDisponiveis = state.tipoConsumo === 'produto' ? produtos : servicos;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Gestão de Consumos
      </Typography>

      {state.mensagem && (
        <Alert 
          severity={state.tipoMensagem} 
          sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
          onClose={() => setState(prev => ({ ...prev, mensagem: '' }))}
        >
          {state.mensagem}
        </Alert>
      )}

      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Tabs value={tabAtual} onChange={(_, newValue) => setTabAtual(newValue)} centered>
          <Tab label="Registrar Consumo" />
          <Tab label="Listar Consumos" />
        </Tabs>

        {tabAtual === 0 && (
          <Card sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                Registrar Novo Consumo
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Cliente</InputLabel>
                  <Select
                    value={state.clienteSelecionado}
                    onChange={e => handleInputChange('clienteSelecionado', Number(e.target.value))}
                    label="Cliente"
                  >
                    <MenuItem value={-1}>Selecione um cliente</MenuItem>
                    {clientes.map(cliente => (
                      <MenuItem key={cliente.id} value={cliente.id}>
                        {cliente.nome} {(cliente as any).sobreNome || (cliente as any).sobrenome || ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={state.tipoConsumo}
                    onChange={e => {
                      handleInputChange('tipoConsumo', e.target.value);
                      handleInputChange('itemSelecionado', -1);
                    }}
                    label="Tipo"
                  >
                    <MenuItem value="produto">Produto</MenuItem>
                    <MenuItem value="servico">Serviço</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>{state.tipoConsumo === 'produto' ? 'Produto' : 'Serviço'}</InputLabel>
                  <Select
                    value={state.itemSelecionado}
                    onChange={e => handleInputChange('itemSelecionado', Number(e.target.value))}
                    label={state.tipoConsumo === 'produto' ? 'Produto' : 'Serviço'}
                  >
                    <MenuItem value={-1}>
                      Selecione um {state.tipoConsumo === 'produto' ? 'produto' : 'serviço'}
                    </MenuItem>
                    {itensDisponiveis.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nome} - R$ {item.preco?.toFixed(2)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Quantidade</InputLabel>
                  <input
                    type="number"
                    min={1}
                    value={state.quantidade}
                    onChange={e => handleInputChange('quantidade', Number(e.target.value))}
                    style={{ width: '100%', padding: 8, fontSize: 16 }}
                  />
                </FormControl>

                <Button 
                  onClick={registrarConsumo}
                  variant="contained" 
                  fullWidth
                  size="large"
                >
                  Registrar Consumo
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {tabAtual === 1 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                Lista de Consumos
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Preço Unit.</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Data/Hora</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consumos.map((consumo) => (
                      <TableRow key={consumo.id}>
                        <TableCell>
                          {consumo.cliente.nome} {consumo.cliente.sobreNome}
                        </TableCell>
                        <TableCell>
                          {consumo.produto?.nome || consumo.servico?.nome}
                        </TableCell>
                        <TableCell>
                          {consumo.produto ? 'Produto' : 'Serviço'}
                        </TableCell>
                        <TableCell>{consumo.quantidade}</TableCell>
                        <TableCell>
                          R$ {(consumo.produto?.preco || consumo.servico?.preco || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          R$ {((consumo.produto?.preco || consumo.servico?.preco || 0) * consumo.quantidade).toFixed(2)}
                        </TableCell>
                        <TableCell>{formatarData(consumo.dataHora)}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => editarConsumo(consumo)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => excluirConsumo(consumo.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Dialog para edição */}
      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Consumo</DialogTitle>
        <DialogContent>
          {consumoEditando && (
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={consumoEditando.cliente.id}
                  label="Cliente"
                  onChange={(e) => {
                    const clienteSelecionado = clientes.find(c => c.id === e.target.value);
                    if (clienteSelecionado) {
                      setConsumoEditando({
                        ...consumoEditando,
                        cliente: clienteSelecionado
                      });
                    }
                  }}
                >
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nome} {cliente.sobreNome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={consumoEditando.produto ? 'produto' : 'servico'}
                  label="Tipo"
                  onChange={(e) => {
                    const novoTipo = e.target.value as 'produto' | 'servico';
                    if (novoTipo === 'produto') {
                      setConsumoEditando({
                        ...consumoEditando,
                        produto: produtos[0] || undefined,
                        servico: undefined
                      });
                    } else {
                      setConsumoEditando({
                        ...consumoEditando,
                        produto: undefined,
                        servico: servicos[0] || undefined
                      });
                    }
                  }}
                >
                  <MenuItem value="produto">Produto</MenuItem>
                  <MenuItem value="servico">Serviço</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>
                  {consumoEditando.produto ? 'Produto' : 'Serviço'}
                </InputLabel>
                <Select
                  value={consumoEditando.produto?.id || consumoEditando.servico?.id || ''}
                  label={consumoEditando.produto ? 'Produto' : 'Serviço'}
                  onChange={(e) => {
                    if (consumoEditando.produto) {
                      const produtoSelecionado = produtos.find(p => p.id === e.target.value);
                      if (produtoSelecionado) {
                        setConsumoEditando({
                          ...consumoEditando,
                          produto: produtoSelecionado
                        });
                      }
                    } else {
                      const servicoSelecionado = servicos.find(s => s.id === e.target.value);
                      if (servicoSelecionado) {
                        setConsumoEditando({
                          ...consumoEditando,
                          servico: servicoSelecionado
                        });
                      }
                    }
                  }}
                >
                  {(consumoEditando.produto ? produtos : servicos).map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome} - R$ {item.preco.toFixed(2)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Quantidade"
                value={consumoEditando.quantidade}
                onChange={(e) => 
                  setConsumoEditando({
                    ...consumoEditando,
                    quantidade: Number(e.target.value)
                  })
                }
                inputProps={{ min: 1 }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Resumo do Consumo:
                </Typography>
                <Typography variant="body2">
                  <strong>Cliente:</strong> {consumoEditando.cliente.nome} {consumoEditando.cliente.sobreNome}
                </Typography>
                <Typography variant="body2">
                  <strong>Item:</strong> {consumoEditando.produto?.nome || consumoEditando.servico?.nome}
                </Typography>
                <Typography variant="body2">
                  <strong>Tipo:</strong> {consumoEditando.produto ? 'Produto' : 'Serviço'}
                </Typography>
                <Typography variant="body2">
                  <strong>Preço Unitário:</strong> R$ {(consumoEditando.produto?.preco || consumoEditando.servico?.preco || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  <strong>Quantidade:</strong> {consumoEditando.quantidade}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  <strong>Total:</strong> R$ {((consumoEditando.produto?.preco || consumoEditando.servico?.preco || 0) * consumoEditando.quantidade).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAberto(false)}>Cancelar</Button>
          <Button onClick={salvarEdicaoConsumo} variant="contained">Salvar Alterações</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
