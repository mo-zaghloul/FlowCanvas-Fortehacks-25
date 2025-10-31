// components/landingpage/FeaturesSection.tsx
"use client";
import { 
  GitBranch, 
  Workflow, 
  Bot, 
  Clock, 
  ShieldCheck, 
  BarChart3
} from "lucide-react";

const FeatureItem = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
      <Icon className="h-7 w-7 text-white" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-300 leading-relaxed">{description}</p>
  </div>
);

export default function FeaturesSection() {
  const features = [
    {
      icon: Workflow,
      title: "Drag & Drop Builder",
      description: "Intuitive visual interface to design complex blockchain workflows with simple drag and drop actions."
    },
    {
      icon: GitBranch,
      title: "Multi-chain Actions",
      description: "Support for multiple blockchain actions including swaps, stakes, transfers, and smart contract calls."
    },
    {
      icon: Bot,
      title: "AI-Powered Automation",
      description: "Smart triggers and conditions that automatically execute based on market conditions or on-chain events."
    },
    {
      icon: Clock,
      title: "Scheduled Execution",
      description: "Set up recurring workflows that run automatically at specified intervals or specific times."
    },
    {
      icon: ShieldCheck,
      title: "Security First",
      description: "All transactions are signed locally with military-grade encryption. We never store your private keys."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor your workflow performance with detailed analytics and real-time execution tracking."
    }
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to build, automate, and scale your blockchain workflows
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureItem {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}