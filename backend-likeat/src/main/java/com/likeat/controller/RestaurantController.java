package com.likeat.controller;

import com.likeat.dto.RestaurantDTO;
import com.likeat.dto.ReviewDTO;
import com.likeat.exception.RestaurantNotFoundException;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.*;
import com.likeat.repository.ClientRepository;
import com.likeat.repository.RestaurantRepository;
import com.likeat.repository.ReviewRepository;
import com.likeat.repository.PhotoRepository;
import com.likeat.dto.RestaurantHomeDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:3000")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PhotoRepository photoRepository;

    @PostMapping("/restaurant")
    public Restaurant newRestaurant(@RequestBody RestaurantDTO restaurantDTO) {
        Client client = clientRepository.findById(restaurantDTO.getClientUserId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Restaurant restaurant = new Restaurant();
        restaurant.setClientUserId(client);
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

    @GetMapping("/restaurants")
    public List<Restaurant> getAllRestaurants() {
        RestaurantStatus status = RestaurantStatus.ACCEPT;
        return restaurantRepository.findByStatus(status);
    }

    @GetMapping("/restaurants/home")
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

    @GetMapping("/restaurant/{id}/details")
    public RestaurantHomeDTO getRestaurantDetails(@PathVariable Long id) {
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
            List<Review> reviews = reviewRepository.findByRestaurantId(restaurant);
            dto.setReviews(reviews.stream().map(review -> {
                ReviewDTO reviewDTO = new ReviewDTO();
                reviewDTO.setRestaurantId(review.getRestaurantId().getId());
                reviewDTO.setRating(review.getRating());
                reviewDTO.setDescription(review.getDescription());
                reviewDTO.setDate(review.getDate());
                reviewDTO.setCustomerName(review.getCustomerUserId().getName());
                return reviewDTO;
            }).collect(Collectors.toList()));
            dto.setOverallRating(calculateAverageRating(reviews));

            return dto;
        }).orElseThrow(() -> new RestaurantNotFoundException(id));
    }

    @GetMapping("/restaurant/{id}")
    public Restaurant getRestaurantById(@PathVariable Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @PutMapping("/restaurant/{id}")
    public Restaurant getUpdatedRestaurant(@PathVariable Long id, @RequestBody Restaurant updatedRestaurant) {
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

    @DeleteMapping("/restaurant/{id}")
    public String deleteRestaurant(@PathVariable Long id) {
        if (!restaurantRepository.existsById(id)) {
            throw new RestaurantNotFoundException(id);
        }
        restaurantRepository.deleteById(id);
        return "Restaurant with id " + id + " deleted.";
    }

    @GetMapping("/restaurant/{id}/reviews")
    public List<Review> getRestaurantReviews(@PathVariable Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return reviewRepository.findByRestaurantId(restaurant);
    }

    @GetMapping("/restaurant/request")
    public List<Restaurant> getAllRequest(@RequestParam(required = false) String location) {
        RestaurantStatus status = RestaurantStatus.PENDING;
        return restaurantRepository.findByStatus(status);
    }

    @PutMapping("/restaurant/statusAccept/{id}")
    public Restaurant updateAcceptStatus(@PathVariable Long id) {
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

    @PutMapping("/restaurant/statusReject/{id}")
    public Restaurant updateRejectStatus(@PathVariable Long id) {
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

    @GetMapping("/checkRestaurant")
    public ResponseEntity<Boolean> checkRestaurantExists(@RequestParam String name, @RequestParam String address) {
        Restaurant restaurant = restaurantRepository.findByNameAndAddress(name, address);
        return ResponseEntity.ok(restaurant != null);
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