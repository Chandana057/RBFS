package org.example.filesharingsystem.repository;

import org.example.filesharingsystem.model.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    // This will help us find files later
    List<FileEntity> findByUploaderId(Long userId);
    @Query("SELECT f FROM FileEntity f WHERE f.uploader.role IN :roles")
    List<FileEntity> findByUploaderRoles(@Param("roles") List<String> roles);
}