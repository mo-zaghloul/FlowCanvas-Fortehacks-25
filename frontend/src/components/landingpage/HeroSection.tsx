// components/landingpage/HeroSection.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Zap, Shield, Cpu, Sparkles, GitBranch, Workflow, Bot, Clock, BarChart3 } from "lucide-react";

// Replace these URLs with images hosted on your site (public/ files are served at '/').
const nodeImages: Record<string, string> = {
  workflow: "/img.png", // served from public/img.png
  gitbranch: "/img.png",
  bot: "/img.png",
  clock: "/img.png",
};

// Small helper component: render an <img> when src is provided and loads, otherwise render the provided fallback icon.
const ImageOrIcon = ({
  src,
  alt,
  className,
  fallback,
}: {
  src?: string;
  alt?: string;
  className?: string;
  fallback: JSX.Element;
}) => {
  const [errored, setErrored] = useState(false);
  if (!src || errored) return fallback;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setErrored(true)} />;
};

const GlowingCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="group relative p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-blue-500/50">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 animate-fade-in">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Forte Visual Builder
            </span>
          </div>
          
        {/*   <div className="flex items-center space-x-4 animate-fade-in">
            <Button variant="ghost" className="text-slate-300 hover:text-white transition-colors">
              Features
            </Button>
            <Button variant="ghost" className="text-slate-300 hover:text-white transition-colors">
              Examples
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all">
              Launch App
            </Button>
          </div> */}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <Zap className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-300 font-medium">
                    Visual Workflow Builder for Flow Blockchain
                  </span>
                </div>
              </div>

              <div className="animate-fade-in-up animation-delay-200">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    Build
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Automated
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Workflows
                  </span>
                </h1>
              </div>

              <div className="animate-fade-in-up animation-delay-400">
                <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                  Drag, drop, and connect blockchain actions with our visual builder. 
                  Create complex DeFi strategies, automated trading, and smart contract 
                  workflows without writing a single line of code.
                </p>
              </div>

              <div className="animate-fade-in-up animation-delay-600">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => navigate('/app')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
                  >
                    Start Building Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                 
                </div>
              </div>

              {/* Stats */}
              
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
              <div className="w-72 sm:w-80 md:w-96 lg:w-[560px] h-auto rounded-2xl overflow-hidden shadow-xl">
                <ImageOrIcon
                  src={nodeImages.workflow}
                  alt="Hero visual"
                  className="w-full h-full object-cover block"
                  fallback={<div className="w-full h-80 bg-slate-700" />}
                />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <GlowingCard
              icon={Cpu}
              title="Visual Builder"
              description="Drag and drop interface to create complex blockchain workflows without coding"
            />
            <GlowingCard
              icon={Zap}
              title="Instant Execution"
              description="Real-time transaction execution with built-in error handling and retry logic"
            />
            <GlowingCard
              icon={Shield}
              title="Secure & Trustless"
              description="All transactions signed locally, no private keys stored on our servers"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2" />
        </div>
      </div>
    </div>
  );
}