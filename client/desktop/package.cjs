const { copyFileSync, existsSync, mkdirSync, readdirSync } = require('fs');
const { homedir, tmpdir } = require('os');
const { join } = require('path');
const { spawnSync } = require('child_process');

const output = join(tmpdir(), `CamfroXBuild-${Date.now()}`);
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(npx, ['electron-builder', '--win', 'nsis', `--config.directories.output=${output}`], {
  cwd: join(__dirname, '..'),
  stdio: 'inherit',
});

if (result.status !== 0) process.exit(result.status ?? 1);

const installer = readdirSync(output).find((file) => /^CamfroX-Setup-.*\.exe$/i.test(file));
if (!installer) throw new Error('Kurulum dosyası oluşturulamadı.');

const downloads = join(homedir(), 'Downloads');
if (!existsSync(downloads)) mkdirSync(downloads, { recursive: true });
const destination = join(downloads, installer);
copyFileSync(join(output, installer), destination);
console.log(`Kurulum dosyası hazır: ${destination}`);
