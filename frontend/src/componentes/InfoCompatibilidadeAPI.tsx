import { Alert, Box, Typography, Chip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export default function InfoCompatibilidadeAPI() {
  return (
    <Box sx={{ mb: 3 }}>
      <Alert severity="info" icon={<InfoIcon />}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Compatibilidade com API Java
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          O backend Java usa um modelo de dados diferente. As seguintes adaptações foram feitas:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip label="Nome → nome + sobreNome" size="small" color="primary" variant="outlined" />
          <Chip label="CPF → Simulado (000.000.000-00)" size="small" color="warning" variant="outlined" />
          <Chip label="RG → Simulado (00.000.000-0)" size="small" color="warning" variant="outlined" />
          <Chip label="Gênero → 'Não informado'" size="small" color="warning" variant="outlined" />
        </Box>
        
        <Typography variant="body2">
          ✅ <strong>Funcionais:</strong> Nome, Telefone, Listagem, Cadastro, Edição, Exclusão<br/>
          ⚠️ <strong>Simulados:</strong> CPF, RG, Gênero (mantidos para compatibilidade do front-end)
        </Typography>
      </Alert>
    </Box>
  );
}
