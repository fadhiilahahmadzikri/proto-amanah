'use client';

import React from 'react';

type ModalStoreListener = () => void;

let activeModalCount = 0;
const listeners = new Set<ModalStoreListener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const modalStore = {
  getIsModalOpen: () => activeModalCount > 0,
  subscribe: (listener: ModalStoreListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  openModal: () => {
    activeModalCount += 1;
    emitChange();
  },
  closeModal: () => {
    activeModalCount = Math.max(0, activeModalCount - 1);
    emitChange();
  },
  reset: () => {
    activeModalCount = 0;
    emitChange();
  },
};

/**
 * Shared reactive hook to coordinate modal and drawer visibility with the main app shell and bottom navigation bar.
 */
export function useModalStore() {
  const isModalOpen = React.useSyncExternalStore(
    modalStore.subscribe,
    modalStore.getIsModalOpen,
    modalStore.getIsModalOpen,
  );

  return {
    isModalOpen,
    openModal: modalStore.openModal,
    closeModal: modalStore.closeModal,
    reset: modalStore.reset,
  };
}
