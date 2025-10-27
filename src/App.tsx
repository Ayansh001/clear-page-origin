
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

// Lazy load non-critical pages for better performance
const Water = lazy(() => import("./pages/Water"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Insights = lazy(() => import("./pages/Insights"));
const Gym = lazy(() => import("./pages/Gym"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
  </div>
);

// Error fallback for the entire app
const AppErrorFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
    <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
    <p className="mb-6 text-gray-600">
      The application encountered an unexpected error. Please refresh the page and try again.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Refresh Page
    </button>
  </div>
);

// Configure react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary fallback={<AppErrorFallback />}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/water" element={<Water />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/gym" element={<Gym />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
