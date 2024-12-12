//package com.likeat.controller;
//
//import com.likeat.dto.RestaurantHomeDTO;
//import com.likeat.dto.UserDTO;
//import com.likeat.exception.UserNotFoundException;
//import com.likeat.model.*;
//import com.likeat.repository.RestaurantRepository;
//import com.likeat.repository.ReviewRepository;
//import com.likeat.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/likeat/users/admins")
//@PreAuthorize("hasRole('ADMIN')")
//public class AdminController {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private RestaurantRepository restaurantRepository;
//
//    @Autowired
//    private ReviewRepository reviewRepository;
//
//    // admin
////    @GetMapping("/")
////    @PreAuthorize("hasAuthority('admin:read')")
////    public Optional<User> getAllAdmins() {
////        return userRepository.findAllByRole(Role.ADMIN);
////    }
//
////    @GetMapping("/{id}")
////    @PreAuthorize("hasAuthority('admin:read')")
////    public UserDTO getUser(@PathVariable Long id) {
////        Optional<User> userDetails =  userRepository.findById(id);
////
////        return userDetails.map(user -> {
////            UserDTO dto = new UserDTO();
////            dto.setId(user.getId());
////            dto.setRole(user.getRole().toString());
////            dto.setUsername(user.getUsername());
////            dto.setName(user.getName());
////            dto.setSurname(user.getSurname());
////            dto.setEmail(user.getEmail());
////
////            return dto;
////        }).orElseThrow(() -> new UserNotFoundException(id));
////    }
//
////    @DeleteMapping("/{id}")
////    @PreAuthorize("hasAuthority('admin:delete')")
////    String deleteUser(@PathVariable Long id) {
////        if (!userRepository.existsById(id)) {
////            throw new UserNotFoundException(id);
////        }
////        userRepository.deleteById(id);
////        return "User with id " + id + " deleted.";
////    }
//
//    // client
////    @GetMapping("/clients")
////    @PreAuthorize("hasAuthority('client:read')")
////    public Optional<User> getAllClients() {
////        return userRepository.findAllByRole(Role.CLIENT);
////    }
//
//    // restaurant
//    @GetMapping("/restaurants")
//    @PreAuthorize("hasAuthority('restaurant:read')")
//    public List<RestaurantHomeDTO> getRestaurantDetailsAdmin() {
//        RestaurantStatus status = RestaurantStatus.ACCEPT;
//        List<Restaurant> restaurants = restaurantRepository.findByStatus(status);
//
//        return restaurants.stream().map(restaurant -> {
//            RestaurantHomeDTO dto = new RestaurantHomeDTO();
//            dto.setId(restaurant.getId());
//            dto.setName(restaurant.getName());
//            dto.setClientName(restaurant.getClient().getName());
//            dto.setLocation(restaurant.getLocation());
//            dto.setStyle(restaurant.getStyle());
//            dto.setCost(restaurant.getCost());
//            List<Review> reviews = reviewRepository.findByRestaurantId(restaurant);
//            dto.setOverallRating(calculateAverageRating(reviews));
//            dto.setTotalReviews(reviews.size());
//
//            return dto;
//        }).collect(Collectors.toList());
//    }
//
//    private double calculateAverageRating(List<Review> reviews) {
//        if (reviews == null || reviews.isEmpty()) {
//            return 0.0;
//        }
//        double totalRating = reviews.stream()
//                .mapToInt(Review::getRating)
//                .sum();
//        return totalRating / reviews.size();
//    }
//
//    // customer
////    @GetMapping("/customers")
////    @PreAuthorize("hasAuthority('customer:read')")
////    public List<UserDTO> getCustomerDetailsAdmin() {
////        Optional<User> customers = userRepository.findAllByRole(Role.CUSTOMER);
////
////        return customers.stream().map(customer -> {
////            UserDTO dto = new UserDTO();
////            dto.setId(customer.getId());
////            dto.setName(customer.getName());
////            dto.setSurname(customer.getSurname());
////            dto.setEmail(customer.getEmail());
////            dto.setUsername(customer.getUsername());
////            dto.setTotalReviews(reviewRepository.findByCustomer(customer).size());
////            return dto;
////        }).collect(Collectors.toList());
////    }
//}