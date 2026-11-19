import { defineConfig } from '@playwright/test';
import fs from 'node:fs';
const localChrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
export default defineConfig({
 testDir:'./tests',testMatch:'**/*.spec.js',fullyParallel:false,workers:1,timeout:45000,
 use:{baseURL:'http://127.0.0.1:54149',headless:true,launchOptions:fs.existsSync(localChrome)?{executablePath:localChrome}:{}},
 webServer:{command:'npm run dev',url:'http://127.0.0.1:54149',reuseExistingServer:true},
 reporter:'list'
});
