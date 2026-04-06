package org.example.filesharingsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
@Data
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String filePath;

    private LocalDateTime uploadDate = LocalDateTime.now();

    // The "Role-Based" logic: Who owns this file?
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User uploader;
}