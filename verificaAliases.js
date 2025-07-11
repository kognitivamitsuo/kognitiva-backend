#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const colors = require('colors');

// Configuration
const CONFIG = {
  EXIT_ON_ERROR: true,
  SHOW_SUCCESS: true,
  VERBOSE: true,
  CHECK_FILE_TYPES: {
    '@controllers': 'directory',
    '@services': 'directory',
    '@models': 'directory',
    '@utils': 'mixed',
    '@config': 'directory'
  }
};

// Enhanced logging
const logger = {
  success: (msg) => console.log(colors.green(`✓ ${msg}`)),
  error: (msg) => console.error(colors.red(`✗ ${msg}`)),
  info: (msg) => CONFIG.VERBOSE && console.log(colors.cyan(`ℹ ${msg}`)),
  warn: (msg) => console.log(colors.yellow(`⚠ ${msg}`)),
  debug: (msg) => CONFIG.VERBOSE && console.log(colors.gray(`⌛ ${msg}`))
};

logger.info('🔍 Starting comprehensive path verification...');

// Critical path verification
const verifyProjectStructure = () => {
  try {
    // 1. Verify package.json exists
    const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
    logger.debug(`Checking package.json at: ${packageJsonPath}`);
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found at project root');
    }

    // 2. Load and parse package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const aliases = packageJson._moduleAliases || {};
    logger.info(`Discovered ${Object.keys(aliases).length} module aliases`);

    if (Object.keys(aliases).length === 0) {
      logger.warn('No aliases configured in _moduleAliases');
      return { valid: false, errors: ['No aliases configured'] };
    }

    // 3. Verify each alias
    let errorCount = 0;
    const results = [];

    Object.entries(aliases).forEach(([alias, relativePath]) => {
      const absolutePath = path.resolve(__dirname, '..', relativePath);
      const expectedType = CONFIG.CHECK_FILE_TYPES[alias] || 'mixed';
      const result = { alias, path: relativePath, status: 'OK' };

      try {
        // Existence check
        if (!fs.existsSync(absolutePath)) {
          throw new Error(`Path does not exist`);
        }

        // Type checking
        const stats = fs.statSync(absolutePath);
        if (expectedType === 'directory' && !stats.isDirectory()) {
          throw new Error(`Expected directory but found file`);
        }
        if (expectedType === 'file' && !stats.isFile()) {
          throw new Error(`Expected file but found directory`);
        }

        // Additional content checks for critical directories
        if (alias === '@config' && stats.isDirectory()) {
          const files = fs.readdirSync(absolutePath);
          if (!files.includes('index.js') && !files.includes('index.ts')) {
            logger.warn(`Config directory missing index file`);
          }
        }

        if (CONFIG.SHOW_SUCCESS) {
          logger.success(`${alias.padEnd(12)} → ${relativePath}`);
        }
      } catch (err) {
        errorCount++;
        result.status = 'ERROR';
        result.error = err.message;
        logger.error(`${alias.padEnd(12)} → ${relativePath} (${err.message})`);
      }

      results.push(result);
    });

    // 4. Verify critical files
    const criticalFiles = [
      'src/services/iaService.js',
      'src/config/index.js',
      'src/app.js'
    ];

    criticalFiles.forEach(filePath => {
      const absPath = path.resolve(__dirname, '..', filePath);
      if (!fs.existsSync(absPath)) {
        errorCount++;
        logger.error(`Critical file missing: ${filePath}`);
      }
    });

    return {
      valid: errorCount === 0,
      errorCount,
      results,
      aliases
    };

  } catch (error) {
    logger.error(`Verification failed: ${error.message}`);
    return {
      valid: false,
      error: error.message
    };
  }
};

// Main execution
const { valid, errorCount, results } = verifyProjectStructure();

// Report generation
logger.info('\n📊 Verification Report:');
console.table(results);

if (!valid) {
  logger.error(`⛔ Verification failed with ${errorCount} error(s)`);
  if (CONFIG.EXIT_ON_ERROR) {
    process.exit(1);
  }
} else {
  logger.success('✅ All paths and aliases are correctly configured!');
}

// Export for testing purposes
if (process.env.NODE_ENV === 'test') {
  module.exports = { verifyProjectStructure };
}
