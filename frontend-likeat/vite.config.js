import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server.key'), 'utf8'),
      cert: fs.readFileSync(path.resolve(__dirname, 'server.cer'), 'utf8')
    }
  // https: {
  //   key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem'), 'utf8'),
  //   cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem'), 'utf8')
  }
})