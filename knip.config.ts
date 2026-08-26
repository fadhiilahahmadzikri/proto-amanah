import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Files to exclude from Knip analysis
  ignore: ['.poc/**', 'src/libs/I18n.ts', 'src/types/I18n.ts', 'src/components/DemoBadge.tsx', 'src/components/DemoBanner.tsx', 'src/components/atoms/BrandLogo.tsx'],
  // Dependencies to ignore during analysis
  ignoreDependencies: ['@clerk/shared', 'lefthook'],
  // Include custom Playwright test file suffixes
  playwright: {
    entry: ['tests/**/*.@(integ|e2e).ts'],
  },
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/gu)].join('\n'),
  },
  treatConfigHintsAsErrors: true,
};

export default config;
