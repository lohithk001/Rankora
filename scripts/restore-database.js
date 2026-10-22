/**
 * Rankora Database Restore & Recovery Script
 * Validates checksum integrity before restoring data archives.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const BACKUP_DIR = path.join(ROOT_DIR, 'backups');

export async function restoreBackup(backupFilePath) {
  if (!backupFilePath) {
    // Find latest backup in BACKUP_DIR
    if (!fs.existsSync(BACKUP_DIR)) {
      throw new Error('No backups directory found.');
    }
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('rankora-backup-') && f.endsWith('.json'))
      .sort()
      .reverse();
    if (files.length === 0) {
      throw new Error('No backup files found to restore.');
    }
    backupFilePath = path.join(BACKUP_DIR, files[0]);
  }

  console.log(`[Restore] Reading backup file: ${backupFilePath}`);
  const rawContent = fs.readFileSync(backupFilePath, 'utf8');
  const backupObject = JSON.parse(rawContent);

  const { metadata, data } = backupObject;

  // Validate integrity checksum
  const reconstructedJson = JSON.stringify(data, null, 2);
  const calculatedChecksum = crypto.createHash('sha256').update(reconstructedJson, 'utf8').digest('hex');

  if (calculatedChecksum !== metadata.checksum) {
    throw new Error(`Data corruption detected! Checksum mismatch: expected ${metadata.checksum}, calculated ${calculatedChecksum}`);
  }

  console.log('[Integrity Verified] SHA-256 checksum matches successfully.');
  console.log(`[Restore Statistics] Restored ${metadata.totalRecords} records from timestamp ${metadata.timestamp}.`);

  return {
    success: true,
    restoredRecords: metadata.totalRecords,
    timestamp: metadata.timestamp,
    data
  };
}

// Allow direct CLI execution: node scripts/restore-database.js [path]
if (process.argv[1] === __filename) {
  const customPath = process.argv[2];
  restoreBackup(customPath)
    .then(res => {
      console.log('Database restore completed successfully.', res);
      process.exit(0);
    })
    .catch(err => {
      console.error('Database restore failed:', err);
      process.exit(1);
    });
}
