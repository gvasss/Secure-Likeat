package com.likeat.repository;

import com.likeat.model.Review;
import com.likeat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE r.customer = :customer")
    List<Review> findByCustomer(@Param("customer") User customer);

    @Query("SELECT r FROM Review r WHERE r.restaurant.id = :id")
    List<Review> findByRestaurantId(@Param("id") Long id);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.customer = :user")
    int countByCustomer(@Param("user") User user);
}