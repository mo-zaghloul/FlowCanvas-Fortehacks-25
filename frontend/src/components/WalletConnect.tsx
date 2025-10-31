// src/components/WalletConnect.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, User, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const WalletConnect = () => {
  const { currentUser, logIn, logOut } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (currentUser?.addr) {
      await navigator.clipboard.writeText(currentUser.addr);
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!currentUser?.loggedIn) {
    return (
      <Button
        onClick={logIn}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        size="sm"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
      <User className="w-4 h-4 text-green-400" />
      <button
        onClick={copyAddress}
        className="text-sm text-slate-200 hover:text-white transition-colors"
        title="Copy address"
      >
        {truncateAddress(currentUser.addr)}
      </button>
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-slate-400" />
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={logOut}
        className="h-8 w-8 p-0 hover:bg-red-500/20"
        title="Disconnect"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};