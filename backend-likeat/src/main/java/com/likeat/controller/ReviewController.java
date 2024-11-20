package com.likeat.controller;
import com.likeat.dto.ReviewDTO;
import com.likeat.exception.ReviewNotFoundException;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.Customer;
import com.likeat.model.Restaurant;
import com.likeat.model.Review;
import com.likeat.repository.ReviewRepository;
import com.likeat.repository.CustomerRepository;
import com.likeat.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping("/review")
    public Review newReview(@RequestBody ReviewDTO reviewDTO) {
        Customer customer = customerRepository.findById(reviewDTO.getCustomerUserId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Convert restaurantId to Restaurant object
        Restaurant restaurant = restaurantRepository.findById(reviewDTO.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Create Review object
        Review review = new Review(
                null,
                reviewDTO.getRating(),
                reviewDTO.getDescription(),
                reviewDTO.getDate(),
                customer,
                restaurant
        );

        return reviewRepository.save(review);
    }

    @GetMapping("/reviews")
    List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @GetMapping("/review/{id}")
    Review getReviewById(@PathVariable Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(()->new ReviewNotFoundException(id));
    }

    @PutMapping("/review/{id}")
    Review getUpdatedReview(@PathVariable Long id, @RequestBody Review updatedReview) {
        return reviewRepository.findById(id)
                .map(Review -> {
                    Review.setRating(updatedReview.getRating());
                    Review.setDescription(updatedReview.getDescription());
                    Review.setDate(updatedReview.getDate());
                    return reviewRepository.save(Review);
                }).orElseThrow(()->new ReviewNotFoundException(id));
    }

    @DeleteMapping("/review/{id}")
    String deleteReview(@PathVariable Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ReviewNotFoundException(id);
        }
        reviewRepository.deleteById(id);
        return "Review with id " + id + " deleted.";
    }

    @GetMapping("/restaurant/{id}/review-summary")
    public Map<String, Object> getReviewSummary(@PathVariable Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurant);
        int reviewCount = reviews.size();
        double averageRating = reviews.stream().mapToDouble(Review::getRating).average().orElse(0.0);

        Map<String, Object> summary = new HashMap<>();
        summary.put("averageRating", averageRating);
        summary.put("reviewCount", reviewCount);

        return summary;
    }
}
