import React from "react";
import { ShieldCheck, Key, Smartphone, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const SecurityPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-error/10 rounded-xl text-error">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-manrope font-bold text-on-surface">Security & Privacy</h1>
          <p className="text-on-surface-variant">Review your active sessions and secure your account.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5 text-primary" /> Password Management</CardTitle>
            <CardDescription>We recommend changing your password every 90 days.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl ghost-border mb-6 mx-6">
            <div>
              <p className="font-medium text-on-surface">Last changed: 45 days ago</p>
              <p className="text-sm text-on-surface-variant">Your password is strong.</p>
            </div>
            <Button variant="secondary">Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-secondary" /> Active Sessions</CardTitle>
            <CardDescription>Devices that are currently logged into your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y ghost-border">
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-on-surface flex items-center gap-2">MacBook Pro <span className="bg-success/20 text-success text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Current</span></p>
                  <p className="text-sm text-on-surface-variant">San Francisco, USA • Chrome 114</p>
                </div>
              </div>
              <div className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-on-surface">iPhone 13 Pro</p>
                  <p className="text-sm text-on-surface-variant">San Francisco, USA • Safari Mobile</p>
                </div>
                <Button variant="danger" size="sm">Revoke</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
