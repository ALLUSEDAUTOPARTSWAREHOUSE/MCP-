#!/usr/bin/env node

/**
 * AUAPW Vercel Sandbox CLI
 * Creates and manages Vercel sandboxes with built-in auth setup
 * 
 * Usage:
 *   node scripts/sandbox-cli.mjs [command]
 * 
 * Commands:
 *   create    - Create a new sandbox and run test
 *   auth      - Setup Vercel authentication
 *   help      - Show this help message
 */

import { Sandbox } from '@vercel/sandbox';
import { execSync } from 'child_process';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  console.error(`${colors.red}✗ Error: ${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

/**
 * Check if Vercel CLI is installed
 */
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if user is authenticated with Vercel
 */
function checkVercelAuth() {
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Setup Vercel authentication
 */
async function setupAuth() {
  log('\n=== Vercel Authentication Setup ===\n', 'bright');

  if (!checkVercelCLI()) {
    logError('Vercel CLI is not installed.');
    log('\nInstall it with: npm install -g vercel', 'yellow');
    process.exit(1);
  }

  logInfo('Vercel CLI detected');

  if (!checkVercelAuth()) {
    logWarning('Not authenticated with Vercel');
    log('\nRunning: vercel login', 'cyan');

    try {
      execSync('vercel login', { stdio: 'inherit' });
      logSuccess('Authentication successful');
    } catch (error) {
      logError('Authentication failed');
      process.exit(1);
    }
  } else {
    logSuccess('Already authenticated with Vercel');
  }

  // Link project if not already linked
  try {
    const projectPath = path.join(PROJECT_ROOT, '.vercel');
    const fs = await import('fs/promises');
    
    try {
      await fs.access(projectPath);
      logSuccess('Project is already linked to Vercel');
    } catch {
      logWarning('Project not linked to Vercel');
      log('\nRunning: vercel link', 'cyan');
      
      try {
        execSync('vercel link --yes', { 
          stdio: 'inherit',
          cwd: PROJECT_ROOT 
        });
        logSuccess('Project linked successfully');
      } catch (linkError) {
        logWarning('Could not auto-link project. You may need to run: vercel link');
      }
    }
  } catch (error) {
    logError(`Auth setup error: ${error.message}`);
    process.exit(1);
  }

  log('\n=== Setup Complete ===\n', 'green');
}

/**
 * Create a sandbox and run test command
 */
async function createSandbox() {
  log('\n=== Creating Vercel Sandbox ===\n', 'bright');

  try {
    logInfo('Initializing sandbox...');
    const sandbox = await Sandbox.create();
    logSuccess('Sandbox created successfully');

    logInfo(`Sandbox ID: ${sandbox.id}`);
    logInfo('Running test command: node -e "process.exit(0)"');

    const { exitCode } = await sandbox.runCommand({
      cmd: 'node',
      args: ['-e', 'process.exit(0)'],
    });

    if (exitCode === 0) {
      logSuccess('Test command executed successfully');
      log('\nResult: OK', 'green');
    } else {
      logError(`Command failed with exit code: ${exitCode}`);
      log('\nResult: FAILED', 'red');
      process.exit(1);
    }

    logInfo('Stopping sandbox...');
    await sandbox.stop();
    logSuccess('Sandbox stopped');

    log('\n=== Sandbox Test Complete ===\n', 'green');
  } catch (error) {
    logError(`Sandbox creation failed: ${error.message}`);
    
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      log('\nYou may need to authenticate first:', 'yellow');
      log('  Run: node scripts/sandbox-cli.mjs auth', 'cyan');
    }
    
    process.exit(1);
  }
}

/**
 * Advanced sandbox operations (for future expansion)
 */
async function runAdvancedSandbox() {
  log('\n=== Advanced Sandbox Operations ===\n', 'bright');

  try {
    logInfo('Creating sandbox with environment setup...');
    const sandbox = await Sandbox.create();
    logSuccess('Sandbox created');

    // Install dependencies
    logInfo('Installing dependencies...');
    const { exitCode: installCode } = await sandbox.runCommand({
      cmd: 'sh',
      args: ['-c', 'npm install --no-save 2>/dev/null || true'],
    });

    if (installCode === 0) {
      logSuccess('Dependencies installed');
    }

    // Run multiple commands
    const commands = [
      { name: 'Node version', cmd: 'node', args: ['--version'] },
      { name: 'npm version', cmd: 'npm', args: ['--version'] },
      { name: 'pwd', cmd: 'pwd', args: [] },
    ];

    for (const { name, cmd, args } of commands) {
      logInfo(`Checking: ${name}`);
      const { exitCode } = await sandbox.runCommand({ cmd, args });
      if (exitCode === 0) {
        logSuccess(`${name} check passed`);
      }
    }

    logInfo('Stopping sandbox...');
    await sandbox.stop();
    logSuccess('Sandbox stopped');

    log('\n=== Advanced Operations Complete ===\n', 'green');
  } catch (error) {
    logError(`Advanced operations failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Display help message
 */
function showHelp() {
  const help = `
${colors.bright}AUAPW Vercel Sandbox CLI${colors.reset}

${colors.bright}Usage:${colors.reset}
  node scripts/sandbox-cli.mjs [command]

${colors.bright}Commands:${colors.reset}
  create    - Create a sandbox and run basic test
  advanced  - Run advanced sandbox operations
  auth      - Setup Vercel authentication
  help      - Show this help message

${colors.bright}Examples:${colors.reset}
  # Setup Vercel auth
  node scripts/sandbox-cli.mjs auth

  # Create and test a sandbox
  node scripts/sandbox-cli.mjs create

  # Run advanced operations
  node scripts/sandbox-cli.mjs advanced

${colors.bright}Environment:${colors.reset}
  VERCEL_TOKEN  - Vercel API token (optional, for CI/CD)

${colors.bright}Requirements:${colors.reset}
  - Vercel CLI installed (npm install -g vercel)
  - Vercel account
  - Valid authentication credentials
`;

  console.log(help);
}

/**
 * Main CLI entry point
 */
async function main() {
  const command = process.argv[2] || 'help';

  try {
    switch (command.toLowerCase()) {
      case 'create':
        await createSandbox();
        break;

      case 'advanced':
        await runAdvancedSandbox();
        break;

      case 'auth':
        await setupAuth();
        break;

      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;

      default:
        logError(`Unknown command: ${command}`);
        log('\nRun "node scripts/sandbox-cli.mjs help" for usage information', 'yellow');
        process.exit(1);
    }
  } catch (error) {
    logError(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

// Run CLI
main().catch((error) => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
