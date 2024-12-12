package com.likeat.service;

import com.likeat.dto.RestaurantDTO;
import com.likeat.dto.RestaurantHomeDTO;
import com.likeat.dto.ReviewDTO;
import com.likeat.exception.RestaurantNotFoundException;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.*;
import com.likeat.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final PhotoRepository photoRepository;

    public List<RestaurantHomeDTO> getAllRestaurantsHome() {
        RestaurantStatus status = RestaurantStatus.ACCEPT;
        List<Restaurant> restaurants = restaurantRepository.findByStatus(status);

        return restaurants.stream().map(restaurant -> {
            RestaurantHomeDTO dto = new RestaurantHomeDTO();
            dto.setId(restaurant.getId());
            List<Photo> photos = photoRepository.findByRestaurantIdAndIsMain(restaurant.getId(), true);
            dto.setPhoto(photos);
            dto.setName(restaurant.getName());
            dto.setLocation(restaurant.getLocation());
            dto.setStyle(restaurant.getStyle());
            dto.setCuisine(restaurant.getCuisine());
            dto.setCost(restaurant.getCost());
            List<Review> reviews = reviewRepository.findByRestaurantId(restaurant);
            dto.setOverallRating(calculateAverageRating(reviews));
            dto.setTotalReviews(reviews.size());

            return dto;
        }).collect(Collectors.toList());
    }

    public RestaurantHomeDTO getRestaurantDetails(Long id) {
        Optional<Restaurant> restaurantDetails = restaurantRepository.findById(id);

        return restaurantDetails.map(restaurant -> {
            RestaurantHomeDTO dto = new RestaurantHomeDTO();
            dto.setId(restaurant.getId());
            List<Photo> photos = photoRepository.findByRestaurantId(restaurant.getId());
            dto.setPhoto(photos);
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
            List<Review> reviews = reviewRepository.findByRestaurantId(restaurant);
            dto.setReviews(reviews.stream().map(review -> {
                ReviewDTO reviewDTO = new ReviewDTO();
                reviewDTO.setRestaurantId(review.getRestaurant().getId());
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

    public Restaurant updateRestaurant(Long id, Restaurant updatedRestaurant) {
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

    public List<Restaurant> getAllRequest() {
        RestaurantStatus status = RestaurantStatus.PENDING;
        return restaurantRepository.findByStatus(status);
    }

    public Restaurant updateAcceptStatus(Long id) {
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

    public Restaurant updateRejectStatus(Long id) {
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

    public List<Restaurant> getClientRestaurants(Long id) {
        User client = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return restaurantRepository.findByClient(client);
    }

    public Restaurant addRestaurant(RestaurantDTO restaurantDTO) {
        User client = userRepository.findById(restaurantDTO.getClientUserId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Restaurant restaurant = new Restaurant();
        restaurant.setClient(client);
        restaurant.setName(restaurantDTO.getName());
        restaurant.setAddress(restaurantDTO.getAddress());
        restaurant.setStyle(restaurantDTO.getStyle());
        restaurant.setCuisine(restaurantDTO.getCuisine());
        restaurant.setCost(restaurantDTO.getCost());
        restaurant.setInformation(restaurantDTO.getInformation());
        restaurant.setPhone(restaurantDTO.getPhone());
        restaurant.setOpeningHours(restaurantDTO.getOpeningHours());
        restaurant.setLocation(restaurantDTO.getLocation());
        restaurant.setStatus(RestaurantStatus.PENDING);
        return restaurantRepository.save(restaurant);
    }

    public List<RestaurantHomeDTO> getRestaurantDetailsAdmin() {
        RestaurantStatus status = RestaurantStatus.ACCEPT;
        List<Restaurant> restaurants = restaurantRepository.findByStatus(status);

        return restaurants.stream().map(restaurant -> {
            RestaurantHomeDTO dto = new RestaurantHomeDTO();
            dto.setId(restaurant.getId());
            dto.setName(restaurant.getName());
            dto.setClientName(restaurant.getClient().getName());
            dto.setLocation(restaurant.getLocation());
            dto.setStyle(restaurant.getStyle());
            dto.setCost(restaurant.getCost());
            List<Review> reviews = reviewRepository.findByRestaurantId(restaurant);
            dto.setOverallRating(calculateAverageRating(reviews));
            dto.setTotalReviews(reviews.size());

            return dto;
        }).collect(Collectors.toList());
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