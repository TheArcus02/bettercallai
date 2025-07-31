import { create } from 'zustand';
import { analyzeLegalDocument } from '@/actions/analyze-doc-action';
import { extractLegalDocFromUrl } from '@/actions/extract-doc-from-url-action';
import type { AnalysisResult } from '@/lib/constants/agents';

type AppState = 'input' | 'analyzing' | 'results';
type InputMode = 'url' | 'text';

interface ProgressState {
  currentStep: string;
  progress: number; // 0-100
  totalSteps: number;
  currentStepIndex: number;
}

interface TosAnalyzerState {
  // State
  appState: AppState;
  currentInputMode: InputMode;
  analysisResults: AnalysisResult | null;
  error: string | null;
  isLoading: boolean;
  progress: ProgressState;

  // Actions
  setAppState: (state: AppState) => void;
  setCurrentInputMode: (mode: InputMode) => void;
  setAnalysisResults: (results: AnalysisResult | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setProgress: (progress: Partial<ProgressState>) => void;

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
  progress: {
    currentStep: '',
    progress: 0,
    totalSteps: 0,
    currentStepIndex: 0,
  },
};

export const useTosAnalyzerStore = create<TosAnalyzerState>((set, get) => ({
  ...initialState,

  // Simple setters
  setAppState: (appState) => set({ appState }),
  setCurrentInputMode: (currentInputMode) => set({ currentInputMode }),
  setAnalysisResults: (analysisResults) => set({ analysisResults }),
  setError: (error) => set({ error }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setProgress: (progress) =>
    set((state) => ({
      progress: { ...state.progress, ...progress },
    })),

  // Complex actions
  startAnalysis: async (data) => {
    try {
      const steps =
        data.inputMode === 'url'
          ? [
              'Fetching webpage content...',
              'Extracting Terms of Service...',
              'Analyzing document...',
            ]
          : ['Analyzing document...'];

      set({
        currentInputMode: data.inputMode,
        appState: 'analyzing',
        error: null,
        isLoading: true,
        progress: {
          currentStep: steps[0],
          progress: 0,
          totalSteps: steps.length,
          currentStepIndex: 0,
        },
      });

      let tosText = data.content;

      // If input mode is URL, extract ToS from the URL first
      if (data.inputMode === 'url') {
        // Step 1: Fetch webpage
        set((state) => ({
          progress: {
            ...state.progress,
            currentStep: steps[0],
            progress: Math.round((1 / steps.length) * 100 * 0.5), // 50% of first step
            currentStepIndex: 0,
          },
        }));

        // Step 2: Extract ToS
        set((state) => ({
          progress: {
            ...state.progress,
            currentStep: steps[1],
            progress: Math.round((1 / steps.length) * 100),
            currentStepIndex: 1,
          },
        }));

        tosText = await extractLegalDocFromUrl(data.content);

        // Complete extraction step
        set((state) => ({
          progress: {
            ...state.progress,
            progress: Math.round((2 / steps.length) * 100),
          },
        }));
      }

      // Final step: Analyze the ToS text
      const finalStepIndex = data.inputMode === 'url' ? 2 : 0;
      set((state) => ({
        progress: {
          ...state.progress,
          currentStep: steps[finalStepIndex],
          currentStepIndex: finalStepIndex,
          progress: Math.round(((finalStepIndex + 0.5) / steps.length) * 100),
        },
      }));

      const results = await analyzeLegalDocument(tosText);

      set({
        analysisResults: results,
        appState: 'results',
        isLoading: false,
        progress: {
          currentStep: 'Analysis complete!',
          progress: 100,
          totalSteps: steps.length,
          currentStepIndex: steps.length,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      set({
        error: errorMessage,
        appState: 'input',
        isLoading: false,
        progress: initialState.progress,
      });
    }
  },

  startNewAnalysis: () => {
    set({
      appState: 'input',
      analysisResults: null,
      error: null,
      isLoading: false,
      progress: initialState.progress,
    });
  },

  reset: () => {
    set(initialState);
  },
}));
