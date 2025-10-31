<<<<<<< HEAD
=======
// App.tsx
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD
=======
import Home from "./pages/landingpage"; // This imports from pages/landingpage/index.tsx
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
<<<<<<< HEAD
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
=======
          <Route path="/" element={<Home />} /> {/* Landing Page */}
          <Route path="/app" element={<Index />} /> {/* Your workflow builder app */}
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 8843aa9 (Maintaining performance, enhancing styles and adding Landing page)
