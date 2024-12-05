package com.likeat.repository;

import com.likeat.model.Restaurant;
import com.likeat.model.Review;
import com.likeat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Map;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCustomer(User customer);
    List<Review> findByRestaurantId(Restaurant restaurantId);
}
