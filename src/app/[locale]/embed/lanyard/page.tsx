import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { DoctorIdCardEmbed } from '@/components/organisms/DoctorIdCardEmbed';

type LanyardEmbedPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: LanyardEmbedPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return {
    title: '3D Doctor ID Card Lanyard Embed',
    description: 'Standalone 1:1 hardware-accelerated 3D Lanyard Card viewport for native mobile WebView integration.',
  };
}

export default async function LanyardEmbedPage(props: LanyardEmbedPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <DoctorIdCardEmbed />;
}
