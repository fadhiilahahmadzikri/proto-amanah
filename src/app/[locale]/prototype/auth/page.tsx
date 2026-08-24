import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AuthPrototype } from '@/features/auth/auth-prototype';

type AuthPrototypePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: AuthPrototypePageProps): Promise<Metadata> {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return {
    title: 'Lóvi - Mobile UI/UX Authentication Prototype',
    description: 'Interactive high-fidelity mobile prototype for the Lóvi authentication cycle.',
  };
}

export default async function AuthPrototypePage(props: AuthPrototypePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <AuthPrototype />;
}
