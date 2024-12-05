package com.likeat.controller;

import com.likeat.dto.RestaurantDTO;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.RestaurantStatus;
import com.likeat.model.User;
import com.likeat.model.Restaurant;
import com.likeat.repository.UserRepository;
import com.likeat.repository.RestaurantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/likeat/users/clients")
@PreAuthorize("hasRole('CLIENT')")
public class ClientController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @GetMapping("/{id}/restaurants")
    @PreAuthorize("hasAuthority('restaurant:read')")
    public List<Restaurant> getClientRestaurants(@PathVariable Long id) {
        User client = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return restaurantRepository.findByClient(client);
    }

    @PostMapping("/restaurant")
    @PreAuthorize("hasAuthority('restaurant:create')")
    public Restaurant newRestaurant(@RequestBody RestaurantDTO restaurantDTO) {
        User client = userRepository.findById(restaurantDTO.getClientUserId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Restaurant restaurant = new Restaurant();
        restaurant.setClient(client);
        restaurant.setName(restaurantDTO.getName());
        restaurant.setAddress(restaurantDTO.getAddress());
        restaurant.setStyle(restaurantDTO.getStyle());
        restaurant.setCuisine(restaurantDTO.getCuisine());
        restaurant.setCost(restaurantDTO.getCost());
        restaurant.setInformation(restaurantDTO.getInformation());
        restaurant.setPhone(restaurantDTO.getPhone());
        restaurant.setOpeningHours(restaurantDTO.getOpeningHours());
        restaurant.setLocation(restaurantDTO.getLocation());
        restaurant.setStatus(RestaurantStatus.PENDING);
        return restaurantRepository.save(restaurant);
    }
}