'use client';

import React from 'react';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import {
  SettingEditDialog,
  SettingEditableRow,
  SettingSection,
  SettingToggleRow,
} from '@/components/organisms/settings/SettingsComponents';
import { cn } from '@/lib/utils';

type SecurityDialogState = {
  type: 'pin' | 'password';
  title: string;
  label: string;
  value: string;
  inputType: string;
  placeholder: string;
} | null;

/**
 * Renders dedicated screen for Privacy and Security settings.
 * @param props Component properties.
 * @returns React node for the settings screen.
 */
export function PrivacySecuritySettingsScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  const [pinValue, setPinValue] = React.useState('******');
  const [passwordStatus, setPasswordStatus] = React.useState('Terakhir diubah 30 hari yang lalu');
  const [biometricEnabled, setBiometricEnabled] = React.useState(true);
  const [autoLockEnabled, setAutoLockEnabled] = React.useState(true);
  const [maskPatientNotif, setMaskPatientNotif] = React.useState(true);
  const [activeDialog, setActiveDialog] = React.useState<SecurityDialogState>(null);

  const handleSaveSecurity = (_val: string) => {
    if (!activeDialog) {
      return;
    }
    if (activeDialog.type === 'pin') {
      setPinValue('******');
    } else {
      setPasswordStatus('Baru saja diperbarui');
    }
  };

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden select-text flex flex-col',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      <ScreenHeader
        title="Privasi & keamanan"
        onBack={props.onBack}
        theme={props.theme}
      />

      <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar px-5 pt-3 pb-6 flex flex-col gap-5">
        <SettingSection title="Kredensial dan sandi" isDark={isDark}>
          <SettingEditableRow
            label="Kata sandi akun"
            value={passwordStatus}
            onEdit={() => setActiveDialog({
              type: 'password',
              title: 'Ubah kata sandi',
              label: 'Masukkan kata sandi baru (minimal 8 karakter)',
              value: '',
              inputType: 'password',
              placeholder: 'Kata sandi baru...',
            })}
            isDark={isDark}
          />
          <SettingEditableRow
            label="PIN presensi dokter"
            value={pinValue}
            helperText="PIN 6-digit untuk presensi manual"
            onEdit={() => setActiveDialog({
              type: 'pin',
              title: 'Ubah PIN presensi',
              label: 'Masukkan 6-digit PIN baru',
              value: '',
              inputType: 'password',
              placeholder: '6 digit angka...',
            })}
            isDark={isDark}
          />
        </SettingSection>

        <SettingSection title="Keamanan perangkat" isDark={isDark}>
          <SettingToggleRow
            title="Login biometrik"
            subtitle="Gunakan sidik jari atau pemindai wajah"
            checked={biometricEnabled}
            onToggle={() => setBiometricEnabled(prev => !prev)}
            isDark={isDark}
          />
          <SettingToggleRow
            title="Kunci otomatis aplikasi"
            subtitle="Kunci saat aplikasi tidak aktif selama 5 menit"
            checked={autoLockEnabled}
            onToggle={() => setAutoLockEnabled(prev => !prev)}
            isDark={isDark}
          />
        </SettingSection>

        <SettingSection title="Privasi data pasien" isDark={isDark}>
          <SettingToggleRow
            title="Samarkan nama pasien di notifikasi"
            subtitle="Tampilkan inisial saja pada layar terkunci"
            checked={maskPatientNotif}
            onToggle={() => setMaskPatientNotif(prev => !prev)}
            isDark={isDark}
          />
        </SettingSection>
      </div>

      {activeDialog && (
        <SettingEditDialog
          title={activeDialog.title}
          label={activeDialog.label}
          value={activeDialog.value}
          inputType={activeDialog.inputType}
          placeholder={activeDialog.placeholder}
          onSave={handleSaveSecurity}
          onClose={() => setActiveDialog(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}
