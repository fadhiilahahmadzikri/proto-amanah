'use client';

import React from 'react';

type ModalContextType = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  reset: () => void;
};

const ModalContext = React.createContext<ModalContextType | null>(null);

export function ModalProvider(props: { children: React.ReactNode }) {
  const [activeModalCount, setActiveModalCount] = React.useState(0);

  const openModal = React.useCallback(() => {
    setActiveModalCount(prev => prev + 1);
  }, []);

  const closeModal = React.useCallback(() => {
    setActiveModalCount(prev => Math.max(0, prev - 1));
  }, []);

  const reset = React.useCallback(() => {
    setActiveModalCount(0);
  }, []);

  const value = React.useMemo(() => ({
    isModalOpen: activeModalCount > 0,
    openModal,
    closeModal,
    reset,
  }), [activeModalCount, openModal, closeModal, reset]);

  return React.createElement(ModalContext.Provider, { value }, props.children);
}

// Global fallback if used outside a provider
let globalModalCount = 0;
const globalListeners = new Set<() => void>();
function emitGlobalChange() {
  for (const listener of globalListeners) {
    listener();
  }
}

export const modalStore = {
  getIsModalOpen: () => globalModalCount > 0,
  subscribe: (listener: () => void) => {
    globalListeners.add(listener);
    return () => {
      globalListeners.delete(listener);
    };
  },
  openModal: () => {
    globalModalCount += 1;
    emitGlobalChange();
  },
  closeModal: () => {
    globalModalCount = Math.max(0, globalModalCount - 1);
    emitGlobalChange();
  },
  reset: () => {
    globalModalCount = 0;
    emitGlobalChange();
  },
};

/**
 * Shared reactive hook to coordinate modal and drawer visibility with the main app shell and bottom navigation bar.
 * Uses local ModalContext when wrapped in ModalProvider, or falls back to global store.
 */
export function useModalStore(): ModalContextType {
  const context = React.useContext(ModalContext);
  const isGlobalOpen = React.useSyncExternalStore(
    modalStore.subscribe,
    modalStore.getIsModalOpen,
    modalStore.getIsModalOpen,
  );

  if (context) {
    return context;
  }

  return {
    isModalOpen: isGlobalOpen,
    openModal: modalStore.openModal,
    closeModal: modalStore.closeModal,
    reset: modalStore.reset,
  };
}
