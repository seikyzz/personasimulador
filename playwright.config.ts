import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'tests/e2e',use:{baseURL:'http://127.0.0.1:3000',launchOptions:{executablePath:process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),args:['--no-sandbox']},screenshot:'only-on-failure'},webServer:{command:'npm run dev',url:'http://127.0.0.1:3000',reuseExistingServer:true},reporter:'list'});
