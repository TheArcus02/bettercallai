import { create } from 'zustand';
import { analyzeTermsOfService } from '@/actions/analyze-tos-action';
import { extractTosFromUrl } from '@/actions/extract-tos-from-url-action';
import type { AnalysisResult } from '@/lib/constants/agents';

type AppState = 'input' | 'analyzing' | 'results';
type InputMode = 'url' | 'text';

interface TosAnalyzerState {
  // State
  appState: AppState;
  currentInputMode: InputMode;
  analysisResults: AnalysisResult | null;
  error: string | null;
  isLoading: boolean;

  // Actions
  setAppState: (state: AppState) => void;
  setCurrentInputMode: (mode: InputMode) => void;
  setAnalysisResults: (results: AnalysisResult | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;

  // Complex actions
  startAnalysis: (data: {
    inputMode: InputMode;
    content: string;
  }) => Promise<void>;
  startNewAnalysis: () => void;
  reset: () => void;
}

const initialState = {
  appState: 'input' as AppState,
  currentInputMode: 'url' as InputMode,
  analysisResults: null,
  error: null,
  isLoading: false,
};

export const useTosAnalyzerStore = create<TosAnalyzerState>((set, get) => ({
  ...initialState,

  // Simple setters
  setAppState: (appState) => set({ appState }),
  setCurrentInputMode: (currentInputMode) => set({ currentInputMode }),
  setAnalysisResults: (analysisResults) => set({ analysisResults }),
  setError: (error) => set({ error }),
  setIsLoading: (isLoading) => set({ isLoading }),

  // Complex actions
  startAnalysis: async (data) => {
    try {
      set({
        currentInputMode: data.inputMode,
        appState: 'analyzing',
        error: null,
        isLoading: true,
      });

      let tosText = data.content;

      // If input mode is URL, extract ToS from the URL first
      if (data.inputMode === 'url') {
        tosText = await extractTosFromUrl(data.content);
        return;
      }

      // Analyze the ToS text
      const results = await analyzeTermsOfService(tosText);

      set({
        analysisResults: results,
        appState: 'results',
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      set({
        error: errorMessage,
        appState: 'input',
        isLoading: false,
      });
    }
  },

  startNewAnalysis: () => {
    set({
      appState: 'input',
      analysisResults: null,
      error: null,
      isLoading: false,
    });
  },

  reset: () => {
    set(initialState);
  },
}));
