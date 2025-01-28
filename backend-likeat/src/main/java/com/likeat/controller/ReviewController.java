package com.likeat.controller;

import com.likeat.dto.ReviewDTO;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.Restaurant;
import com.likeat.model.Review;
import com.likeat.model.User;
import com.likeat.request.ReviewRequest;
import com.likeat.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/likeat/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping()
    @PreAuthorize("hasAnyAuthority('review:create') or hasAnyRole('CLIENT')")
    public Review addReview(@Valid @RequestBody ReviewRequest newReview, Principal connectedUser) {
        return reviewService.addReview(newReview, connectedUser);
    }

    @GetMapping()
    @PreAuthorize("hasAnyRole('ADMIN')")
    public List<ReviewDTO> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('review:read') or hasAnyRole('CUSTOMER', 'ADMIN')")
    public ReviewDTO getReviewById(@Valid @PathVariable Long id) {
        return reviewService.getReviewById(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('review:delete') or hasAnyRole('CUSTOMER', 'ADMIN')")
    public String deleteReview(@Valid @PathVariable Long id) {
        return reviewService.deleteReview(id);
    }

    @GetMapping("/customer")
    @PreAuthorize("hasAnyAuthority('review:read') or hasAnyRole('CUSTOMER')")
    public List<ReviewDTO> getCustomerReviews(Principal connectedUser) {
        return reviewService.getCustomerReviews(connectedUser);
    }

    @GetMapping("/restaurant/{id}")
    @PreAuthorize("hasAnyAuthority('review:read') or hasAnyRole('CLIENT')")
    public List<ReviewDTO> getRestaurantReviews(@Valid @PathVariable Long id) {
        return reviewService.getRestaurantReviews(id);
    }
}