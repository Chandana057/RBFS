import React, { useState, useEffect } from "react";
import { FolderHeart, MoreHorizontal, Download, Eye, File } from "lucide-react";
import { fileService } from "../services/fileService";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/Card";

export const SharedFilesPage = () => {
  const { user } = useAuth();
  const [sharedFiles, setSharedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShared = async () => {
      // Mocking shared logic by getting files where user is not owner
      const allFiles = await fileService.getFiles(user.role, user.id);
      setSharedFiles(allFiles.filter(f => f.ownerId !== user.id)); // Assuming structure has ownerId
      setIsLoading(false);
    };
    fetchShared();
  }, [user]);

  if (isLoading) return <div className="p-8 text-on-surface-variant">Loading shared vault...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
          <FolderHeart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-manrope font-bold text-on-surface">Shared with Me</h1>
          <p className="text-on-surface-variant">Files and folders shared with you by other workspace members.</p>
        </div>
      </div>

      {sharedFiles.length === 0 ? (
        <Card className="border-dashed ghost-border bg-transparent">
          <CardContent className="h-64 flex flex-col items-center justify-center text-center">
            <FolderHeart className="w-12 h-12 text-on-surface-variant/30 mb-4" />
            <h3 className="text-lg font-medium text-on-surface">No Shared Files</h3>
            <p className="text-on-surface-variant max-w-sm mt-2">
              When other users share their assets with you, they will securely appear in this quadrant.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sharedFiles.map(file => (
            <Card key={file.id} className="group hover:border-secondary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center text-secondary">
                    <File className="w-5 h-5" />
                  </div>
                  <button className="p-1 hover:bg-surface-variant rounded-md text-on-surface-variant transition-colors group-hover:text-on-surface opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-medium text-on-surface mb-1 truncate">{file.name}</h3>
                <div className="flex justify-between items-center text-xs text-on-surface-variant">
                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                  <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
