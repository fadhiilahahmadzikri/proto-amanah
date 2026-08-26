'use client';

import React from 'react';
import type { DayScheduleSetting, DoctorSchedule } from '@/types/portal.types';

export const INITIAL_SCHEDULES_MAP: Record<string, DoctorSchedule[]> = {
  '2026-08-26': [
    {
      id: 'ses-1',
      title: 'Sesi Pagi',
      date: 'Rabu, 26 Agustus 2026',
      time: '07:00 - 11:00 WIB',
      startTime: '07:00',
      endTime: '11:00',
      sessionType: 'Pagi',
      poli: 'Poli Gigi & Mulut',
      room: 'Ruang 201',
      slotCount: '2',
      slotText: '2 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-1',
          patientName: 'Steven Pratama',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
          patientAge: '28 Thn',
          patientRm: 'RM-2026-0412',
          patientComplaint: 'Pembersihan karang gigi (scaling) & tambal gigi geraham belakang',
          queueNumber: '#01',
          timeSlot: '08:00 - 09:30 WIB',
          badge: 'Aktif',
          badgeVariant: 'success',
        },
        {
          id: 'p-2',
          patientName: 'An. Kevin Sanjaya',
          avatarUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=300&auto=format&fit=crop',
          patientAge: '7 Thn',
          patientRm: 'RM-2026-0523',
          patientGuardian: 'Bpk. Budi Sanjaya (Ayah)',
          patientComplaint: 'Cabut gigi susu goyang & aplikasi fluoride',
          queueNumber: '#02',
          timeSlot: '10:00 - 11:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
    {
      id: 'ses-2',
      title: 'Sesi Siang',
      date: 'Rabu, 26 Agustus 2026',
      time: '13:00 - 17:00 WIB',
      startTime: '13:00',
      endTime: '17:00',
      sessionType: 'Siang',
      poli: 'Klinik Spesialis Konservasi',
      room: 'Ruang 204',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-3',
          patientName: 'Ibu Ratna Dewi',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
          patientAge: '42 Thn',
          patientRm: 'RM-2026-0789',
          patientComplaint: 'Perawatan saluran akar lanjutan tahap 2 & persiapan crown',
          queueNumber: '#01',
          timeSlot: '13:30 - 15:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
    {
      id: 'ses-3',
      title: 'Sesi Malam',
      date: 'Rabu, 26 Agustus 2026',
      time: '19:00 - 22:00 WIB',
      startTime: '19:00',
      endTime: '22:00',
      sessionType: 'Malam',
      poli: 'Klinik Eksekutif VIP',
      room: 'Suite VIP 01',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-4',
          patientName: 'Andi Budiman',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
          patientAge: '34 Thn',
          patientRm: 'RM-2026-0811',
          patientComplaint: 'Pemeriksaan estetika veneer & konsultasi clear aligner',
          queueNumber: '#01',
          timeSlot: '19:30 - 21:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
  '2026-08-27': [
    {
      id: 'ses-4',
      title: 'Sesi Pagi',
      date: 'Kamis, 27 Agustus 2026',
      time: '08:00 - 12:00 WIB',
      startTime: '08:00',
      endTime: '12:00',
      sessionType: 'Pagi',
      poli: 'Poli Gigi Umum',
      room: 'Ruang 201',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-5',
          patientName: 'Rafi Ahmad',
          avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop',
          patientAge: '35 Thn',
          patientRm: 'RM-2026-0911',
          patientComplaint: 'Pemeriksaan rutin & scaling berkala',
          queueNumber: '#01',
          timeSlot: '09:00 - 10:30 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
    {
      id: 'ses-5',
      title: 'Sesi Siang',
      date: 'Kamis, 27 Agustus 2026',
      time: '13:00 - 17:00 WIB',
      startTime: '13:00',
      endTime: '17:00',
      sessionType: 'Siang',
      poli: 'Spesialis Bedah Mulut',
      room: 'Ruang Tindakan 2',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-6',
          patientName: 'Bpk. Hendra Gunawan',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
          patientAge: '49 Thn',
          patientRm: 'RM-2026-1044',
          patientComplaint: 'Tindakan odontektomi gigi bungsu impaksi',
          queueNumber: '#01',
          timeSlot: '14:00 - 15:30 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
  '2026-08-28': [
    {
      id: 'ses-6',
      title: 'Sesi Pagi',
      date: 'Jumat, 28 Agustus 2026',
      time: '08:00 - 11:30 WIB',
      startTime: '08:00',
      endTime: '11:30',
      sessionType: 'Pagi',
      poli: 'Telemedisin Gigi',
      room: 'Studio D-02',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-7',
          patientName: 'Nadia Saphira',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
          patientAge: '24 Thn',
          patientRm: 'RM-2026-1120',
          patientComplaint: 'Konsultasi rencana kawat gigi / clear aligner estetika',
          queueNumber: '#01',
          timeSlot: '08:30 - 10:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
  '2026-08-29': [
    {
      id: 'ses-7',
      title: 'Sesi Pagi',
      date: 'Sabtu, 29 Agustus 2026',
      time: '09:00 - 12:00 WIB',
      startTime: '09:00',
      endTime: '12:00',
      sessionType: 'Pagi',
      poli: 'Poli Eksekutif VIP',
      room: 'Suite VIP 02',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-8',
          patientName: 'drg. Maya Kusuma (VIP)',
          avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop',
          patientAge: '31 Thn',
          patientRm: 'RM-2026-1205',
          patientComplaint: 'Pemasangan bleaching / pemutihan gigi & fluoride polish',
          queueNumber: '#01',
          timeSlot: '09:00 - 11:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
  '2026-08-31': [
    {
      id: 'ses-8',
      title: 'Sesi Pagi',
      date: 'Senin, 31 Agustus 2026',
      time: '08:30 - 12:00 WIB',
      startTime: '08:30',
      endTime: '12:00',
      sessionType: 'Pagi',
      poli: 'Poli Gigi & Mulut',
      room: 'Ruang 201',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-9',
          patientName: 'Farhan Maulana',
          avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
          patientAge: '29 Thn',
          patientRm: 'RM-2026-1310',
          patientComplaint: 'Penambalan gigi berlubang & konsultasi',
          queueNumber: '#01',
          timeSlot: '08:30 - 10:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
};

const INITIAL_DAY_SETTINGS: Record<string, DayScheduleSetting> = {
  '2026-08-26': { targetQuota: 8, isCuti: false },
  '2026-08-27': { targetQuota: 6, isCuti: false },
  '2026-08-28': { targetQuota: 6, isCuti: false },
  '2026-08-29': { targetQuota: 10, isCuti: false },
  '2026-08-30': { targetQuota: 0, isCuti: true, cutiReason: 'Cuti Akhir Pekan / Hari Libur Nasional' },
  '2026-08-31': { targetQuota: 8, isCuti: false },
};

type ScheduleStoreListener = () => void;

let globalSchedulesMap: Record<string, DoctorSchedule[]> = { ...INITIAL_SCHEDULES_MAP };
let globalDaySettings: Record<string, DayScheduleSetting> = { ...INITIAL_DAY_SETTINGS };
const listeners = new Set<ScheduleStoreListener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const scheduleStore = {
  getSchedulesMap: () => globalSchedulesMap,
  getDaySettings: () => globalDaySettings,
  subscribe: (listener: ScheduleStoreListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setSchedulesMap: (updater: (prev: Record<string, DoctorSchedule[]>) => Record<string, DoctorSchedule[]>) => {
    globalSchedulesMap = updater(globalSchedulesMap);
    emitChange();
  },
  setDaySettings: (updater: (prev: Record<string, DayScheduleSetting>) => Record<string, DayScheduleSetting>) => {
    globalDaySettings = updater(globalDaySettings);
    emitChange();
  },
  updateSchedule: (dateKey: string, schedule: DoctorSchedule) => {
    globalSchedulesMap = {
      ...globalSchedulesMap,
      [dateKey]: (globalSchedulesMap[dateKey] || []).map(s => (s.id === schedule.id ? schedule : s)),
    };
    emitChange();
  },
  addSchedule: (dateKey: string, schedule: DoctorSchedule) => {
    globalSchedulesMap = {
      ...globalSchedulesMap,
      [dateKey]: [...(globalSchedulesMap[dateKey] || []), schedule],
    };
    emitChange();
  },
  deleteSchedule: (dateKey: string, scheduleId: string) => {
    globalSchedulesMap = {
      ...globalSchedulesMap,
      [dateKey]: (globalSchedulesMap[dateKey] || []).filter(s => s.id !== scheduleId),
    };
    emitChange();
  },
  reset: () => {
    globalSchedulesMap = { ...INITIAL_SCHEDULES_MAP };
    globalDaySettings = { ...INITIAL_DAY_SETTINGS };
    emitChange();
  },
};

/**
 * Shared hook to observe and manipulate doctor practice schedules in real time across Home and Schedule screens.
 */
export function useScheduleStore() {
  const schedulesMap = React.useSyncExternalStore(
    scheduleStore.subscribe,
    scheduleStore.getSchedulesMap,
    scheduleStore.getSchedulesMap,
  );

  const daySettings = React.useSyncExternalStore(
    scheduleStore.subscribe,
    scheduleStore.getDaySettings,
    scheduleStore.getDaySettings,
  );

  const todayKey = '2026-08-26';
  const todaySchedules = schedulesMap[todayKey] || [];

  return {
    schedulesMap,
    daySettings,
    todaySchedules,
    todayKey,
    setSchedulesMap: scheduleStore.setSchedulesMap,
    setDaySettings: scheduleStore.setDaySettings,
    addSchedule: scheduleStore.addSchedule,
    updateSchedule: scheduleStore.updateSchedule,
    deleteSchedule: scheduleStore.deleteSchedule,
    reset: scheduleStore.reset,
  };
}
