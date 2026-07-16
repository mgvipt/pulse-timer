import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const iosProjectDir = resolve(projectDir, 'ios', 'App');
const iosAppDir = resolve(iosProjectDir, 'App');
const nativeWebDir = resolve(projectDir, 'native-web');
const publicDir = resolve(iosAppDir, 'public');

function run(command, args, options) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(process.execPath, [resolve(scriptDir, 'build-native.mjs')], { cwd: projectDir });

if (!existsSync(iosAppDir)) {
  throw new Error('iOS project not found. Run `npx cap add ios` once before syncing.');
}

rmSync(publicDir, { recursive: true, force: true });
cpSync(nativeWebDir, publicDir, { recursive: true });

const config = JSON.parse(readFileSync(resolve(projectDir, 'capacitor.config.json'), 'utf8'));
writeFileSync(
  resolve(iosAppDir, 'capacitor.config.json'),
  `${JSON.stringify({ ...config, packageClassList: [] }, null, '\t')}\n`,
);
writeFileSync(
  resolve(iosAppDir, 'config.xml'),
  "<?xml version='1.0' encoding='utf-8'?>\n<widget version=\"1.0.0\" xmlns=\"http://www.w3.org/ns/widgets\" xmlns:cdv=\"http://cordova.apache.org/ns/1.0\">\n  <access origin=\"*\" />\n</widget>\n",
);

mkdirSync(iosProjectDir, { recursive: true });
run('pod', ['install'], {
  cwd: iosProjectDir,
  env: {
    ...process.env,
    DEVELOPER_DIR: process.env.DEVELOPER_DIR || '/Applications/Xcode.app/Contents/Developer',
  },
});

console.log('iOS app synchronized from the shared Pulse web source.');
