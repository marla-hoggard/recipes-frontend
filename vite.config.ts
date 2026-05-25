import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  envPrefix: 'REACT_APP_',
  server: {
    port: 3000,
  },
});
