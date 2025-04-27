import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
    ],
    define: {
      'process.env.GROQ_API_KEY': JSON.stringify(env.GROQ_API_KEY),
      'process.env.GROQ_MODEL': JSON.stringify(env.GROQ_MODEL),
      'process.env.GROQ_API_URL': JSON.stringify(env.GROQ_API_URL),
    },
    build: {
      outDir: 'build',
      rollupOptions: {
        input: {
          main: './index.html',
          content: './src/content.ts',
          background: './src/background.ts',
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      },
    },
  }
})

