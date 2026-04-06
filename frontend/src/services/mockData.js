export const MOCK_USERS = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@sharevault.com",
    role: "admin",
    password: "password123", // Obviously mock only
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  },
  {
    id: "user-2",
    name: "Regular User",
    email: "user@sharevault.com",
    role: "user",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
  },
];

export const MOCK_INITIAL_FILES = [
  {
    id: "file-1",
    name: "ShareVault-Architecture.pdf",
    type: "application/pdf",
    size: 2048576, // 2MB
    ownerId: "user-1",
    ownerName: "Admin User",
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    permissions: "admin-only",
  },
  {
    id: "file-2",
    name: "Q3-Financial-Report.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 512000,
    ownerId: "user-1",
    ownerName: "Admin User",
    uploadDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    permissions: "all",
  },
  {
    id: "file-3",
    name: "Brand-Assets-v2.zip",
    type: "application/zip",
    size: 15728640, // 15MB
    ownerId: "user-2",
    ownerName: "Regular User",
    uploadDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    permissions: "all",
  },
];
