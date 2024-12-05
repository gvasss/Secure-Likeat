package com.likeat.repository;

import com.likeat.model.Restaurant;
import com.likeat.model.RestaurantStatus;
import com.likeat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByClient(User client);
    List<Restaurant> findByStatus(RestaurantStatus status);
    Restaurant findByNameAndAddress(String name, String address);
}