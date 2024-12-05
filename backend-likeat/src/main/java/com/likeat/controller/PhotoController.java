package com.likeat.controller;

import com.likeat.exception.RestaurantNotFoundException;
import com.likeat.model.Photo;
import com.likeat.model.Restaurant;
import com.likeat.repository.PhotoRepository;
import com.likeat.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/likeat/photos")
@RequiredArgsConstructor
public class PhotoController {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Restaurant> addPhoto(
            @PathVariable Long restaurantId,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestParam(value = "additionalImage", required = false) MultipartFile[] additionalImages) throws IOException, SQLException {

        // Find the restaurant by ID
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RestaurantNotFoundException(restaurantId));

        // Save new main image if provided
        if (mainImage != null && !mainImage.isEmpty()) {
            List<Photo> existingMainImages = photoRepository.findByRestaurantAndIsMain(restaurant, true);
            if (!existingMainImages.isEmpty()) {
                // Delete the existing main image
                photoRepository.deleteAll(existingMainImages);
            }

            byte[] mainImageBytes = mainImage.getBytes();
            Blob mainImageBlob = new SerialBlob(mainImageBytes);
            Photo mainPhoto = new Photo();
            mainPhoto.setRestaurant(restaurant);
            mainPhoto.setImage(mainImageBlob);
            mainPhoto.setMain(true);
            photoRepository.save(mainPhoto);
        }

        if (additionalImages != null) {
            for (MultipartFile image : additionalImages) {
                if (image != null && !image.isEmpty()) {
                    byte[] bytes = image.getBytes();
                    Blob blob = new SerialBlob(bytes);

                    Photo photo = new Photo();
                    photo.setRestaurant(restaurant);
                    photo.setImage(blob);
                    photo.setMain(false);
                    photoRepository.save(photo);
                }
            }
        }
        return ResponseEntity.ok(restaurant);
    }

    // Method to get all photos of a restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public List<Photo> getPhotosByRestaurant(@PathVariable Long restaurantId, @RequestParam(required = false) Boolean main) {
        if (main != null && main) {
            return photoRepository.findByRestaurantIdAndIsMain(restaurantId, true);
        } else {
            return photoRepository.findByRestaurantId(restaurantId);
        }
    }

    // Method to delete a photo by its ID
    @DeleteMapping("/{photoId}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long photoId) {
        if (!photoRepository.existsById(photoId)) {
            return ResponseEntity.notFound().build();
        }
        photoRepository.deleteById(photoId);
        return ResponseEntity.noContent().build();
    }
}