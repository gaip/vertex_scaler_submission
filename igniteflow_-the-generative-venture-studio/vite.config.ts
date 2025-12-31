import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.REACT_APP_VERTEX_AI_PROJECT_ID': JSON.stringify(env.REACT_APP_VERTEX_AI_PROJECT_ID),
        'process.env.REACT_APP_VERTEX_AI_LOCATION': JSON.stringify(env.REACT_APP_VERTEX_AI_LOCATION)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
