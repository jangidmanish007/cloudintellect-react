#!/usr/bin/env node

/**
 * Ensure native modules are installed before running dev/build
 * This runs before dev and build commands to guarantee modules are present
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { platform } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const currentPlatform = platform();
let modulesToCheck = [];
let installCommand = '';

// Determine which modules to check based on platform
if (currentPlatform === 'win32') {
  modulesToCheck = [
    { name: '@rollup/rollup-win32-x64-msvc', path: 'node_modules/@rollup/rollup-win32-x64-msvc' },
    { name: 'lightningcss-win32-x64-msvc', path: 'node_modules/lightningcss-win32-x64-msvc' }
  ];
  installCommand = 'npm install @rollup/rollup-win32-x64-msvc@4.60.2 lightningcss-win32-x64-msvc@1.30.2 --no-save';
} else if (currentPlatform === 'linux') {
  modulesToCheck = [
    { name: '@rollup/rollup-linux-x64-gnu', path: 'node_modules/@rollup/rollup-linux-x64-gnu' },
    { name: 'lightningcss-linux-x64-gnu', path: 'node_modules/lightningcss-linux-x64-gnu' }
  ];
  installCommand = 'npm install @rollup/rollup-linux-x64-gnu@4.60.2 lightningcss-linux-x64-gnu@1.30.2 --no-save';
} else if (currentPlatform === 'darwin') {
  modulesToCheck = [
    { name: '@rollup/rollup-darwin-x64', path: 'node_modules/@rollup/rollup-darwin-x64' },
    { name: 'lightningcss-darwin-x64', path: 'node_modules/lightningcss-darwin-x64' }
  ];
  installCommand = 'npm install @rollup/rollup-darwin-x64@4.60.2 lightningcss-darwin-x64@1.30.2 --no-save';
} else {
  console.log(`⚠️  Unknown platform: ${currentPlatform}`);
  process.exit(0);
}

let needsInstall = false;

for (const module of modulesToCheck) {
  const modulePath = join(projectRoot, module.path);
  if (!existsSync(modulePath)) {
    console.log(`❌ Missing: ${module.name}`);
    needsInstall = true;
  }
}

if (needsInstall) {
  console.log('📦 Installing missing native modules...');
  try {
    execSync(installCommand, {
      cwd: projectRoot,
      stdio: 'inherit'
    });
    console.log('✅ Native modules installed');
  } catch (error) {
    console.error('❌ Failed to install native modules');
    console.error(`   Please run manually: ${installCommand}`);
    process.exit(1);
  }
}
