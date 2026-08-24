import { setRequestLocale } from 'next-intl/server';
import type React from 'react';

export default async function PrototypeLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <div className="min-h-screen w-full overflow-x-hidden bg-black">{props.children}</div>;
}
