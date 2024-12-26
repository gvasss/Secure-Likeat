package com.likeat.service;

import com.likeat.dto.RestaurantDTO;
import com.likeat.dto.ReviewDTO;
import com.likeat.exception.RestaurantNotFoundException;
import com.likeat.model.*;
import com.likeat.repository.*;
import com.likeat.request.RestaurantRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final PhotoRepository photoRepository;

    // Public endpoints
    public List<RestaurantDTO> getAllRestaurants() {
        RestaurantStatus status = RestaurantStatus.ACCEPT;
        List<Restaurant> restaurants = restaurantRepository.findByStatus(status);

        return restaurants.stream().map(restaurant -> {
            RestaurantDTO dto = new RestaurantDTO();
            dto.setId(restaurant.getId());
            List<Photo> photos = photoRepository.findByRestaurantId(restaurant.getId());
            dto.setMainPhoto(photos.stream()
                .filter(Photo::getIsMain)
                .findFirst()
                .orElse(null));
            dto.setAdditionalPhotos(photos.stream()
                .filter(photo -> !photo.getIsMain())
                .collect(Collectors.toList()));
            dto.setName(restaurant.getName());
            dto.setLocation(restaurant.getLocation());
            dto.setStyle(restaurant.getStyle());
            dto.setCuisine(restaurant.getCuisine());
            dto.setCost(restaurant.getCost());
            List<Review> reviews = reviewRepository.findByRestaurantId(restaurant.getId());
            dto.setOverallRating(calculateAverageRating(reviews));
            dto.setTotalReviews(reviews.size());
            dto.setClientName(restaurant.getClient().getName());

            return dto;
        }).collect(Collectors.toList());
    }

    public RestaurantDTO getRestaurant(Long id) {
        Optional<Restaurant> restaurantDetails = restaurantRepository.findById(id);

        return restaurantDetails.map(restaurant -> {
            RestaurantDTO dto = new RestaurantDTO();
            dto.setId(restaurant.getId());
            List<Photo> photos = photoRepository.findByRestaurantId(restaurant.getId());
            dto.setMainPhoto(photos.stream()
                    .filter(Photo::getIsMain)
                    .findFirst()
                    .orElse(null));
            dto.setAdditionalPhotos(photos.stream()
                    .filter(photo -> !photo.getIsMain())
                    .collect(Collectors.toList()));
            dto.setName(restaurant.getName());
            dto.setLocation(restaurant.getLocation());
            dto.setStyle(restaurant.getStyle());
            dto.setCuisine(restaurant.getCuisine());
            dto.setCost(restaurant.getCost());
            dto.setInformation(restaurant.getInformation());
            dto.setPhone(restaurant.getPhone());
            dto.setOpeningHours(restaurant.getOpeningHours());
            dto.setAddress(restaurant.getAddress());
            dto.setClientName(restaurant.getClient().getName());
            List<Review> reviews = reviewRepository.findByRestaurantId(restaurant.getId());
            dto.setReviews(reviews.stream().map(review -> {
                ReviewDTO reviewDTO = new ReviewDTO();
                reviewDTO.setRestaurantName(review.getRestaurant().getName());
                reviewDTO.setRating(review.getRating());
                reviewDTO.setDescription(review.getDescription());
                reviewDTO.setDate(review.getDate());
                reviewDTO.setCustomerName(review.getCustomer().getName());
                return reviewDTO;
            }).collect(Collectors.toList()));
            dto.setOverallRating(calculateAverageRating(reviews));
            dto.setTotalReviews(reviews.size());

            return dto;
        }).orElseThrow(() -> new RestaurantNotFoundException(id));
    }

    // Client endpoints
    public Restaurant updateRestaurant(Long id, RestaurantRequest updatedRestaurant) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    restaurant.setName(updatedRestaurant.getName());
                    restaurant.setAddress(updatedRestaurant.getAddress());
                    restaurant.setStyle(updatedRestaurant.getStyle());
                    restaurant.setCuisine(updatedRestaurant.getCuisine());
                    restaurant.setCost(updatedRestaurant.getCost());
                    restaurant.setInformation(updatedRestaurant.getInformation());
                    restaurant.setPhone(updatedRestaurant.getPhone());
                    restaurant.setOpeningHours(updatedRestaurant.getOpeningHours());
                    restaurant.setLocation(updatedRestaurant.getLocation());
                    restaurant.setStatus(RestaurantStatus.PENDING);
                    return restaurantRepository.save(restaurant);
                }).orElseThrow(() -> new RestaurantNotFoundException(id));
    }

    public String deleteRestaurant(Long id) {
        if (!restaurantRepository.existsById(id)) {
            throw new RestaurantNotFoundException(id);
        }
        restaurantRepository.deleteById(id);
        return "Restaurant with id " + id + " deleted.";
    }

    public List<Restaurant> getClientRestaurants(Principal connectedUser) {
        var client = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        return restaurantRepository.findByClient(client);
    }

    public Long addRestaurant(RestaurantRequest newRestaurant, Principal connectedUser) {
        var client = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        var restaurant = Restaurant.builder()
                .client(client)
                .name(newRestaurant.getName())
                .address(newRestaurant.getAddress())
                .style(newRestaurant.getStyle())
                .cuisine(newRestaurant.getCuisine())
                .cost(newRestaurant.getCost())
                .information(newRestaurant.getInformation())
                .phone(newRestaurant.getPhone())
                .openingHours(newRestaurant.getOpeningHours())
                .location(newRestaurant.getLocation())
                .status(RestaurantStatus.PENDING)
                .build();
        restaurantRepository.save(restaurant);
        return restaurant.getId();
    }

    // Admin endpoints
    public List<RestaurantDTO> getAllRequest() {
        RestaurantStatus status = RestaurantStatus.PENDING;
        List<Restaurant> restaurants = restaurantRepository.findByStatus(status);

        return restaurants.stream().map(restaurant -> {
            RestaurantDTO dto = new RestaurantDTO();
            dto.setId(restaurant.getId());
            dto.setName(restaurant.getName());
            dto.setLocation(restaurant.getLocation());
            dto.setStyle(restaurant.getStyle());
            dto.setCuisine(restaurant.getCuisine());
            dto.setCost(restaurant.getCost());
            List<Review> reviews = reviewRepository.findByRestaurantId(restaurant.getId());
            dto.setOverallRating(calculateAverageRating(reviews));
            dto.setTotalReviews(reviews.size());
            dto.setClientName(restaurant.getClient().getName());
            dto.setStatus(String.valueOf(restaurant.getStatus()));

            return dto;
        }).collect(Collectors.toList());
    }

    public Restaurant acceptStatus(Long id) {
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
        if (restaurantOptional.isPresent()) {
            RestaurantStatus status = RestaurantStatus.ACCEPT;
            Restaurant restaurant = restaurantOptional.get();
            restaurant.setStatus(status);
            return restaurantRepository.save(restaurant);
        } else {
            throw new RuntimeException("Restaurant not found with id " + id);
        }
    }

    public Restaurant rejectStatus(Long id) {
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
        if (restaurantOptional.isPresent()) {
            RestaurantStatus status = RestaurantStatus.REJECT;
            Restaurant restaurant = restaurantOptional.get();
            restaurant.setStatus(status);
            return restaurantRepository.save(restaurant);
        } else {
            throw new RuntimeException("Restaurant not found with id " + id);
        }
    }

    private double calculateAverageRating(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }
        double totalRating = reviews.stream()
                .mapToInt(Review::getRating)
                .sum();
        return totalRating / reviews.size();
    }
}