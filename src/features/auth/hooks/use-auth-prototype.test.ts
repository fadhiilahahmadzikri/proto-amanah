import { describe, expect, it } from 'vitest';
import contentData from '@/data/auth/content.json';
import credentialsData from '@/data/auth/credentials.json';
import otpConfig from '@/data/auth/otp.json';
import portalData from '@/data/portal/portal-data.json';

describe('Auth Prototype Configuration and Data', () => {
  describe('Mock credentials', () => {
    it('contains valid mock users', () => {
      expect(credentialsData.users.length).toBeGreaterThan(0);
      expect(credentialsData.users[0]?.email).toBe('sarah@lovi.id');
    });
  });

  describe('OTP configuration', () => {
    it('sets default 6-digit OTP and 60s expiration', () => {
      expect(otpConfig.digitsCount).toBe(6);
      expect(otpConfig.expiresInSeconds).toBe(60);
      expect(otpConfig.defaultOtp).toBe('123456');
    });
  });

  describe('Indonesian localized content', () => {
    it('provides copy for all auth cycle steps', () => {
      expect(contentData.onboarding.title).toBe('Sehat Bersama Amanah');
      expect(contentData.forgotPassword.title).toBe('Lupa password');
      expect(contentData.otp.title).toBe('Masukkan kode');
      expect(contentData.changePassword.title).toBe('Ganti password');
      expect(contentData.success.title).toBe('Password berhasil di ganti');
    });
  });

  describe('Doctor Portal Dashboard Data', () => {
    it('contains doctor profile with avatar and unread count', () => {
      expect(portalData.profile.name).toBe('dr. Andika Perkasa');
      expect(portalData.profile.avatarUrl).toBe('/assets/images/woman-signin-hero.png');
    });

    it('contains 3 distinct doctor schedule cards with room and slot details', () => {
      expect(portalData.schedules.length).toBe(3);
      expect(portalData.schedules[0]?.title).toBe('Jadwal Hari Ini');
      expect(portalData.schedules[0]?.poli).toBe('Poli Anak');
      expect(portalData.schedules[0]?.room).toBe('Room 102');
    });

    it('contains 4 quick access actions', () => {
      expect(portalData.quickActions.length).toBe(4);
      expect(portalData.quickActions.map(a => a.label)).toEqual([
        'Presensi',
        'Jadwal Saya',
        'Cari Visit',
        'Kartu ID',
      ]);
    });

    it('contains 2 today activity metric cards', () => {
      expect(portalData.activities.length).toBe(2);
      expect(portalData.activities[0]?.title).toBe('Antrean Aktif');
      expect(portalData.activities[1]?.title).toBe('Total Selesai');
    });
  });
});
