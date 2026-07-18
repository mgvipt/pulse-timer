import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const webDir = resolve(projectDir, 'native-web');
const staticFiles = ['index.html', 'privacy.html', 'manifest.json', 'sw.js', 'icon.svg'];

rmSync(webDir, { recursive: true, force: true });
mkdirSync(webDir, { recursive: true });

for (const file of staticFiles) {
  cpSync(resolve(projectDir, file), resolve(webDir, file));
}

if (existsSync(resolve(projectDir, 'assets'))) {
  cpSync(resolve(projectDir, 'assets'), resolve(webDir, 'assets'), { recursive: true });
}

console.log('Native web bundle prepared in native-web/.');
