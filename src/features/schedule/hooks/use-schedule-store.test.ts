import { describe, expect, it, beforeEach } from 'vitest';
import { scheduleStore, INITIAL_SCHEDULES_MAP } from './use-schedule-store';

describe('scheduleStore', () => {
  beforeEach(() => {
    scheduleStore.reset();
  });

  it('provides initial schedules map for today', () => {
    const schedules = scheduleStore.getSchedulesMap()['2026-08-26'];
    expect(schedules).toBeDefined();
    expect(schedules?.length).toBe(3);
    expect(schedules?.[0]?.title).toBe('Sesi Pagi');
  });

  it('updates schedule across observers correctly', () => {
    const firstSchedule = scheduleStore.getSchedulesMap()['2026-08-26']?.[0];
    expect(firstSchedule).toBeDefined();

    if (firstSchedule) {
      scheduleStore.updateSchedule('2026-08-26', {
        ...firstSchedule,
        badge: 'Cuti',
        badgeVariant: 'warning',
      });

      const updated = scheduleStore.getSchedulesMap()['2026-08-26']?.[0];
      expect(updated?.badge).toBe('Cuti');
    }
  });

  it('deletes schedule correctly', () => {
    const initialCount = scheduleStore.getSchedulesMap()['2026-08-26']?.length ?? 0;

    scheduleStore.deleteSchedule('2026-08-26', 'ses-1');

    const updatedCount = scheduleStore.getSchedulesMap()['2026-08-26']?.length ?? 0;
    expect(updatedCount).toBe(initialCount - 1);
  });

  it('adds new schedule correctly', () => {
    const newSchedule = {
      id: 'ses-test',
      title: 'Sesi Tambahan',
      date: 'Rabu, 26 Agustus 2026',
      time: '18:00 - 19:00 WIB',
      poli: 'Poli Gigi',
      room: 'Ruang 101',
      slotCount: '0',
      slotText: '0 Pasien Booking',
      badge: 'Buka' as const,
      badgeVariant: 'success' as const,
    };

    scheduleStore.addSchedule('2026-08-26', newSchedule);

    const schedules = scheduleStore.getSchedulesMap()['2026-08-26'];
    expect(schedules?.some(s => s.id === 'ses-test')).toBe(true);
  });

  it('resets store back to initial data', () => {
    scheduleStore.deleteSchedule('2026-08-26', 'ses-1');
    scheduleStore.reset();

    expect(scheduleStore.getSchedulesMap()['2026-08-26']?.length).toBe(
      INITIAL_SCHEDULES_MAP['2026-08-26']?.length,
    );
  });
});
