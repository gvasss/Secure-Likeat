package com.likeat.repository;

import com.likeat.model.Restaurant;
import com.likeat.model.RestaurantStatus;
import com.likeat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    @Query("SELECT r FROM Restaurant r WHERE r.client = :client")
    List<Restaurant> findByClient(@Param("client") User client);

    @Query("SELECT r FROM Restaurant r WHERE r.status = :status")
    List<Restaurant> findByStatus(@Param("status") RestaurantStatus status);
}