import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { RelatorioService } from '../servicos/RelatorioService';

export default function Relatorios() {
  const [tabAtiva, setTabAtiva] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [clientesTop, setClientesTop] = useState<any[]>([]);
  const [produtosTop, setProdutosTop] = useState<any[]>([]);
  const [servicosTop, setServicosTop] = useState<any[]>([]);
  const [clientesGenero, setClientesGenero] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      RelatorioService.top10ClientesQuantidade(),
      RelatorioService.produtosMaisConsumidos(),
      RelatorioService.servicosMaisConsumidos(),
      RelatorioService.clientesPorGenero()
    ]).then(([clientes, produtos, servicos, genero]) => {
      console.log('Relatório clientes:', clientes);
      console.log('Relatório produtos:', produtos);
      console.log('Relatório serviços:', servicos);
      console.log('Relatório gênero:', genero);
      setClientesTop(clientes);
      setProdutosTop(produtos);
      setServicosTop(servicos);
      setClientesGenero(Object.entries(genero).map(([genero, quantidade]) => ({ genero, quantidade })));
    });
  }, []);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 900);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabAtiva(newValue);
  }, []);

  const handleSelectChange = useCallback((event: any) => {
    setTabAtiva(event.target.value);
  }, []);

  const renderTabela = useCallback((dados: any[], colunas: any[], titulo: string) => {
    return (
      <Card sx={{ mt: 2 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {titulo}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {colunas.map((coluna, index) => (
                    <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                      {coluna.titulo}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={colunas.length} align="center">
                      Nenhum dado disponível
                    </TableCell>
                  </TableRow>
                ) : (
                  dados.map((item, index) => (
                    <TableRow key={index}>
                      {colunas.map((coluna, colIndex) => (
                        <TableCell key={colIndex}>
                          {coluna.formato ? coluna.formato(item[coluna.campo], index) : item[coluna.campo]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    );
  }, []);

  const renderizarClientesQueMaisConsumiram = useCallback(() => {
    const colunas = [
      { titulo: 'Posição', campo: 'posicao', formato: (_: any, index: number) => index + 1 },
      { titulo: 'Nome', campo: 'nome' },
      { titulo: 'Quantidade', campo: 'quantidade' }
    ];
    return renderTabela(
      clientesTop.map((item, index) => ({ ...item, posicao: index + 1 })),
      colunas,
      'Top 10 Clientes que Mais Consumiram'
    );
  }, [clientesTop, renderTabela]);

  const renderizarProdutosMaisConsumidos = useCallback(() => {
    const colunas = [
      { titulo: 'Posição', campo: 'posicao', formato: (_: any, index: number) => index + 1 },
      { titulo: 'Produto', campo: 'nome' },
      { titulo: 'Quantidade', campo: 'quantidade' }
    ];
    return renderTabela(
      produtosTop.map((item, index) => ({ ...item, posicao: index + 1 })),
      colunas,
      'Top 10 Produtos Mais Consumidos'
    );
  }, [produtosTop, renderTabela]);

  const renderizarServicosMaisConsumidos = useCallback(() => {
    const colunas = [
      { titulo: 'Posição', campo: 'posicao', formato: (_: any, index: number) => index + 1 },
      { titulo: 'Serviço', campo: 'nome' },
      { titulo: 'Quantidade', campo: 'quantidade' }
    ];
    return renderTabela(
      servicosTop.map((item, index) => ({ ...item, posicao: index + 1 })),
      colunas,
      'Top 10 Serviços Mais Consumidos'
    );
  }, [servicosTop, renderTabela]);

  const renderizarClientesPorGenero = useCallback(() => {
    const colunas = [
      { titulo: 'Gênero', campo: 'genero' },
      { titulo: 'Quantidade', campo: 'quantidade' }
    ];
    return renderTabela(clientesGenero, colunas, 'Distribuição de Clientes por Gênero');
  }, [clientesGenero, renderTabela]);

  const renderizarConteudo = useCallback(() => {
    switch (tabAtiva) {
      case 0:
        return renderizarClientesQueMaisConsumiram();
      case 1:
        return renderizarProdutosMaisConsumidos();
      case 2:
        return renderizarServicosMaisConsumidos();
      case 3:
        return renderizarClientesPorGenero();
      default:
        return renderizarClientesQueMaisConsumiram();
    }
  }, [tabAtiva, renderizarClientesQueMaisConsumiram, renderizarProdutosMaisConsumidos, renderizarServicosMaisConsumidos, renderizarClientesPorGenero]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Relatórios
      </Typography>

      {/* Seletor mobile */}
      {isMobile ? (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Selecione o Relatório</InputLabel>
          <Select value={tabAtiva} onChange={handleSelectChange}>
            <MenuItem value={0}>Clientes que Mais Consumiram</MenuItem>
            <MenuItem value={1}>Produtos Mais Consumidos</MenuItem>
            <MenuItem value={2}>Serviços Mais Consumidos</MenuItem>
            <MenuItem value={3}>Clientes por Gênero</MenuItem>
          </Select>
        </FormControl>
      ) : (
        // Tabs para desktop
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabAtiva} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label="Clientes que Mais Consumiram"
              icon={<TrendingUpIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Produtos Mais Consumidos"
              icon={<ShoppingCartIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Serviços Mais Consumidos"
              icon={<ContentCutIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Clientes por Gênero"
              icon={<PersonIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      )}

      {renderizarConteudo()}

      {/* Informações adicionais */}
      <Card sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sobre os Relatórios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • <strong>Clientes que Mais Consumiram:</strong> Lista os clientes ordenados pela quantidade total de produtos e serviços consumidos.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • <strong>Produtos/Serviços Mais Consumidos:</strong> Mostra os itens mais populares com quantidade vendida e receita gerada.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • <strong>Clientes por Gênero:</strong> Apresenta a distribuição demográfica da base de clientes.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Os dados são atualizados automaticamente conforme novos consumos são registrados no sistema.
        </Typography>
      </Card>
    </Box>
  );
}
