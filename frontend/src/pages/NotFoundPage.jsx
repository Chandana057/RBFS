import React from "react";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { Button } from "../components/ui/Button";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-ambient z-10 glass-panel">
        <SearchX className="w-16 h-16 text-primary -rotate-12" />
      </div>
      
      <h1 className="text-6xl font-manrope font-bold text-on-surface mb-4 z-10">404</h1>
      <p className="text-xl text-on-surface-variant max-w-md mx-auto mb-10 z-10">
        We searched the vault, but the page you are looking for has been moved or doesn't exist.
      </p>
      
      <Link to="/dashboard" className="z-10">
        <Button size="lg" className="rounded-full px-8">Return to Dashboard</Button>
      </Link>
    </div>
  );
};
