import React from 'react';
// @ts-expect-error React 19 client typing
import { createRoot } from 'react-dom/client';
import { DoctorIdCardEmbed } from '@/components/organisms/DoctorIdCardEmbed';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <DoctorIdCardEmbed />
    </React.StrictMode>,
  );
}
