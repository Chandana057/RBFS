package org.example.filesharingsystem.controller;

import org.example.filesharingsystem.model.FileEntity;
import org.example.filesharingsystem.model.User;
import org.example.filesharingsystem.service.FileService;
import org.example.filesharingsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.bind.annotation.PathVariable;
import java.net.MalformedURLException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired // <--- Add this block
    private UserService userService;
    // This defines where the physical files are stored on your Windows PC
    private final String UPLOAD_DIR = "C:/uploads/";


    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("userId") Long userId) {
        try {
            System.out.println("Step 1: Received request for User ID: " + userId);

            User uploader = userService.getUserById(userId);
            if (uploader == null) {
                return "Error: User not found!";
            }

            // --- THE MISSING LOGIC START ---
            String fileName = file.getOriginalFilename();
            // Define your Windows path (Make sure C:/uploads exists!)
            String uploadDir = "C:/uploads/";
            String finalPath = uploadDir + fileName;

            FileEntity fileEntity = new FileEntity();
            fileEntity.setFileName(fileName);
            fileEntity.setFilePath(finalPath); // This satisfies the 'not-null' constraint
            fileEntity.setFileType(file.getContentType());
            fileEntity.setUploader(uploader);
            // --- THE MISSING LOGIC END ---

            System.out.println("Step 3: Attempting Repository Save with Path: " + finalPath);
            FileEntity savedFile = fileService.saveFile(fileEntity);

            System.out.println("Step 4: Save complete. New File ID: " + savedFile.getId());
            return "Success! File ID is: " + savedFile.getId();

        } catch (Exception e) {
            e.printStackTrace();
            return "System Error: " + e.getMessage();
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        try {
            // 1. Look up the file metadata from MySQL
            FileEntity fileEntity = fileService.getFileById(id);
            if (fileEntity == null) return ResponseEntity.notFound().build();

            // 2. Load the physical file from the C:/uploads folder
            Path path = Paths.get(fileEntity.getFilePath());
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists()) return ResponseEntity.notFound().build();

            // 3. Tell the browser "This is a file you should download"
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getFileName() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // This allows you to see all uploaded files at http://localhost:8080/api/files/all
    @GetMapping("/all")
    public ResponseEntity<List<FileEntity>> listAllFiles(@RequestParam Long userId) {
        User requester = userService.getUserById(userId);
        if (requester == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        String role = requester.getRole();

        // 1. ADMINS see everything (Full Database)
        if ("ROLE_ADMIN".equals(role)) {
            return ResponseEntity.ok(fileService.getAllFiles());
        }

        // 2. MANAGERS see Manager + Employee files
        if ("ROLE_MANAGER".equals(role)) {
            List<String> roles = Arrays.asList("ROLE_MANAGER", "ROLE_EMPLOYEE");
            return ResponseEntity.ok(fileService.getFilesByRoles(roles));
        }

        // 3. EMPLOYEES see ONLY their own files (By ID)
        if ("ROLE_EMPLOYEE".equals(role)) {
            return ResponseEntity.ok(fileService.getFilesByUserId(userId));
        }

        // Default: Return empty list if role is unknown
        return ResponseEntity.ok(Collections.emptyList());
    }
    @DeleteMapping("/delete/{id}")
    public String deleteFile(@PathVariable Long id) {
        try {
            // 1. Find file metadata to get the Path
            FileEntity fileEntity = fileService.getFileById(id);
            if (fileEntity == null) return "File not found in database.";

            // 2. Delete Physical File from C:/uploads/
            java.io.File fileOnDisk = new java.io.File(fileEntity.getFilePath());
            if (fileOnDisk.exists()) {
                if (fileOnDisk.delete()) {
                    System.out.println("Physical file deleted: " + fileEntity.getFilePath());
                } else {
                    return "Failed to delete physical file, but record exists.";
                }
            }

            // 3. Delete Database Record
            boolean deleted = fileService.deleteFile(id);

            return deleted ? "File and record deleted successfully!" : "Failed to delete record.";

        } catch (Exception e) {
            return "Error during deletion: " + e.getMessage();
        }
    }
}