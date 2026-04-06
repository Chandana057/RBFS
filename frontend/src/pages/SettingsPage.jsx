import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, Save, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { settingsService } from "../services/settingsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Switch } from "../components/ui/Switch";
import { Select } from "../components/ui/Select";
import { ComponentLoader } from "../components/ui/LoadingState";

export const SettingsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load initial settings
    if (user) {
      setSettings(settingsService.getSettings(user.id));
    }
  }, [user]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate network delay
    setTimeout(() => {
      settingsService.updateSettings(user.id, settings);
      setIsSaving(false);
      toast.success("Settings saved successfully.");
    }, 800);
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (!settings) {
    return <ComponentLoader text="Loading preferences..." className="min-h-[50vh]" />;
  }

  const tabs = [
    { id: "account", label: "Account Info", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-manrope font-bold text-on-surface">Settings</h1>
        <p className="text-on-surface-variant">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 border border-transparent"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b ghost-border">
                  <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full bg-surface-container" />
                  <div>
                    <Button variant="secondary" className="mb-2">Change Avatar</Button>
                    <p className="text-xs text-on-surface-variant">JPG, GIF or PNG. Max size of 800K.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Full Name</label>
                    <Input defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Email Address</label>
                    <Input defaultValue={user.email} disabled className="opacity-50" />
                    <p className="text-xs text-on-surface-variant">Contact an admin to change your email.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface">Role / Designation</label>
                    <Input defaultValue={user.role.toUpperCase()} disabled className="opacity-50 text-primary font-medium" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what alerts you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-on-surface">Email Notifications</p>
                    <p className="text-sm text-on-surface-variant">Receive alerts when someone shares a file with you.</p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications} 
                    onChange={(val) => updateSetting("emailNotifications", val)} 
                    aria-label="Toggle email notifications"
                  />
                </div>
                <div className="flex items-center justify-between border-t ghost-border pt-6">
                  <div>
                    <p className="font-medium text-on-surface">Push Notifications</p>
                    <p className="text-sm text-on-surface-variant">Get desktop alerts for critical security events.</p>
                  </div>
                  <Switch 
                    checked={settings.pushNotifications} 
                    onChange={(val) => updateSetting("pushNotifications", val)} 
                    aria-label="Toggle push notifications"
                  />
                </div>
                <div className="flex items-center justify-between border-t ghost-border pt-6">
                  <div>
                    <p className="font-medium text-on-surface">Marketing Emails</p>
                    <p className="text-sm text-on-surface-variant">Receive news, updates, and promotional content.</p>
                  </div>
                  <Switch 
                    checked={settings.marketingEmails} 
                    onChange={(val) => updateSetting("marketingEmails", val)} 
                    aria-label="Toggle marketing emails"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Keep your account and assets safe.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-on-surface">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-on-surface-variant">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch 
                    checked={settings.twoFactorAuth} 
                    onChange={(val) => updateSetting("twoFactorAuth", val)} 
                    aria-label="Toggle 2FA"
                  />
                </div>
                <div className="space-y-4 border-t ghost-border pt-6">
                  <div>
                    <p className="font-medium text-on-surface mb-2">Session Timeout</p>
                    <p className="text-sm text-on-surface-variant mb-4">Automatically log out after inactivity.</p>
                  </div>
                  <Select 
                    value={settings.sessionTimeout}
                    onChange={(val) => updateSetting("sessionTimeout", val)}
                    aria-label="Session timeout duration"
                    options={[
                      { value: "15", label: "15 Minutes" },
                      { value: "30", label: "30 Minutes" },
                      { value: "60", label: "1 Hour" },
                      { value: "never", label: "Never" },
                    ]}
                  />
                </div>
                <div className="border-t ghost-border pt-6">
                  <p className="font-medium text-error mb-2">Danger Zone</p>
                  <Button variant="danger" className="w-full sm:w-auto">Deactivate Account</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how ShareVault looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-on-surface mb-2">Theme Preference</p>
                    <p className="text-sm text-on-surface-variant mb-4">Select your preferred color scheme.</p>
                  </div>
                  <Select 
                    value={settings.theme}
                    onChange={(val) => updateSetting("theme", val)}
                    aria-label="Theme selection"
                    options={[
                      { value: "dark", label: "Obsidian (Dark Mode)" },
                      { value: "light", label: "Light Mode (Coming Soon)" },
                      { value: "system", label: "System Default" },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Footer */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="sm:w-32">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
