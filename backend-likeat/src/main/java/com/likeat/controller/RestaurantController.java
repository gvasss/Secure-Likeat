package com.likeat.controller;

import com.likeat.dto.RestaurantDTO;
import com.likeat.model.Restaurant;
import com.likeat.request.RestaurantRequest;
import com.likeat.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/likeat/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    // Public endpoints
    @GetMapping("/home")
    public List<RestaurantDTO> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('resturant:read') or hasAnyRole('CUSTOMER', 'CLIENT', 'ADMIN')")
    public RestaurantDTO getRestaurant(@Valid @PathVariable Long id) {
        return restaurantService.getRestaurant(id);
    }

    // Client endpoints
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('resturant:update') or hasAnyRole('CLIENT')")
    public Restaurant updatedRestaurant(@Valid @PathVariable Long id, @Valid @RequestBody RestaurantRequest updatedRestaurant) {
        return restaurantService.updateRestaurant(id, updatedRestaurant);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('resturant:delete') or hasAnyRole('CLIENT', 'ADMIN')")
    public String deleteRestaurant(@Valid @PathVariable Long id) {
        return restaurantService.deleteRestaurant(id);
    }

    @GetMapping("/client")
    @PreAuthorize("hasAnyAuthority('resturant:read') or hasAnyRole('CLIENT')")
    public List<Restaurant> getClientRestaurants(Principal connectedUser) {
        return restaurantService.getClientRestaurants(connectedUser);
    }

    @PostMapping()
    @PreAuthorize("hasAnyAuthority('resturant:create') or hasAnyRole('CLIENT')")
    public Long addRestaurant(@Valid @RequestBody RestaurantRequest newRestaurant, Principal connectedUser) {
        return restaurantService.addRestaurant(newRestaurant, connectedUser);
    }

    // Admin endpoints
    @GetMapping("/request")
    @PreAuthorize("hasAnyAuthority('resturant:read') or hasAnyRole('ADMIN')")
    public List<RestaurantDTO> getAllRequest() {
        return restaurantService.getAllRequest();
    }

    @PutMapping("/{id}/statusAccept")
    @PreAuthorize("hasAnyAuthority('resturant:update') or hasAnyRole('ADMIN')")
    public Restaurant acceptStatus(@Valid @PathVariable Long id) {
        return restaurantService.acceptStatus(id);
    }

    @PutMapping("/{id}/statusReject")
    @PreAuthorize("hasAnyAuthority('resturant:update') or hasAnyRole('ADMIN')")
    public Restaurant rejectStatus(@Valid @PathVariable Long id) {
        return restaurantService.rejectStatus(id);
    }
}