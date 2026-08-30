import { beforeEach, describe, expect, it } from 'vitest';
import { permissionStore } from '@/features/doctor/hooks/use-permission-store';

describe('permissionStore', () => {
  beforeEach(() => {
    permissionStore.reset();
  });

  it('initializes with seed records', () => {
    const records = permissionStore.getRecords();
    expect(records.length).toBeGreaterThan(0);
    expect(records.some((r) => r.status === 'menunggu')).toBe(true);
    expect(records.some((r) => r.status === 'disetujui')).toBe(true);
  });

  it('creates a new permission record with pending status and user info', () => {
    const newRecord = permissionStore.createPermission({
      startDate: '2026-10-01',
      endDate: '2026-10-03',
      type: 'Cuti Tahunan',
      reason: 'Liburan keluarga akhir tahun.',
      substituteDoctor: 'dr. Budi Santoso, Sp.A',
    });

    expect(newRecord.status).toBe('menunggu');
    expect(newRecord.durationDays).toBe(3);
    expect(newRecord.userName).toBeTruthy();
    expect(newRecord.userRole).toBeTruthy();
    expect(newRecord.userAvatarUrl).toBeTruthy();

    const records = permissionStore.getRecords();
    expect(records[0]?.id).toBe(newRecord.id);
  });

  it('allows updating when status is menunggu (pending)', () => {
    const records = permissionStore.getRecords();
    const pendingItem = records.find((r) => r.status === 'menunggu');
    expect(pendingItem).toBeDefined();

    if (pendingItem) {
      const res = permissionStore.updatePermission(pendingItem.id, {
        reason: 'Alasan telah diubah oleh dokter.',
      });
      expect(res.success).toBe(true);
      const updated = permissionStore.getRecords().find((r) => r.id === pendingItem.id);
      expect(updated?.reason).toBe('Alasan telah diubah oleh dokter.');
    }
  });

  it('blocks updating when status is disetujui (approved)', () => {
    const records = permissionStore.getRecords();
    const approvedItem = records.find((r) => r.status === 'disetujui');
    expect(approvedItem).toBeDefined();

    if (approvedItem) {
      const res = permissionStore.updatePermission(approvedItem.id, {
        reason: 'Mencoba mengubah izin yang sudah disetujui',
      });
      expect(res.success).toBe(false);
      expect(res.message).toContain('tidak dapat diedit');
    }
  });

  it('allows cancelling when status is menunggu (pending)', () => {
    const records = permissionStore.getRecords();
    const pendingItem = records.find((r) => r.status === 'menunggu');
    expect(pendingItem).toBeDefined();

    if (pendingItem) {
      const res = permissionStore.cancelPermission(pendingItem.id);
      expect(res.success).toBe(true);
      const updated = permissionStore.getRecords().find((r) => r.id === pendingItem.id);
      expect(updated?.status).toBe('dibatalkan');
      expect(updated?.cancelledAt).toBeDefined();
    }
  });

  it('blocks cancelling when status is disetujui (approved)', () => {
    const records = permissionStore.getRecords();
    const approvedItem = records.find((r) => r.status === 'disetujui');
    expect(approvedItem).toBeDefined();

    if (approvedItem) {
      const res = permissionStore.cancelPermission(approvedItem.id);
      expect(res.success).toBe(false);
      expect(res.message).toContain('tidak dapat dibatalkan');
    }
  });
});
