/**
 * Rankora Automated Database Backup & Disaster Recovery Test
 * Simulates data snapshot, corruption/deletion, and full restoration verification.
 */

import { createBackup } from './backup-database.js';
import { restoreBackup } from './restore-database.js';
import assert from 'assert';

async function runRecoveryTest() {
  console.log('=== Rankora Database Backup & Recovery Test Suite ===\n');

  // 1. Prepare known test dataset
  const testState = {
    version: '1.0.0-test',
    exportedAt: new Date().toISOString(),
    tables: {
      developer_profiles: [
        { id: 'test-uuid-1', username: 'tourist_clone', score: 98.4, league: 'Elite' },
        { id: 'test-uuid-2', username: 'alex_fresher', score: 65.2, league: 'Rising' },
        { id: 'test-uuid-3', username: 'sarah_arch', score: 88.7, league: 'Advanced' }
      ]
    }
  };

  console.log('1. Generating snapshot with 3 developer profiles...');
  const backupResult = await createBackup(testState);
  assert.ok(backupResult.path, 'Backup path should exist');
  assert.strictEqual(backupResult.recordCount, 3, 'Should record 3 profiles');
  console.log('✓ Snapshot created and written to disk.');

  // 2. Simulate disaster / corruption
  console.log('\n2. Simulating data corruption / deletion event...');
  let activeState = { tables: { developer_profiles: [] } };
  assert.strictEqual(activeState.tables.developer_profiles.length, 0, 'Data simulated lost');
  console.log('✓ Active database emptied (simulated outage).');

  // 3. Perform recovery restore
  console.log('\n3. Executing automated recovery from snapshot...');
  const restoreResult = await restoreBackup(backupResult.path);
  assert.strictEqual(restoreResult.success, true, 'Restore operation should succeed');
  assert.strictEqual(restoreResult.restoredRecords, 3, 'All 3 records must be restored');
  
  // 4. Verify restored data matches pre-outage state exactly
  activeState = restoreResult.data;
  assert.deepStrictEqual(
    activeState.tables.developer_profiles,
    testState.tables.developer_profiles,
    'Restored records must match original state identically'
  );
  console.log('✓ Data integrity 100% verified after restoration.');

  console.log('\n=== Backup & Recovery Test Passed Successfully! ===\n');
}

runRecoveryTest().catch(err => {
  console.error('Recovery test failed:', err);
  process.exit(1);
});
