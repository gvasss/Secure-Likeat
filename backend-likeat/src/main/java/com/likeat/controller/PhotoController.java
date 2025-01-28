package com.likeat.controller;

import com.likeat.service.PhotoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;

@RestController
@RequestMapping("/likeat/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyAuthority('restaurant:update') or hasAnyRole('CLIENT')")
    public ResponseEntity<?> addPhoto(
            @PathVariable Long restaurantId,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestParam(value = "additionalImage", required = false) MultipartFile[] additionalImages) throws IOException, SQLException {
        photoService.addPhoto(restaurantId, mainImage, additionalImages);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{photoId}")
    @PreAuthorize("hasAnyAuthority('restarant:delete') or hasAnyRole('CLIENT')")
    public ResponseEntity<Void> deletePhoto(@Valid @PathVariable Long photoId) {
        photoService.deletePhoto(photoId);
        return ResponseEntity.noContent().build();
    }
}