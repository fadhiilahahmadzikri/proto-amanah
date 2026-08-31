'use client';

import { Check, Copy, KeyRound, Lock, Mail, Phone, ShieldCheck, UserCheck, X } from 'lucide-react';
import React from 'react';
import credentialsData from '@/data/auth/credentials.json';
import otpConfig from '@/data/auth/otp.json';
import { cn } from '@/lib/utils';

export function CredentialsConfigModal(props: {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser?: (user: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => void;
  theme?: 'dark' | 'light';
}) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const isDark = props.theme === 'dark';

  if (!props.isOpen) {
    return null;
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => {
      setCopiedField(null);
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={props.onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={cn(
          'relative w-full max-w-md overflow-hidden rounded-[28px] border shadow-2xl p-6 transition-all duration-300 select-text',
          isDark
            ? 'bg-neutral-900/95 border-white/20 text-white shadow-black/80 ring-1 ring-white/10'
            : 'bg-white/95 border-neutral-200 text-neutral-900 shadow-xl ring-1 ring-black/5',
        )}
        style={{
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/40 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6ff] text-[#0d66e9] dark:bg-white/10 dark:text-cyan-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight leading-none">
                Konfigurasi Prototype
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Menu: Kredensial Akun Demo & OTP
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup modal"
            onClick={props.onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Credentials List */}
        <div className="flex flex-col gap-4 py-4 max-h-[60vh] overflow-y-auto no-scrollbar">
          {credentialsData.users.map((user) => (
            <div
              key={user.id}
              className={cn(
                'flex flex-col gap-2.5 p-4 rounded-2xl border transition-all',
                isDark
                  ? 'bg-neutral-800/60 border-white/10 hover:border-cyan-400/40'
                  : 'bg-neutral-50/80 border-neutral-200/80 hover:border-[#0d66e9]/40',
              )}
            >
              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{user.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#0d66e9] dark:bg-white/10 dark:text-cyan-400">
                    {user.id}
                  </span>
                </div>
                {props.onSelectUser && (
                  <button
                    type="button"
                    onClick={() => {
                      props.onSelectUser?.(user);
                      props.onClose();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0d66e9] dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Gunakan Akun</span>
                  </button>
                )}
              </div>

              {/* Email Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(user.email, `${user.id}-email`)}
                  className="p-1 hover:text-[#0d66e9] transition-colors cursor-pointer text-neutral-400"
                >
                  {copiedField === `${user.id}-email` ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Phone Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {user.phone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(user.phone, `${user.id}-phone`)}
                  className="p-1 hover:text-[#0d66e9] transition-colors cursor-pointer text-neutral-400"
                >
                  {copiedField === `${user.id}-phone` ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Password Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {user.password}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(user.password, `${user.id}-pass`)}
                  className="p-1 hover:text-[#0d66e9] transition-colors cursor-pointer text-neutral-400"
                >
                  {copiedField === `${user.id}-pass` ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* OTP Code Card */}
          <div
            className={cn(
              'flex items-center justify-between p-3.5 rounded-2xl border',
              isDark
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
            )}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">
                  Kode OTP Default (6 Digit)
                </span>
                <span className="font-bold text-sm tracking-wider tabular-nums text-emerald-600 dark:text-emerald-400">
                  {otpConfig.defaultOtp}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(otpConfig.defaultOtp, 'otp-default')}
              className="p-1.5 hover:text-emerald-500 transition-colors cursor-pointer"
            >
              {copiedField === 'otp-default' ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-neutral-200/40 dark:border-white/10 text-center">
          <p className="text-[10px] text-neutral-400">
            Klik <b>"Gunakan Akun"</b> untuk mengisi otomatis form login dan pendaftaran.
          </p>
        </div>
      </div>
    </div>
  );
}
