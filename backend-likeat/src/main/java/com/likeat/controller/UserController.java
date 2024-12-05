package com.likeat.controller;

import com.likeat.exception.UserNotFoundException;
import com.likeat.model.*;
import com.likeat.repository.RestaurantRepository;
import com.likeat.repository.ReviewRepository;
import com.likeat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/likeat/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

//    @Autowired
//    private ReviewRepository reviewRepository;

//    @PostMapping("/user")
//    User newUser(@RequestBody User newUser) {
//        return userRepository.save(newUser);
//    }

//    @GetMapping("/users")
//    List<User> getAllUsers() {
//        return userRepository.findAll();
//    }

    // USER

//    @GetMapping("/{id}")
//    User getUserById(@PathVariable Long id) {
//        return userRepository.findById(id)
//                .orElseThrow(()->new UserNotFoundException(id));
//    }

//    @PostMapping("/login")
//    public ResponseEntity<?> authenticate(@RequestBody LoginDTO authRequest) {
//        User user = userRepository.findByUsername(authRequest.getUsername());
//        if (user != null && user.getPassword().equals(authRequest.getPassword())) {
//            return ResponseEntity.ok(user);
//        }
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//    }

//    @GetMapping("/checkUsername/{username}")
//    public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
//        User user = userRepository.findByUsername(username);
//        return ResponseEntity.ok(user != null);
//    }

//    @GetMapping("/checkEmail/{email}")
//    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
//        User user = userRepository.findByEmail(email);
//        return ResponseEntity.ok(user != null);
//    }

    @GetMapping("/checkUsernameForUpdate/{id}/{username}")
    public ResponseEntity<Boolean> checkUsernameForUpdate(@PathVariable Long id, @PathVariable String username) {
        boolean exists = userRepository.existsByUsernameAndIdNot(username, id);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/checkEmailForUpdate/{id}/{email}")
    public ResponseEntity<Boolean> checkEmailForUpdate(@PathVariable Long id, @PathVariable String email) {
        boolean exists = userRepository.existsByEmailAndIdNot(email, id);
        return ResponseEntity.ok(exists);
    }

//    @PostMapping("/user/{id}/verify-password")
//    public ResponseEntity<?> verifyPassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
//        String currentPassword = request.get("currentPassword");
//        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
//
//        if (user.getPassword().equals(currentPassword)) {
//            return ResponseEntity.ok().build();
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid current password");
//        }
//    }

//    @PutMapping("/user/{id}/password")
//    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
//        String newPassword = request.get("password");
//        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
//
//        user.setPassword(newPassword);
//        userRepository.save(user);
//
//        return ResponseEntity.ok("Password updated successfully");
//    }

//    @GetMapping("/{id}")
//    public UserDTO getUser(@PathVariable Long id) {
//        Optional<User> userDetails =  userRepository.findById(id);
//
//        return userDetails.map(user -> {
//            UserDTO dto = new UserDTO();
//            dto.setId(user.getId());
//            dto.setRole(user.getRole().toString());
//            dto.setUsername(user.getUsername());
//            dto.setName(user.getName());
//            dto.setSurname(user.getSurname());
//            dto.setEmail(user.getEmail());
//
//            return dto;
//        }).orElseThrow(() -> new UserNotFoundException(id));
//    }

    @PutMapping("/{id}")
    User getUpdatedUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id)
                .map(User -> {
                    User.setUsername(updatedUser.getUsername());
                    User.setName(updatedUser.getName());
                    User.setSurname(updatedUser.getSurname());
                    User.setEmail(updatedUser.getEmail());
                    return userRepository.save(User);
                }).orElseThrow(()->new UserNotFoundException(id));
    }

    // CLIENT
    @DeleteMapping("/client/{id}")
    String deleteClient(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }

        User client = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        List<Restaurant> restaurants = restaurantRepository.findByClient(client);
        if (!restaurants.isEmpty()) {
            restaurantRepository.deleteAll(restaurants);
        }

        userRepository.deleteById(id);
        return "Client with id " + id + " and their restaurants deleted.";
    }

//    @GetMapping("/client/{id}/restaurants")
//    public List<Restaurant> getClientRestaurants(@PathVariable Long id) {
//        User client = userRepository.findById(id)
//                .orElseThrow(() -> new UserNotFoundException(id));
//        return restaurantRepository.findByClient(client);
//    }

    // CUSTOMER
//    @GetMapping("/customers")
//    public Optional<User> getAllCustomers() {
//        return userRepository.findAllByRole(Role.CUSTOMER);
//    }

    @DeleteMapping("/customer/{id}")
    String deleteCustomer(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }

        User customer = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        List<Review> reviews = reviewRepository.findByCustomer(customer);
        if (!reviews.isEmpty()) {
            reviewRepository.deleteAll(reviews);
        }

        userRepository.deleteById(id);
        return "Customer with id " + id + " and their reviews deleted.";
    }

//    @GetMapping("/customer/{id}/reviews")
//    public List<Review> getCustomerReviews(@PathVariable Long id) {
//        User customer = userRepository.findById(id)
//                .orElseThrow(() -> new UserNotFoundException(id));
//        return reviewRepository.findByCustomer(customer);
//    }
}