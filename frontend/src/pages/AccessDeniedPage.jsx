import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/Button";

export const AccessDeniedPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,110,132,0.2)]">
        <ShieldAlert className="w-12 h-12 text-error" />
      </div>
      <h1 className="text-4xl font-manrope font-bold text-on-surface mb-4">Access Denied</h1>
      <p className="text-lg text-on-surface-variant max-w-md mx-auto mb-8">
        You do not have the required permissions to view this quadrant of the vault.
      </p>
      <Link to="/dashboard">
        <Button size="lg">Return to Dashboard</Button>
      </Link>
    </div>
  );
};
