#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const colors = require('colors'); // Added for better console output

// Configurable settings
const EXIT_ON_ERROR = true;
const SHOW_SUCCESS = true;

// Enhanced logging functions
const log = {
  success: (msg) => console.log(colors.green(`✓ ${msg}`)),
  error: (msg) => console.error(colors.red(`✗ ${msg}`)),
  info: (msg) => console.log(colors.cyan(`ℹ ${msg}`)),
  warning: (msg) => console.log(colors.yellow(`⚠ ${msg}`))
};

log.info('🔍 Starting path verification for module aliases...');

try {
  // Load package.json with error handling
  const packageJsonPath = path.resolve(__dirname, './package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found');
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const aliases = packageJson._moduleAliases || {};

  if (Object.keys(aliases).length === 0) {
    log.warning('No aliases found in _moduleAliases');
    process.exit(EXIT_ON_ERROR ? 1 : 0);
  }

  log.info(`Found ${Object.keys(aliases).length} aliases to verify:`);

  let errorCount = 0;
  const aliasReport = [];

  // Verify each alias
  Object.entries(aliases).forEach(([alias, dir]) => {
    const resolvedPath = path.resolve(__dirname, dir);
    
    try {
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Path not found: ${resolvedPath}`);
      }

      // Additional check if it's a directory when expected
      if (alias !== '@root' && !fs.statSync(resolvedPath).isDirectory()) {
        throw new Error('Expected a directory but found a file');
      }

      aliasReport.push({ alias, status: 'OK', path: resolvedPath });
      if (SHOW_SUCCESS) {
        log.success(`${alias.padEnd(15)} → ${dir}`);
      }
    } catch (err) {
      errorCount++;
      aliasReport.push({ alias, status: 'ERROR', path: resolvedPath, error: err.message });
      log.error(`${alias.padEnd(15)} → ${dir} (${err.message})`);
    }
  });

  // Generate summary report
  log.info('\n📊 Verification Summary:');
  console.table(aliasReport);

  if (errorCount > 0) {
    log.error(`⛔ Found ${errorCount} errors in aliases configuration`);
    if (EXIT_ON_ERROR) {
      process.exit(1);
    }
  } else {
    log.success('🎯 All aliases are correctly configured!');
  }

} catch (mainError) {
  log.error(`Critical error during verification: ${mainError.message}`);
  process.exit(1);
}
