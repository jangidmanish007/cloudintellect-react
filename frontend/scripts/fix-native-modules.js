#!/usr/bin/env node

/**
 * Fix for npm optional dependencies bug
 * This script ensures native modules are properly installed for the current platform
 * See: https://github.com/npm/cli/issues/4828
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { platform } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔧 Checking native modules...');

const currentPlatform = platform();
let modulesToCheck = [];

// Determine which modules to check based on platform
if (currentPlatform === 'win32') {
  modulesToCheck = [
    '@rollup/rollup-win32-x64-msvc',
    'lightningcss-win32-x64-msvc'
  ];
} else if (currentPlatform === 'linux') {
  modulesToCheck = [
    '@rollup/rollup-linux-x64-gnu',
    'lightningcss-linux-x64-gnu'
  ];
} else if (currentPlatform === 'darwin') {
  modulesToCheck = [
    '@rollup/rollup-darwin-x64',
    'lightningcss-darwin-x64'
  ];
} else {
  console.log(`⚠️  Unknown platform: ${currentPlatform}`);
  process.exit(0);
}

console.log(`📍 Platform: ${currentPlatform}`);

let needsInstall = false;

for (const module of modulesToCheck) {
  const modulePath = join(projectRoot, 'node_modules', ...module.split('/'));
  if (!existsSync(modulePath)) {
    console.log(`❌ Missing: ${module}`);
    needsInstall = true;
  } else {
    console.log(`✅ Found: ${module}`);
  }
}

if (needsInstall) {
  console.log('📦 Installing missing native modules...');
  try {
    const installCmd = `npm install ${modulesToCheck.join(' ')} --save-optional --no-save`;
    execSync(installCmd, {
      cwd: projectRoot,
      stdio: 'inherit'
    });
    console.log('✅ Native modules installed successfully');
  } catch (error) {
    console.error('⚠️  Warning: Could not install native modules automatically');
    console.error(`   Please run: npm install ${modulesToCheck.join(' ')} --save-optional`);
    // Don't exit with error - let the build continue and fail if truly needed
  }
} else {
  console.log('✅ All native modules present');
}
