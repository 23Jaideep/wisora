import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css';
import './index.css'
import App from './App.jsx'
import { CoinProvider } from './context/coinContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CoinProvider>
      <App />
    </CoinProvider>
  </StrictMode>,
)
