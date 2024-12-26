package com.likeat.service;

import com.likeat.exception.RestaurantNotFoundException;
import com.likeat.model.Photo;
import com.likeat.model.Restaurant;
import com.likeat.repository.PhotoRepository;
import com.likeat.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final RestaurantRepository restaurantRepository;

    public void addPhoto(Long restaurantId, MultipartFile mainImage, MultipartFile[] additionalImages) throws IOException, SQLException {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RestaurantNotFoundException(restaurantId));

        if (mainImage != null && !mainImage.isEmpty()) {
            List<Photo> existingMainImages = photoRepository.findByRestaurantAndIsMain(restaurant, true);
            if (!existingMainImages.isEmpty()) {
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
    }

    public void deletePhoto(Long photoId) {
        if (!photoRepository.existsById(photoId)) {
            throw new IllegalArgumentException("Photo not found");
        }
        photoRepository.deleteById(photoId);
    }
}