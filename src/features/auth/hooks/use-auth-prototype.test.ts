import { describe, expect, it } from 'vitest';
import contentData from '@/data/auth/content.json';
import credentialsData from '@/data/auth/credentials.json';
import otpConfig from '@/data/auth/otp.json';

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
});
