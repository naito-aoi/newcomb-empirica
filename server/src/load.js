import dotenv from 'dotenv';
import findConfig from "find-config";
import * as fs from 'fs';
import path from 'path';

function loadEnvironment() {
    let dotEnvPath = null;
    if (fs.existsSync('/home/ubuntu')) {
          dotEnvPath = findConfig('.env', {cwd: '/Users/naitoaoi/desktop/example-app'});
    } else if (fs.existsSync(path.join(__dirname, '../../example-app'))) {
        dotEnvPath = findConfig('.env');
        console.log('dotEnvPath: ' + dotEnvPath);
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

function checkFilesExist(SUMMARY_DATA_DIR) {
    if (!fs.existsSync(`${SUMMARY_DATA_DIR}/custom-data`)) {
      fs.mkdirSync(`${SUMMARY_DATA_DIR}/custom-data`);
    }
    if (!fs.existsSync(`${SUMMARY_DATA_DIR}/custom-data/summary.json`)) {
        fs.writeFileSync(`${SUMMARY_DATA_DIR}/custom-data/summary.json`, JSON.stringify([]));
    }
    if (!fs.existsSync(`${SUMMARY_DATA_DIR}/custom-data/bonus.json`)) {
      fs.writeFileSync(`${SUMMARY_DATA_DIR}/custom-data/bonus.json`, JSON.stringify([]));
    }
}

export {loadEnvironment, checkFilesExist};