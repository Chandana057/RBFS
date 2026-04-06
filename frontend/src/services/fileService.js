import { MOCK_INITIAL_FILES } from "./mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: initialize or get files from local storage
const getStoredFiles = () => {
  const stored = localStorage.getItem("sharevault_files");
  if (!stored) {
    localStorage.setItem("sharevault_files", JSON.stringify(MOCK_INITIAL_FILES));
    return MOCK_INITIAL_FILES;
  }
  return JSON.parse(stored);
};

export const fileService = {
  async getFiles(role, userId) {
    await delay(600);
    const files = getStoredFiles();
    
    // Role-based access implementation
    if (role === "admin") {
      return files; // Admins see everything
    } else {
      // Users only see files they own or files with "all" permissions
      return files.filter(f => f.ownerId === userId || f.permissions === "all");
    }
  },

  async uploadFile(fileData) {
    await delay(1200); // Simulate upload time
    const files = getStoredFiles();
    
    const newFile = {
      id: `file-${Date.now()}`,
      name: fileData.name,
      type: fileData.type,
      size: fileData.size,
      ownerId: fileData.ownerId,
      ownerName: fileData.ownerName,
      uploadDate: new Date().toISOString(),
      permissions: fileData.permissions || "all", // Default mock permission
    };

    const newFiles = [newFile, ...files];
    localStorage.setItem("sharevault_files", JSON.stringify(newFiles));
    
    return newFile;
  },

  async deleteFile(fileId, userRole, userId) {
    await delay(500);
    const files = getStoredFiles();
    const file = files.find(f => f.id === fileId);
    
    if (!file) throw new Error("File not found");
    
    // Check permission
    if (userRole !== "admin" && file.ownerId !== userId) {
      throw new Error("Access Denied: You cannot delete this file");
    }

    const updatedFiles = files.filter(f => f.id !== fileId);
    localStorage.setItem("sharevault_files", JSON.stringify(updatedFiles));
    return true;
  },

  async updateFilePermissions(fileId, newPermission, userRole) {
    await delay(300);
    if (userRole !== "admin") {
      throw new Error("Access Denied: Only admins can modify permissions");
    }

    const files = getStoredFiles();
    const index = files.findIndex(f => f.id === fileId);
    if (index === -1) throw new Error("File not found");

    files[index].permissions = newPermission;
    localStorage.setItem("sharevault_files", JSON.stringify(files));
    return files[index];
  }
};
