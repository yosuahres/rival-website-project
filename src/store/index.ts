import { create } from "zustand";

interface UiState {
  showSplashScreen: boolean;
  fadeOut: boolean;
  setShowSplashScreen: (value: boolean) => void;
  setFadeOut: (value: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  showSplashScreen: true,
  fadeOut: false,
  setShowSplashScreen: (value: boolean) => set({ showSplashScreen: value }),
  setFadeOut: (value: boolean) => set({ fadeOut: value }),
}));
