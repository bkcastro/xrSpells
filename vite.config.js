import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname is not available in ES module scope, so we define it like this
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    server: {
        host: true,
        port: 3000,
        // https: {
        //     key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
        //     cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
        // }
    },
});