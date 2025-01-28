package com.likeat.repository;

import com.likeat.model.Photo;
import com.likeat.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

    @Query("SELECT p FROM Photo p WHERE p.restaurant.id = :restaurantId")
    List<Photo> findByRestaurantId(@Param("restaurantId") Long restaurantId);

    @Query("SELECT p FROM Photo p WHERE p.restaurant = :restaurant AND p.isMain = :isMain")
    List<Photo> findByRestaurantAndIsMain(@Param("restaurant") Restaurant restaurant, @Param("isMain") boolean isMain);
}