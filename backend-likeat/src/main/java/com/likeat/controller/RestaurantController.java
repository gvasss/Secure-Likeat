package com.likeat.controller;

import com.likeat.dto.RestaurantDTO;
import com.likeat.dto.RestaurantHomeDTO;
import com.likeat.model.Restaurant;
import com.likeat.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/likeat/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/home")
    public List<RestaurantHomeDTO> getAllRestaurantsHome() {
        return restaurantService.getAllRestaurantsHome();
    }

    @GetMapping("/{id}/details")
    @PreAuthorize("hasAnyAuthority('resturant:read') or hasAnyRole('CUSTOMER', 'CLIENT', 'ADMIN')")
    public RestaurantHomeDTO getRestaurantDetails(@PathVariable Long id) {
        return restaurantService.getRestaurantDetails(id);
    }

    @PutMapping("/restaurant/{id}")
    @PreAuthorize("hasAnyAuthority('resturant:update') or hasAnyRole('CLIENT')")
    public Restaurant getUpdatedRestaurant(@PathVariable Long id, @RequestBody Restaurant updatedRestaurant) {
        return restaurantService.updateRestaurant(id, updatedRestaurant);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('resturant:delete') or hasAnyRole('CLIENT', 'ADMIN')")
    public String deleteRestaurant(@PathVariable Long id) {
        return restaurantService.deleteRestaurant(id);
    }

    @GetMapping("/request")
    @PreAuthorize("hasAnyAuthority('resturant:read') or hasAnyRole('ADMIN')")
    public List<Restaurant> getAllRequest() {
        return restaurantService.getAllRequest();
    }

    @PutMapping("/{id}/statusAccept")
    @PreAuthorize("hasAnyAuthority('resturant:update') or hasAnyRole('ADMIN')")
    public Restaurant updateAcceptStatus(@PathVariable Long id) {
        return restaurantService.updateAcceptStatus(id);
    }

    @PutMapping("/restaurant/statusReject/{id}")
    @PreAuthorize("hasAnyAuthority('resturant:update') or hasAnyRole('ADMIN')")
    public Restaurant updateRejectStatus(@PathVariable Long id) {
        return restaurantService.updateRejectStatus(id);
    }

    @GetMapping("/{id}/client")
    @PreAuthorize("hasAnyAuthority('resturant:read') or hasAnyRole('CLIENT')")
    public List<Restaurant> getClientRestaurants(@PathVariable Long id) {
        return restaurantService.getClientRestaurants(id);
    }

    @PostMapping("/restaurant")
    @PreAuthorize("hasAnyAuthority('resturant:create') or hasAnyRole('CLIENT')")
    public Restaurant newRestaurant(@RequestBody RestaurantDTO restaurantDTO) {
        return restaurantService.addRestaurant(restaurantDTO);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyAuthority('resturant:read') or hasAnyRole('ADMIN')")
    public List<RestaurantHomeDTO> getRestaurantDetailsAdmin() {
        return restaurantService.getRestaurantDetailsAdmin();
    }
}

//    @PostMapping("/restaurant")
//    public Restaurant newRestaurant(@RequestBody RestaurantDTO restaurantDTO) {
//        User client = userRepository.findById(restaurantDTO.getClientUserId())
//                .orElseThrow(() -> new RuntimeException("Client not found"));
//
//        Restaurant restaurant = new Restaurant();
//        restaurant.setClient(client);
//        restaurant.setName(restaurantDTO.getName());
//        restaurant.setAddress(restaurantDTO.getAddress());
//        restaurant.setStyle(restaurantDTO.getStyle());
//        restaurant.setCuisine(restaurantDTO.getCuisine());
//        restaurant.setCost(restaurantDTO.getCost());
//        restaurant.setInformation(restaurantDTO.getInformation());
//        restaurant.setPhone(restaurantDTO.getPhone());
//        restaurant.setOpeningHours(restaurantDTO.getOpeningHours());
//        restaurant.setLocation(restaurantDTO.getLocation());
//        restaurant.setStatus(RestaurantStatus.PENDING);
//        return restaurantRepository.save(restaurant);
//    }

//    @GetMapping("/restaurants")
//    public List<Restaurant> getAllRestaurants() {
//        RestaurantStatus status = RestaurantStatus.ACCEPT;
//        return restaurantRepository.findByStatus(status);
//    }

//    @GetMapping("/checkRestaurant")
//    public ResponseEntity<Boolean> checkRestaurantExists(@RequestParam String name, @RequestParam String address) {
//        Restaurant restaurant = restaurantRepository.findByNameAndAddress(name, address);
//        return ResponseEntity.ok(restaurant != null);
//    }

//    @GetMapping("/restaurant/{id}")
//    @PreAuthorize("hasAnyAuthority('resturant:read') or hasAnyRole('CLIENT', 'ADMIN')")
//    public Restaurant getRestaurantById(@PathVariable Long id) {
//        return restaurantRepository.findById(id)
//                .orElseThrow(() -> new UserNotFoundException(id));
//    }
