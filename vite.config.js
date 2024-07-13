import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    server: {
        host: true,
        port: 3000,
    },
});