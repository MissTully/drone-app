import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const vercelConfig = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
  headers: Array<{ headers: Array<{ key: string; value: string }> }>
}

const previewHeaders = Object.fromEntries(
  vercelConfig.headers[0].headers.map((header) => [header.key, header.value]),
)

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
  },
  preview: {
    headers: previewHeaders,
  },
  server: {
    fs: {
      deny: ['.env', '.env.*', '*.{crt,pem,key}', '**/.git/**'],
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
