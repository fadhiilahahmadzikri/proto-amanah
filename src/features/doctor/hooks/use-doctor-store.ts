'use client';

import React from 'react';

export type DoctorProfileData = {
  id: string;
  name: string;
  role: string;
  title: string;
  greeting: string;
  sip: string;
  str: string;
  nik: string;
  kkiNumber: string;
  email: string;
  phone: string;
  hospital: string;
  department: string;
  bio: string;
  avatarUrl: string;
  unreadNotifications: number;
};

export const INITIAL_DOCTOR_PROFILE: DoctorProfileData = {
  id: 'doc_001',
  name: 'dr. Amelia Cantika',
  role: 'Dokter Spesialis Anak',
  title: 'Dokter Spesialis Anak',
  greeting: 'Selamat Pagi',
  sip: 'SIP. 503/442.1/SIP-D/2026',
  str: 'STR. 31.2.1.100.1.20.123456',
  nik: '3171015508920003',
  kkiNumber: 'KKI-ID-2026-98124',
  email: 'amelia.cantika@rsamanah.co.id',
  phone: '+62 812-3456-7890',
  hospital: 'RS Amanah Sehat',
  department: 'Departemen Ilmu Kesehatan Anak',
  bio: 'Dokter Spesialis Anak di RS Amanah Sehat, melayani konsultasi rawat jalan, rawat inap, dan vaksinasi anak.',
  avatarUrl: '/assets/images/doctors/woman-doctor-4.png',
  unreadNotifications: 3,
};

type DoctorStoreListener = () => void;

let globalDoctorProfile: DoctorProfileData = { ...INITIAL_DOCTOR_PROFILE };
const listeners = new Set<DoctorStoreListener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const doctorStore = {
  getProfile: () => globalDoctorProfile,
  subscribe: (listener: DoctorStoreListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  updateProfile: (partial: Partial<DoctorProfileData>) => {
    globalDoctorProfile = {
      ...globalDoctorProfile,
      ...partial,
    };
    emitChange();
  },
  setAvatarUrl: (url: string) => {
    globalDoctorProfile = {
      ...globalDoctorProfile,
      avatarUrl: url,
    };
    emitChange();
  },
  reset: () => {
    globalDoctorProfile = { ...INITIAL_DOCTOR_PROFILE };
    emitChange();
  },
};

/**
 * Shared hook to observe and update doctor credential & profile state reactively across all screens (Login, Home, Account, 3D ID Card, etc.).
 */
export function useDoctorStore() {
  const profile = React.useSyncExternalStore(
    doctorStore.subscribe,
    doctorStore.getProfile,
    doctorStore.getProfile,
  );

  return {
    profile,
    updateProfile: doctorStore.updateProfile,
    setAvatarUrl: doctorStore.setAvatarUrl,
    reset: doctorStore.reset,
  };
}
