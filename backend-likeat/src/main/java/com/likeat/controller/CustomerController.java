package com.likeat.controller;

import com.likeat.exception.UserNotFoundException;
import com.likeat.model.Review;
import com.likeat.model.User;
import com.likeat.repository.UserRepository;
import com.likeat.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/likeat/users/customers")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/{id}/reviews")
    @PreAuthorize("hasAuthority('review:read')")
    public List<Review> getCustomerReviews(@PathVariable Long id) {
        User customer = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return reviewRepository.findByCustomer(customer);
    }
}