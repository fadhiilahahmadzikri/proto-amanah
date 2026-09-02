'use client';

import React from 'react';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import {
  SettingEditDialog,
  SettingEditableRow,
  SettingInfoRow,
  SettingSection,
} from '@/components/organisms/settings/SettingsComponents';
import { useDoctorStore } from '@/features/doctor/hooks/use-doctor-store';
import { cn } from '@/lib/utils';

type EditDialogState = {
  field: 'name' | 'phone' | 'email';
  title: string;
  label: string;
  value: string;
  inputType?: string;
  placeholder?: string;
} | null;

/**
 * Renders dedicated screen for Account and Doctor Identity settings.
 * @param props Component properties.
 * @returns React node for the settings screen.
 */
export function AccountIdentitySettingsScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const { profile, updateProfile } = useDoctorStore();
  const [activeDialog, setActiveDialog] = React.useState<EditDialogState>(null);

  const handleSaveField = (value: string) => {
    if (!activeDialog) {
      return;
    }
    updateProfile({ [activeDialog.field]: value });
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
        title="Akun & identitas dokter"
        onBack={props.onBack}
        theme={props.theme}
      />

      <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar px-5 pt-3 pb-6 flex flex-col gap-5">
        <SettingSection title="Informasi pribadi dan kontak" isDark={isDark}>
          <SettingEditableRow
            label="Nama lengkap"
            value={profile.name}
            onEdit={() => setActiveDialog({
              field: 'name',
              title: 'Ubah nama lengkap',
              label: 'Nama lengkap beserta gelar dokter',
              value: profile.name,
              placeholder: 'dr. Nama dokter, Sp.A',
            })}
            isDark={isDark}
          />
          <SettingInfoRow
            label="Spesialisasi medis"
            value={profile.role}
            isDark={isDark}
          />
          <SettingEditableRow
            label="Nomor telepon / WhatsApp"
            value={profile.phone}
            onEdit={() => setActiveDialog({
              field: 'phone',
              title: 'Ubah nomor telepon',
              label: 'Nomor aktif untuk verifikasi dan kontak darurat',
              value: profile.phone,
              inputType: 'tel',
              placeholder: '+62 812-xxxx-xxxx',
            })}
            isDark={isDark}
          />
          <SettingEditableRow
            label="Email resmi"
            value={profile.email}
            onEdit={() => setActiveDialog({
              field: 'email',
              title: 'Ubah email resmi',
              label: 'Alamat email institusi atau resmi dokter',
              value: profile.email,
              inputType: 'email',
              placeholder: 'dokter@rsamanah.co.id',
            })}
            isDark={isDark}
          />
          <SettingInfoRow
            label="NIK"
            value={profile.nik || '3171015508920003'}
            isDark={isDark}
          />
        </SettingSection>

        <SettingSection title="Kredensial medis dan legalitas" isDark={isDark}>
          <SettingInfoRow
            label="Nomor SIP"
            value={profile.sip || 'SIP. 503/442.1/SIP-D/2026'}
            isDark={isDark}
          />
          <SettingInfoRow
            label="Nomor STR"
            value={profile.str || 'STR. 31.2.1.100.1.20.123456'}
            isDark={isDark}
          />
          <SettingInfoRow
            label="Nomor KKI"
            value={profile.kkiNumber || 'KKI-ID-2026-98124'}
            isDark={isDark}
          />
          <SettingInfoRow
            label="Status STR/SIP"
            value="Aktif s/d Mei 2029 (terverifikasi)"
            isDark={isDark}
            isHighlighted
          />
        </SettingSection>

        <SettingSection title="Penugasan dan fasilitas kesehatan" isDark={isDark}>
          <SettingInfoRow
            label="Fasilitas kesehatan"
            value={profile.hospital || 'RS Amanah Sehat'}
            isDark={isDark}
          />
          <SettingInfoRow
            label="Departemen"
            value={profile.department || 'Departemen ilmu kesehatan anak'}
            isDark={isDark}
          />
          <SettingInfoRow
            label="Status kepegawaian"
            value="Dokter spesialis tetap"
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
          onSave={handleSaveField}
          onClose={() => setActiveDialog(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}
