import React from "react";
import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl mx-auto pt-10">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-secondary opacity-80" />
        <CardContent className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=fallback`} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-surface bg-surface-container"
            />
            <div className="px-3 py-1 bg-primary/20 text-primary font-medium text-xs rounded-full uppercase tracking-wider">
              {user?.role || "Member"}
            </div>
          </div>
          <CardTitle className="text-2xl mb-1">{user?.name || "User"}</CardTitle>
          <p className="text-on-surface-variant mb-6">{user?.email || "user@sharevault.com"}</p>
          
          <div className="space-y-4 pt-6 border-t ghost-border">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Member Since</span>
              <span className="text-on-surface font-medium">January 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Authentication</span>
              <span className="text-secondary font-medium">Google SSO</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
