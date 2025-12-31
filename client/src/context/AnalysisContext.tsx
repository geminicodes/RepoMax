import { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult, mockAnalysisResult } from '@/types/analysis';

interface AnalysisContextType {
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  startAnalysis: (username: string, jobUrl: string) => Promise<string>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async (username: string, jobUrl: string): Promise<string> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // For demo purposes, return mock data
      // In production, this would call your Supabase edge function
      const result = {
        ...mockAnalysisResult,
        id: `analysis-${Date.now()}`,
        githubUsername: username,
        jobUrl: jobUrl,
        analyzedAt: new Date().toISOString(),
      };
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
      
      return result.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setIsAnalyzing(false);
      throw err;
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        isAnalyzing,
        setIsAnalyzing,
        analysisResult,
        setAnalysisResult,
        error,
        setError,
        startAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}