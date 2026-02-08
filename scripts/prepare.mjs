import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

const hasBuildScript = existsSync('.esbuild/build.ts');
const hasGitDir = existsSync('.git');

if (!hasBuildScript) {
  process.stdout.write('Skipping prepare build: .esbuild/build.ts not found.\n');
  process.exit(0);
}

const runCommand = (command) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, { stdio: 'inherit', shell: true });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed (${code}): ${command}`));
    });
  });

const runPrepare = async () => {
  if (hasGitDir) {
    await runCommand('husky');
  }

  await runCommand('pnpm build');
};

await runPrepare();
