#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const [directory, tag, repository] = process.argv.slice(2);
if (!directory || !tag || !repository) {
  throw new Error('Usage: create-release-manifest.mjs <asset-directory> <tag> <owner/repository>');
}

const filenames = readdirSync(directory)
  .filter((name) => !['SHA256SUMS', 'latest.json'].includes(name))
  .sort();

function find(label, predicate) {
  const name = filenames.find((candidate) => predicate(candidate.toLowerCase()));
  if (!name) throw new Error(`Missing required ${label} release asset.`);
  return name;
}

const selected = {
  windows: find('Windows MSI', (name) => name.endsWith('.msi')),
  linux: find('Linux AppImage', (name) => name.endsWith('.appimage')),
  macAarch64: find('macOS aarch64 DMG', (name) => name.endsWith('.dmg') && (name.includes('aarch64') || name.includes('arm64'))),
  macX64: find('macOS x64 DMG', (name) => name.endsWith('.dmg') && (name.includes('x64') || name.includes('x86_64')))
};

const digests = new Map(filenames.map((name) => [
  name,
  createHash('sha256').update(readFileSync(join(directory, name))).digest('hex')
]));
writeFileSync(join(directory, 'SHA256SUMS'), `${filenames.map((name) => `${digests.get(name)}  ${name}`).join('\n')}\n`);

function asset(name) {
  const encodedName = basename(name).split('/').map(encodeURIComponent).join('/');
  return {
    url: `https://github.com/${repository}/releases/download/${tag}/${encodedName}`,
    sha256: digests.get(name)
  };
}

const manifest = {
  version: tag.replace(/^v/, ''),
  platforms: {
    windows: asset(selected.windows),
    linux: asset(selected.linux),
    macos: {
      aarch64: asset(selected.macAarch64),
      x64: asset(selected.macX64)
    }
  }
};
writeFileSync(join(directory, 'latest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
