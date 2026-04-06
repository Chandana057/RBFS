package org.example.filesharingsystem.service;

import org.example.filesharingsystem.model.FileEntity;
import org.example.filesharingsystem.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public FileEntity saveFile(FileEntity file) {
        return fileRepository.save(file);
    }

    public FileEntity getFileById(Long id) {
        // This finds the file info (path, name) in MySQL using the ID
        return fileRepository.findById(id).orElse(null);
    }

    public List<FileEntity> getFilesByUserId(Long userId) {
        return fileRepository.findByUploaderId(userId);
    }

    public List<FileEntity> getAllFiles() {
        return fileRepository.findAll();
    }
    public List<FileEntity> getFilesByRoles(List<String> roles) {
        return fileRepository.findByUploaderRoles(roles);
    }
    @Transactional
    public boolean deleteFile(Long fileId) {
        if (fileRepository.existsById(fileId)) {
            fileRepository.deleteById(fileId);
            return true;
        }
        return false;
    }
}