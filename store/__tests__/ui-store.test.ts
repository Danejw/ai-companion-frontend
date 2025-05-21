import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../index';

// Helper to reset zustand store state
const reset = () => {
  const { toggleHistoryOverlay, toggleCreditsOverlay, toggleLocalLingo } = useUIStore.getState();
  // Force them to default states by toggling off
  toggleHistoryOverlay(false);
  toggleCreditsOverlay(false);
  toggleLocalLingo(false);
};

describe('UI Store toggles', () => {
  beforeEach(() => {
    reset();
  });

  it('toggles history overlay', () => {
    const { toggleHistoryOverlay } = useUIStore.getState();
    expect(useUIStore.getState().isHistoryOpen).toBe(false);
    toggleHistoryOverlay(true);
    expect(useUIStore.getState().isHistoryOpen).toBe(true);
    toggleHistoryOverlay(false);
    expect(useUIStore.getState().isHistoryOpen).toBe(false);
  });

  it('toggles credits overlay', () => {
    const { toggleCreditsOverlay } = useUIStore.getState();
    expect(useUIStore.getState().isCreditsOpen).toBe(false);
    toggleCreditsOverlay(true);
    expect(useUIStore.getState().isCreditsOpen).toBe(true);
    toggleCreditsOverlay(false);
    expect(useUIStore.getState().isCreditsOpen).toBe(false);
  });

  it('toggles local lingo', () => {
    const { toggleLocalLingo } = useUIStore.getState();
    expect(useUIStore.getState().useLocalLingo).toBe(false);
    toggleLocalLingo(true);
    expect(useUIStore.getState().useLocalLingo).toBe(true);
    toggleLocalLingo(false);
    expect(useUIStore.getState().useLocalLingo).toBe(false);
  });
});
