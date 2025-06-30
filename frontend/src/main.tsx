import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Roteador from './componentes/Roteador'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Roteador />
  </StrictMode>,
)
