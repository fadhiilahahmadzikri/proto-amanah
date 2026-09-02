'use client';

import React from 'react';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import {
  SettingActionRow,
  SettingHorizontalRow,
  SettingInfoRow,
  SettingSection,
  SettingToggleRow,
} from '@/components/organisms/settings/SettingsComponents';
import { cn } from '@/lib/utils';

/**
 * Renders dedicated screen for Data and Storage settings.
 * @param props Component properties.
 * @returns React node for the settings screen.
 */
export function DataStorageSettingsScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  const [autoSyncEnabled, setAutoSyncEnabled] = React.useState(true);
  const [wifiOnlySync, setWifiOnlySync] = React.useState(false);
  const [cacheCleaned, setCacheCleaned] = React.useState(false);
  const [exportState, setExportState] = React.useState<'idle' | 'exporting' | 'done'>('idle');

  const handleClearCache = () => {
    setCacheCleaned(true);
    setTimeout(() => {
      setCacheCleaned(false);
    }, 2500);
  };

  const handleExportData = () => {
    setExportState('exporting');
    setTimeout(() => {
      setExportState('done');
      setTimeout(() => {
        setExportState('idle');
      }, 2500);
    }, 1200);
  };

  let exportLabel = 'Ekspor PDF';
  if (exportState === 'exporting') {
    exportLabel = 'Memproses...';
  } else if (exportState === 'done') {
    exportLabel = 'Tersimpan';
  }

  let exportSubtitle = 'Simpan berkas laporan dalam format PDF';
  if (exportState === 'done') {
    exportSubtitle = 'Unduhan selesai disimpan di folder Download';
  }

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden select-text flex flex-col',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      <ScreenHeader
        title="Data & penyimpanan"
        onBack={props.onBack}
        theme={props.theme}
      />

      <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar px-5 pt-3 pb-6 flex flex-col gap-5">
        <SettingSection title="Ruang penyimpanan" isDark={isDark}>
          <SettingHorizontalRow
            label="Total data portal"
            value={cacheCleaned ? '74 MB' : '142 MB'}
            isDark={isDark}
            isBold
          />
          <SettingHorizontalRow
            label="Cache berkas sementara"
            value={cacheCleaned ? '0 MB' : '68 MB'}
            isDark={isDark}
          />
          <SettingHorizontalRow
            label="Dokumen unduhan"
            value="54 MB"
            isDark={isDark}
          />
          <SettingHorizontalRow
            label="Database lokal"
            value="20 MB"
            isDark={isDark}
          />
        </SettingSection>

        <SettingSection title="Sinkronisasi data" isDark={isDark}>
          <SettingToggleRow
            title="Sinkronisasi otomatis"
            subtitle="Perbarui jadwal dan status berkala"
            checked={autoSyncEnabled}
            onToggle={() => setAutoSyncEnabled(prev => !prev)}
            isDark={isDark}
          />
          <SettingToggleRow
            title="Hanya melalui Wi-Fi"
            subtitle="Hemat pemakaian kuota data seluler"
            checked={wifiOnlySync}
            onToggle={() => setWifiOnlySync(prev => !prev)}
            isDark={isDark}
          />
          <SettingInfoRow
            label="Sinkronisasi terakhir"
            value="Hari ini, 07:15 WIB"
            isDark={isDark}
          />
        </SettingSection>

        <SettingSection title="Tindakan penyimpanan" isDark={isDark}>
          <SettingActionRow
            title="Bersihkan cache sementara"
            subtitle={cacheCleaned ? 'Cache berhasil dibersihkan (0 MB)' : 'Hapus data sementara tanpa menghapus akun'}
            actionLabel={cacheCleaned ? 'Selesai' : 'Bersihkan'}
            onAction={handleClearCache}
            disabled={cacheCleaned}
            isSuccess={cacheCleaned}
            isDark={isDark}
          />
          <SettingActionRow
            title="Ekspor rekap presensi"
            subtitle={exportSubtitle}
            actionLabel={exportLabel}
            onAction={handleExportData}
            disabled={exportState !== 'idle'}
            isSuccess={exportState === 'done'}
            isDark={isDark}
          />
        </SettingSection>
      </div>
    </div>
  );
}
