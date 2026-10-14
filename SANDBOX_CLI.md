# AUAPW Vercel Sandbox CLI

A simple Node.js CLI utility for creating and managing Vercel sandboxes with built-in authentication and error handling.

## Features

- ✅ **Auth Setup** - Automatic Vercel login and project linking
- ✅ **Sandbox Creation** - Create isolated Node.js environments
- ✅ **Error Handling** - Comprehensive error messages and recovery suggestions
- ✅ **Multiple Operations** - Basic and advanced sandbox commands
- ✅ **Colored Output** - Clear, colorized terminal feedback

## Requirements

- Node.js v18+ (already installed)
- Vercel CLI: `npm install -g vercel`
- Vercel account
- Valid authentication credentials

## Installation

The CLI is already configured in your AUAPW project. Just ensure Vercel CLI is installed:

```bash
npm install -g vercel
```

## Usage

### Setup Authentication (First Time)

```bash
pnpm sandbox:auth
# or
node scripts/sandbox-cli.mjs auth
```

This command:
1. Checks if Vercel CLI is installed
2. Authenticates with Vercel (`vercel login`)
3. Links the project to Vercel (`vercel link`)

### Create and Test Sandbox

```bash
pnpm sandbox:create
# or
node scripts/sandbox-cli.mjs create
```

This command:
1. Creates a new Vercel sandbox
2. Runs a test command: `node -e "process.exit(0)"`
3. Reports success/failure
4. Cleans up and stops the sandbox

### Run Advanced Operations

```bash
pnpm sandbox:advanced
# or
node scripts/sandbox-cli.mjs advanced
```

This command demonstrates:
- Sandbox creation with environment setup
- Installing dependencies
- Running multiple diagnostic commands
- Proper cleanup

### Show Help

```bash
pnpm sandbox
# or
node scripts/sandbox-cli.mjs help
```

## Available npm Scripts

```json
{
  "sandbox": "node scripts/sandbox-cli.mjs",
  "sandbox:create": "node scripts/sandbox-cli.mjs create",
  "sandbox:auth": "node scripts/sandbox-cli.mjs auth",
  "sandbox:advanced": "node scripts/sandbox-cli.mjs advanced"
}
```

## Error Handling

The CLI includes comprehensive error handling for:

- **Missing Vercel CLI** - Provides installation instructions
- **Auth Failures** - Guides user to authenticate first
- **Sandbox Creation Errors** - Clear error messages with recovery steps
- **Command Execution Failures** - Detailed exit codes and diagnostics

### Common Issues

#### "Vercel CLI is not installed"

```bash
npm install -g vercel
```

#### "Not authenticated with Vercel"

```bash
pnpm sandbox:auth
# or
vercel login
```

#### "Command failed with exit code"

Ensure you're authenticated and have valid Vercel credentials:

```bash
vercel whoami
pnpm sandbox:auth
```

## Code Examples

### Basic Sandbox Test

```javascript
import { Sandbox } from '@vercel/sandbox';

const sandbox = await Sandbox.create();
const { exitCode } = await sandbox.runCommand({
  cmd: 'node',
  args: ['-e', 'process.exit(0)'],
});
console.log(exitCode === 0 ? 'ok' : 'failed');
await sandbox.stop();
```

### Advanced: Install Dependencies

```javascript
const sandbox = await Sandbox.create();
const { exitCode } = await sandbox.runCommand({
  cmd: 'sh',
  args: ['-c', 'npm install && npm test'],
});
await sandbox.stop();
```

### Advanced: Multiple Commands

```javascript
const sandbox = await Sandbox.create();

const commands = [
  { cmd: 'node', args: ['--version'] },
  { cmd: 'npm', args: ['--version'] },
  { cmd: 'pwd', args: [] },
];

for (const { cmd, args } of commands) {
  const { exitCode } = await sandbox.runCommand({ cmd, args });
  console.log(`${cmd}: ${exitCode === 0 ? 'ok' : 'failed'}`);
}

await sandbox.stop();
```

## Environment Variables

### Optional

- `VERCEL_TOKEN` - Your Vercel API token (for CI/CD automation)
- `VERCEL_ORG_ID` - Organization ID (optional)

### Example CI/CD Setup

```bash
# In GitHub Actions or similar
export VERCEL_TOKEN=${{ secrets.VERCEL_TOKEN }}
pnpm sandbox:create
```

## Architecture

```
scripts/
├── sandbox-cli.mjs          # Main CLI utility
│   ├── Auth Setup           # vercel login && vercel link
│   ├── Sandbox Creation     # Create isolated environments
│   ├── Command Execution    # Run commands in sandbox
│   └── Error Handling       # Comprehensive error recovery
```

## Features Included

### 1. Authentication Management

- Automatic Vercel CLI detection
- One-click login flow
- Project linking
- Auth status checking

### 2. Sandbox Operations

- Create isolated Node.js environments
- Run arbitrary commands
- Multiple command sequences
- Environment diagnostics

### 3. Error Recovery

- Clear error messages
- Actionable suggestions
- Graceful fallbacks
- Exit codes

### 4. User Feedback

- Color-coded output
- Progress indicators
- Success/failure states
- Diagnostic information

## Development

To extend the CLI with new commands, add them to the `main()` function:

```javascript
case 'my-command':
  await myCustomCommand();
  break;
```

Then add the function:

```javascript
async function myCustomCommand() {
  logInfo('Running custom command...');
  // Your implementation
  logSuccess('Custom command complete');
}
```

## Integration with AUAPW

This CLI is integrated into the AUAPW project for:

1. **Development** - Quick sandbox testing during development
2. **CI/CD** - Automated testing in isolated environments
3. **Deployment** - Pre-deployment sandbox validation
4. **Debugging** - Isolated environment diagnostics

## Support

For Vercel Sandbox documentation, visit:
- [Vercel Sandbox Docs](https://vercel.com/docs/sdk/sandbox)
- [Vercel CLI](https://vercel.com/cli)
- [Vercel Account](https://vercel.com/account)

## License

Part of AUAPW (All Used Auto Parts Warehouse) project
