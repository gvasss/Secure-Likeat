package com.likeat.service;

import com.likeat.dto.ReviewDTO;
import com.likeat.exception.ReviewNotFoundException;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.Restaurant;
import com.likeat.model.Review;
import com.likeat.model.User;
import com.likeat.repository.ReviewRepository;
import com.likeat.repository.RestaurantRepository;
import com.likeat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public Review addReview(ReviewDTO reviewDTO) {
        User customer = userRepository.findById(reviewDTO.getCustomerUserId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Restaurant restaurant = restaurantRepository.findById(reviewDTO.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

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

    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(review -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setRating(review.getRating());
                    dto.setDescription(review.getDescription());
                    dto.setDate(review.getDate());
                    dto.setCustomerUserId(review.getCustomer().getId());
                    dto.setRestaurantId(review.getRestaurant().getId());
                    dto.setCustomerName(review.getCustomer().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public ReviewDTO getReviewById(Long id) {
        return reviewRepository.findById(id)
                .map(review -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setRating(review.getRating());
                    dto.setDescription(review.getDescription());
                    dto.setDate(review.getDate());
                    dto.setCustomerUserId(review.getCustomer().getId());
                    dto.setRestaurantId(review.getRestaurant().getId());
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

    public List<ReviewDTO> getCustomerReviews(Long id) {
        User customer = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return reviewRepository.findByCustomer(customer).stream()
                .map(review -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setRating(review.getRating());
                    dto.setDescription(review.getDescription());
                    dto.setDate(review.getDate());
                    dto.setCustomerUserId(review.getCustomer().getId());
                    dto.setRestaurantId(review.getRestaurant().getId());
                    dto.setCustomerName(review.getCustomer().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getRestaurantReviews(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return reviewRepository.findByRestaurantId(restaurant).stream()
                .map(review -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setRating(review.getRating());
                    dto.setDescription(review.getDescription());
                    dto.setDate(review.getDate());
                    dto.setCustomerUserId(review.getCustomer().getId());
                    dto.setRestaurantId(review.getRestaurant().getId());
                    dto.setCustomerName(review.getCustomer().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}