package com.likeat.service;

import com.likeat.dto.ReviewDTO;
import com.likeat.exception.ReviewNotFoundException;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.Restaurant;
import com.likeat.model.Review;
import com.likeat.model.User;
import com.likeat.repository.ReviewRepository;
import com.likeat.repository.RestaurantRepository;
import com.likeat.request.ReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;

    public Review addReview(ReviewRequest newReview, Principal connectedUser) {
        var customer = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        Restaurant restaurant = restaurantRepository.findById(newReview.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Review review = new Review(
                null,
                newReview.getRating(),
                newReview.getDescription(),
                new java.sql.Date(System.currentTimeMillis()),
                customer,
                restaurant
        );

        return reviewRepository.save(review);
    }

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(review -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setId(review.getId());
                    dto.setRating(review.getRating());
                    dto.setDescription(review.getDescription());
                    dto.setDate(review.getDate());
                    dto.setCustomerName(review.getCustomer().getName());
                    dto.setRestaurantName(review.getRestaurant().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public ReviewDTO getReviewById(Long id) {
        return reviewRepository.findById(id)
                .map(review -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setId(review.getId());
                    dto.setRating(review.getRating());
                    dto.setDescription(review.getDescription());
                    dto.setDate(review.getDate());
                    dto.setRestaurantName(review.getRestaurant().getName());
                    dto.setCustomerName(review.getCustomer().getName());
                    return dto;
                })
                .orElseThrow(() -> new ReviewNotFoundException(id));
    }

    public String deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ReviewNotFoundException(id);
        }
        reviewRepository.deleteById(id);
        return "Review with id " + id + " deleted.";
    }

    public List<ReviewDTO> getCustomerReviews(Principal connectedUser) {
        var customer = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        return reviewRepository.findByCustomer(customer).stream()
                .map(review -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setRating(review.getRating());
                    dto.setDescription(review.getDescription());
                    dto.setDate(review.getDate());
                    dto.setRestaurantName(review.getRestaurant().getName());
                    dto.setCustomerName(review.getCustomer().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getRestaurantReviews(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return reviewRepository.findByRestaurantId(restaurant.getId()).stream()
                .map(review -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setRating(review.getRating());
                    dto.setDescription(review.getDescription());
                    dto.setDate(review.getDate());
                    dto.setRestaurantName(review.getRestaurant().getName());
                    dto.setCustomerName(review.getCustomer().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}