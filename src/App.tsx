import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnalysisProvider } from "@/context/AnalysisContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnalyzePage from "./pages/AnalyzePage";
import ResultsPage from "./pages/ResultsPage";
import AnalysisHistory from "./pages/AnalysisHistory";
import READMELibrary from "./pages/READMELibrary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AnalysisProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/results/:analysisId" element={<ResultsPage />} />
            <Route path="/history" element={<AnalysisHistory />} />
            <Route path="/readmes" element={<READMELibrary />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AnalysisProvider>
  </QueryClientProvider>
);

export default App;