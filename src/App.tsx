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
import { Github, Linkedin, Heart } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/schedulr">
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cpu-scheduling" element={<CPUScheduling />} />
                <Route path="/system-calls" element={<SystemCalls />} />
                <Route path="/synchronization" element={<Synchronization />} />
                <Route path="/page-replacement" element={<PageReplacement />} />
                <Route path="/disk-scheduling" element={<DiskScheduling />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
      {/* Footer */}
      <footer className="max-w-7xl mx-auto mb-6 rounded-2xl border border-border/60 shadow-md bg-background/90 backdrop-blur-md">
        <div className="px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Github className="w-5 h-5 text-primary" />
            <span>Contribute on</span>
            <a
              href="https://github.com/srikrishna-ps/schedulr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              GitHub
            </a>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span className="flex items-center gap-1 text-muted-foreground text-sm">
              <Github className="w-4 h-4" />
              <span className="relative inline-block group">
                <a href="https://github.com/srikrishna-ps" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  srikrishna-ps
                  <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary rounded transition-all duration-300 group-hover:w-full"></span>
                </a>
              </span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground text-sm">
              <Github className="w-4 h-4" />
              <span className="relative inline-block group">
                <a href="https://github.com/lucenity0" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  lucenity0
                  <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary rounded transition-all duration-300 group-hover:w-full"></span>
                </a>
              </span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground text-sm">
              <Linkedin className="w-4 h-4" />
              <span className="relative inline-block group">
                <a href="https://www.linkedin.com/in/nafees-s-6770712b0/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Nafees S
                  <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary rounded transition-all duration-300 group-hover:w-full"></span>
                </a>
              </span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground text-sm">
              <Linkedin className="w-4 h-4" />
              <span className="relative inline-block group">
                <a href="https://www.linkedin.com/in/srikrishna-pejathaya-p-s/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  SriKrishna P S
                  <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary rounded transition-all duration-300 group-hover:w-full"></span>
                </a>
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>by the Schedulr team</span>
          </div>
        </div>
      </footer>
    </>
  );
}


export default App;
