import dotenv from 'dotenv';
import findConfig from "find-config";
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modulesとCommonJSの両方に対応
let __filename, __dirname;
if (import.meta.url) {
    // ES modules環境
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
} else {
    // CommonJS環境（フォールバック）
    __filename = __filename || '';
    __dirname = __dirname || process.cwd();
}

function loadEnvironment() {
    let dotEnvPath = null;
    if (fs.existsSync('/home/ubuntu')) {
          dotEnvPath = findConfig('.env');
    } else if (fs.existsSync(path.join(__dirname, '../../newcomb-empirica'))) {
        dotEnvPath = findConfig('.env');
        console.log('dotEnvPath: ' + dotEnvPath);
    } else {
        const rootEnvPath = path.join(__dirname, '../.env');
        if (fs.existsSync(rootEnvPath)) {
            dotEnvPath = rootEnvPath;
        }
    }
    if (dotEnvPath) {
        console.log('Loading dotenv file!');
        const envFile = dotenv.parse(fs.readFileSync(dotEnvPath));
        for (const key of Object.keys(envFile)) {
            process.env[key] = envFile[key];
        }
    } else {
        console.log('Warning: No dotenv file!');
    }
}


export {loadEnvironment};