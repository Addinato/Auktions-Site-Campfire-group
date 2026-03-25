import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ProductAuction } from './components/ProductAuction';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProductAuction />
  </StrictMode>,
);
