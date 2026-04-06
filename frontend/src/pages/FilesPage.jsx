import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload, File, FileText, Image as ImageIcon, Archive, Download, Trash2, MoreVertical, Eye, Edit2 } from "lucide-react";
import { fileService } from "../services/fileService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";

export const FilesPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Advanced Menu States
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [isModifyModalOpen, setModifyModalOpen] = useState(false);
  const [modifyingFile, setModifyingFile] = useState(null);
  const [newPermission, setNewPermission] = useState("View-level");

  // Read Modal State
  const [selectedFileForView, setSelectedFileForView] = useState(null);

  const loadFiles = async () => {
    try {
      const data = await fileService.getFiles(user.role, user.id);
      setFiles(data);
    } catch (err) {
      toast.error("Failed to load files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [user.role, user.id]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const fakeFile = e.target.file.files[0];
    if (!fakeFile) return;

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(p => Math.min(p + 20, 90));
    }, 200);

    try {
      await fileService.uploadFile({
        name: fakeFile.name,
        type: fakeFile.type || "application/octet-stream",
        size: fakeFile.size,
        ownerId: user.id,
        ownerName: user.name,
        permissions: e.target.permissions.value
      });
      clearInterval(interval);
      setUploadProgress(100);
      toast.success("File uploaded successfully");
      setUploadModalOpen(false);
      loadFiles();
    } catch (err) {
      clearInterval(interval);
      toast.error("Upload failed");
    } finally {
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await fileService.deleteFile(fileId, user.role, user.id);
      toast.success("File deleted");
      setSelectedFileForView(null);
      setFiles(files.filter(f => f.id !== fileId));
    } catch (err) {
      toast.error(err.message || "Failed to delete file");
    }
  };

  const handleAction = (e, file, action) => {
    e.stopPropagation();
    setMenuOpenId(null);
    
    if (action === "view") {
      if (user.role === 'admin') {
        toast.info("Admin can grant access or modify file.");
        setSelectedFileForView(file);
      } else {
        // Enforce mock rule where normal users cannot view 'private' or 'Admin-level' unowned files
        if ((file.permissions === 'private' || file.permissions === 'Admin-level') && file.ownerId !== user.id) {
          toast.error("Cannot view or modify. Contact Admin.");
        } else {
          setSelectedFileForView(file);
        }
      }
    } else if (action === "modify") {
      if (file.type && file.type.includes("pdf")) {
        toast.error("Cannot modify PDF files.");
        return;
      }
      if (user.role === 'admin') {
        setModifyingFile(file);
        setNewPermission(file.permissions);
        setModifyModalOpen(true);
      } else {
        toast.error("Cannot modify. Contact Admin.");
      }
    } else if (action === "download") {
      // Mock logic: everyone with at least basic visibility can download, unless we explicitly restrict it
      toast.success(`Downloading ${file.name}...`);
    } else if (action === "delete") {
      if (file.type && file.type.includes("pdf")) {
        toast.error("Cannot modify or delete PDF files.");
        return;
      }
      handleDelete(file.id);
    }
  };

  const handleUpdatePermissions = async () => {
    try {
      await fileService.updateFilePermissions(modifyingFile.id, newPermission, user.role);
      toast.success("Permissions updated");
      setModifyModalOpen(false);
      loadFiles();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const getFileIcon = (type) => {
    if (type.includes("image")) return <ImageIcon className="w-8 h-8 text-secondary" />;
    if (type.includes("pdf")) return <FileText className="w-8 h-8 text-error" />;
    if (type.includes("zip") || type.includes("tar")) return <Archive className="w-8 h-8 text-tertiary" />;
    return <File className="w-8 h-8 text-primary" />;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-on-surface">Secure Vault</h1>
          <p className="text-on-surface-variant">Manage, view, and assign discrete permissions to assets.</p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} className="w-full sm:w-auto">
          <Upload className="w-4 h-4 mr-2" /> Upload File
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input 
            placeholder="Search files..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <Card key={i} className="animate-pulse h-40" />)}
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20 border ghost-border rounded-xl border-dashed">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive className="w-8 h-8 text-on-surface-variant" />
          </div>
          <h3 className="text-xl font-medium text-on-surface mb-2">No files found</h3>
          <p className="text-on-surface-variant">Your vault is empty or no files match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">
          <AnimatePresence>
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group hover:border-primary/50 transition-colors h-full flex flex-col cursor-pointer" onClick={(e) => handleAction(e, file, 'view')}>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-surface-container rounded-lg group-hover:bg-primary/10 transition-colors">
                        {getFileIcon(file.type)}
                      </div>
                      
                      <div className="relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === file.id ? null : file.id); }}
                          className="text-on-surface-variant p-1 rounded hover:bg-surface-variant/50 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        <AnimatePresence>
                          {menuOpenId === file.id && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                              className="absolute right-0 top-full mt-1 w-48 glass-panel shadow-ambient ghost-border border py-1 rounded-md z-50"
                            >
                              <button onClick={(e) => handleAction(e, file, 'view')} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-variant/50 flex flex-row items-center gap-2"><Eye className="w-4 h-4"/> View</button>
                              <button onClick={(e) => handleAction(e, file, 'download')} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-variant/50 flex flex-row items-center gap-2"><Download className="w-4 h-4"/> Download</button>
                              
                              <button 
                                onClick={(e) => handleAction(e, file, 'modify')} 
                                className={`w-full text-left px-4 py-2 text-sm font-medium flex flex-row items-center gap-2 border-t ghost-border transition-colors ${
                                  file.type.includes('pdf') || user.role !== 'admin' 
                                    ? "text-on-surface-variant/50 cursor-not-allowed hover:bg-transparent" 
                                    : "text-on-surface hover:bg-surface-variant/50"
                                }`}
                              >
                                <Edit2 className="w-4 h-4"/> Modify Permissions
                              </button>
                              
                              {user.role === 'admin' && !file.type.includes('pdf') && (
                                <button onClick={(e) => handleAction(e, file, 'delete')} className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex flex-row items-center gap-2"><Trash2 className="w-4 h-4"/> Delete</button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-on-surface truncate mb-1 flex-1" title={file.name}>{file.name}</h3>
                    <div className="flex justify-between items-center text-xs text-on-surface-variant mt-2 pt-2 border-t ghost-border">
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                      <Badge variant="default" className="text-[10px] py-0">{file.permissions}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {menuOpenId !== null && (
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />
          )}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload to Vault">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-8 text-center bg-surface-container-lowest/50 hover:bg-surface-container transition-colors relative">
            <input 
              type="file" 
              name="file" 
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-10 h-10 text-primary mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium text-on-surface">Click or drag file to this area to upload</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">Initial Access Level</label>
            <select name="permissions" className="flex h-10 w-full rounded-lg bg-surface-container-lowest border ghost-border px-4 py-2 text-sm text-on-surface focus-visible:outline-none focus:ring-1 focus:ring-primary">
              <option value="View-level">View-level</option>
              <option value="Read-level">Read-level</option>
              <option value="Write-level">Write-level</option>
              <option value="Admin-level">Admin-level</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={uploadProgress > 0}>
            {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Start Upload"}
          </Button>
        </form>
      </Modal>

      {/* Modify Permission Modal */}
      <Modal isOpen={isModifyModalOpen} onClose={() => setModifyModalOpen(false)} title={`Assign Role Level`}>
        <div className="space-y-6">
          <p className="text-sm text-on-surface-variant">Admin access confirmed. Modify the access clearance required for <strong>{modifyingFile?.name}</strong>.</p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">Access Clearance Level</label>
            <Select 
              value={newPermission}
              onChange={setNewPermission}
              options={[
                { value: "View-level", label: "View-level (Restricted)" },
                { value: "Read-level", label: "Read-level (Internal)" },
                { value: "Write-level", label: "Write-level (Collaborator)" },
                { value: "Admin-level", label: "Admin-level (Strict)" }
              ]}
            />
          </div>
          <div className="pt-4 flex justify-end">
            <Button onClick={handleUpdatePermissions}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* File Viewer Details Drawer */}
      <Modal isOpen={!!selectedFileForView} onClose={() => setSelectedFileForView(null)} title="File Verification">
        {selectedFileForView && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-surface-container rounded-xl">
              {getFileIcon(selectedFileForView.type)}
               <div className="flex-1 min-w-0">
                <h4 className="font-medium text-on-surface truncate">{selectedFileForView.name}</h4>
                <p className="text-sm text-on-surface-variant">{(selectedFileForView.size / 1024).toFixed(1)} KB • {selectedFileForView.type || "Unknown Type"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-on-surface-variant mb-1">Uploaded By</p>
                <p className="font-medium text-on-surface">{selectedFileForView.ownerName}</p>
              </div>
              <div>
                <p className="text-on-surface-variant mb-1">Date</p>
                <p className="font-medium text-on-surface">{new Date(selectedFileForView.uploadDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-on-surface-variant mb-1">Required Clearance</p>
                <Badge variant={selectedFileForView.permissions.includes("Admin") ? "primary" : "default"}>{selectedFileForView.permissions}</Badge>
              </div>
              <div>
                <p className="text-on-surface-variant mb-1">Status</p>
                <Badge variant="success">Secured</Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
