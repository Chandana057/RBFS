const DEFAULT_SETTINGS = {
  theme: "dark",
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
  twoFactorAuth: false,
  sessionTimeout: "30",
};

export const settingsService = {
  getSettings(userId) {
    const key = `sharevault_settings_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(stored);
  },

  updateSettings(userId, newSettings) {
    const key = `sharevault_settings_${userId}`;
    const current = this.getSettings(userId);
    const updated = { ...current, ...newSettings };
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  }
};
