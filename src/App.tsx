import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import CPUScheduling from "./pages/CPUScheduling";
import SystemCalls from "./pages/SystemCalls";
import Synchronization from "./pages/Synchronization";
import PageReplacement from "./pages/PageReplacement";
import DiskScheduling from "./pages/DiskScheduling";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes WITH Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cpu-scheduling" element={<CPUScheduling />} />
            <Route path="/system-calls" element={<SystemCalls />} />
            <Route path="/synchronization" element={<Synchronization />} />
            <Route path="/page-replacement" element={<PageReplacement />} />
            <Route path="/disk-scheduling" element={<DiskScheduling />} />
          </Route>

          {/* 404 Route WITHOUT Layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
