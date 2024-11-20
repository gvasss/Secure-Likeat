package com.likeat.controller;

import com.likeat.dto.RestaurantDTO;
import com.likeat.exception.RestaurantNotFoundException;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.*;
import com.likeat.repository.ClientRepository;
import com.likeat.repository.RestaurantRepository;
import com.likeat.repository.ReviewRepository;
import com.likeat.repository.PhotoRepository;
import com.likeat.dto.RestaurantHomeDTO;

import com.likeat.service.BlobDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
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

    public String convertBlobToString(Blob blob) throws SQLException, UnsupportedEncodingException {
        int blobLength = (int) blob.length();
        byte[] blobAsBytes = blob.getBytes(1, blobLength);
        return new String(blobAsBytes, StandardCharsets.UTF_8);
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

//    @GetMapping("/restaurants/home")
//    public ResponseEntity<Map<String, Object>> getAllRestaurants(@RequestParam(required = false) String location) {
//        RestaurantStatus status = RestaurantStatus.ACCEPT;
//        List<Restaurant> restaurants;
//
//        if (location != null && !location.isEmpty()) {
//            restaurants = restaurantRepository.findByLocationAndStatus(location, status);
//        } else {
//            restaurants = restaurantRepository.findByStatus(status);
//        }
//
//        // Sort restaurants based on composite score
//        restaurants = sortRestaurants(restaurants);
//
//        // Gather unique filter values and sort them alphabetically
//        SortedSet<String> locations = new TreeSet<>();
//        SortedSet<String> styles = new TreeSet<>();
//        SortedSet<String> cuisines = new TreeSet<>();
//        SortedSet<Integer> costs = new TreeSet<>();
//
//        for (Restaurant restaurant : restaurants) {
//            locations.add(restaurant.getLocation());
//            styles.add(restaurant.getStyle());
//            cuisines.add(restaurant.getCuisine());
//            costs.add(restaurant.getCost());
//        }
//
//        // Prepare the response
//        Map<String, Object> response = new HashMap<>();
//        response.put("restaurants", restaurants);
//        response.put("filters", Map.of(
//                "locations", locations,
//                "styles", styles,
//                "cuisines", cuisines,
//                "costs", costs
//        ));
//
//        return ResponseEntity.ok(response);
//    }

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

    private List<Restaurant> sortRestaurants(List<Restaurant> restaurants) {
        return restaurants.stream()
                .sorted((a, b) -> {
                    double aScore = calculateCompositeScore(a);
                    double bScore = calculateCompositeScore(b);
                    return Double.compare(bScore, aScore);
                })
                .collect(Collectors.toList());
    }

    private double calculateCompositeScore(Restaurant restaurant) {
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurant);
        double averageRating = calculateAverageRating(reviews);
        int reviewCount = reviews.size();
        double ratingWeight = 0.6;
        double reviewWeight = 0.4;
        return (averageRating * ratingWeight) + (reviewCount * reviewWeight);
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