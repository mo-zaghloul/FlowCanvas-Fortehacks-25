// components/landingpage/CTASection.tsx - TAILWIND ONLY
"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Rocket, Wallet, Sparkles, Zap, Shield, Lock } from "lucide-react";
import { useState } from "react";
import * as fcl from "@onflow/fcl";

export default function CTASection() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      
      // This will open the Flow wallet discovery and authentication flow
      await fcl.authenticate();
      
      // After successful authentication, you can handle the user state
      console.log("Wallet connected successfully!");
      
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateWorkflow = () => {
    // Navigate to the app page
    // Using window.location.href keeps this change framework-agnostic.
    window.location.href = "/app";
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <Rocket className="h-4 w-4 text-white mr-2" />
            <span className="text-sm text-white font-medium">
              Start Building in Seconds
            </span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white">
            Ready to Automate Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Blockchain Workflows?
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Join thousands of developers and traders building the future of decentralized automation
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Connect Wallet Button - NOW WITH NAVIGATION */}
            <Button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              size="lg"
              className="group relative px-10 py-7 text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-3xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/50 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center">
                {isConnecting ? (
                  <>
                    <div className="mr-3 h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-3 h-6 w-6" />
                    Connect Wallet
                    <Sparkles className="ml-2 h-5 w-5" />
                  </>
                )}
              </span>
            </Button>

           <Button
              onClick={handleCreateWorkflow}
              variant="outline"
              size="lg"
              className="group relative px-10 py-7 text-xl font-bold rounded-2xl bg-white text-slate-900 border-2 border-white shadow-2xl transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-3xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              <span className="flex items-center">
                <Zap className="mr-3 h-6 w-6 text-blue-600" />
                Create Workflow
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          
          </div>

          {/* Additional info about wallet connection */}
          <div className="pt-4">
            <p className="text-slate-400 text-sm">
              Connect with Blocto, Ledger, Dapper, or any Flow-compatible wallet
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}