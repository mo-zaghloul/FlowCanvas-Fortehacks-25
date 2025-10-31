// src/components/ProfileManager.tsx
"use client";
import { useState, useEffect, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Edit3, Save, X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTransaction } from "@/hooks/useTransaction";
import { createProfile, updateProfile } from "@/services/transactionService";
import { checkProfile } from "@/services/flowService";
import { toast } from "sonner";

export const ProfileManager: FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
  const { currentUser } = useAuth();
  const { executeTransaction, status, isPending } = useTransaction();
  
  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentUser?.addr) {
      checkUserProfile();
    }
  }, [currentUser?.addr]);

  const checkUserProfile = async () => {
    if (!currentUser?.addr) return;
    
    try {
      const profileExists = await checkProfile(currentUser.addr);
      setHasProfile(profileExists);
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    try {
      await executeTransaction(() => createProfile(name, description));
      setHasProfile(true);
      setIsEditing(false);
      toast.success("Profile created successfully!");
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    try {
      await executeTransaction(() => updateProfile(name, description));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!currentUser?.loggedIn) {
    // When the sidebar is collapsed, render a compact icon-only card with a title for hover tooltip
    if (collapsed) {
      return (
        <div title="Connect your wallet" className="flex justify-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-800/40 border border-slate-700">
            <User className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      );
    }

    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="text-center text-slate-400">
            <User className="w-12 h-12 mx-auto mb-3 text-slate-500" />
            <p>Connect your wallet to manage your profile</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If the sidebar is collapsed, show a compact logged-in view as well
  if (collapsed) {
    return (
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-800/40 border border-slate-700">
          <User className="w-5 h-5 text-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-200">
          <User className="w-5 h-5" />
          Flow Profile
        </CardTitle>
        <CardDescription className="text-slate-400">
          {hasProfile ? "Manage your on-chain profile" : "Create your on-chain profile"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-slate-700 border-slate-600 text-slate-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Description
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description"
                className="bg-slate-700 border-slate-600 text-slate-200"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={hasProfile ? handleUpdateProfile : handleCreateProfile}
                disabled={isPending || !name.trim()}
                className="flex-1"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isPending ? "Processing..." : hasProfile ? "Update" : "Create"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {hasProfile ? (
              <div className="text-slate-300">
                <p>Your profile is stored on the Flow blockchain!</p>
              </div>
            ) : (
              <div className="text-slate-400 text-center py-4">
                <p>No profile found</p>
                <p className="text-sm mt-1">Create your first on-chain profile</p>
              </div>
            )}
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full"
              variant={hasProfile ? "outline" : "default"}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {hasProfile ? "Edit Profile" : "Create Profile"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};