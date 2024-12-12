package com.likeat.controller;

import com.likeat.model.Photo;
import com.likeat.model.Restaurant;
import com.likeat.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/likeat/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyAuthority('restaurant:update') or hasAnyRole('CLIENT')")
    public ResponseEntity<Restaurant> addPhoto(
            @PathVariable Long restaurantId,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestParam(value = "additionalImage", required = false) MultipartFile[] additionalImages) throws IOException, SQLException {
        Restaurant restaurant = photoService.addPhoto(restaurantId, mainImage, additionalImages);
        return ResponseEntity.ok(restaurant);
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyAuthority('restaurnat:read') or hasAnyRole('CLIENT')")
    public List<Photo> getPhotosByRestaurant(@PathVariable Long restaurantId, @RequestParam(required = false) Boolean main) {
        return photoService.getPhotosByRestaurant(restaurantId, main);
    }

    @DeleteMapping("/{photoId}")
    @PreAuthorize("hasAnyAuthority('restarant:delete') or hasAnyRole('CLIENT')")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long photoId) {
        photoService.deletePhoto(photoId);
        return ResponseEntity.noContent().build();
    }
}