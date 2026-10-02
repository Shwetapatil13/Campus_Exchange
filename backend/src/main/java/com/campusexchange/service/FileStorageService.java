package com.campusexchange.service;

import com.campusexchange.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    private Path fileStorageLocation;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "webp", "gif");
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    );

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            Files.createDirectories(this.fileStorageLocation.resolve("products"));
            Files.createDirectories(this.fileStorageLocation.resolve("profiles"));
            log.info("Upload directory initialized at: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            log.error("Could not create upload directory", ex);
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    public String storeProductImage(MultipartFile file) {
        return storeFile(file, "products");
    }

    public String storeProfileImage(MultipartFile file) {
        return storeFile(file, "profiles");
    }

    private String storeFile(MultipartFile file, String subfolder) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg");
        String extension = getFileExtension(originalFilename).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Invalid file extension. Only JPG, JPEG, PNG, WEBP, and GIF are allowed.");
        }

        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid content type: " + contentType);
        }

        String newFilename = UUID.randomUUID().toString() + "." + extension;
        Path targetLocation = this.fileStorageLocation.resolve(subfolder).resolve(newFilename);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + subfolder + "/" + newFilename;
        } catch (IOException ex) {
            log.error("Failed to store file {}", originalFilename, ex);
            throw new BadRequestException("Could not store file " + originalFilename + ". Please try again!");
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex + 1);
    }
}
