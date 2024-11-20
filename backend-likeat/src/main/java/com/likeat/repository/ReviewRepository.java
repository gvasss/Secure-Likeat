package com.likeat.repository;

import com.likeat.model.Customer;
import com.likeat.model.Restaurant;
import com.likeat.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCustomerUserId(Customer customerUserId);
    List<Review> findByRestaurantId(Restaurant restaurantId);
}
