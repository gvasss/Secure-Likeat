package com.likeat.controller;

import com.likeat.dto.UserDTO;
import com.likeat.request.ChangePasswordRequest;
import com.likeat.request.UpdateUserRequest;
import com.likeat.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/likeat/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    // USER
    @GetMapping("/{connectedUser}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CLIENT', 'ADMIN')")
    public UserDTO getProfile(@PathVariable Principal connectedUser) {
        return service.getProfile(connectedUser);
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CLIENT', 'ADMIN')")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest request, Principal connectedUser) {
        service.updateUser(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/change-password")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CLIENT', 'ADMIN')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal connectedUser) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    // CLIENT
    @DeleteMapping("/client/{connectedUser}")
    @PreAuthorize("hasAnyAuthority('client:delete') or hasAnyRole('CLIENT')")
    String deleteClient(@PathVariable Principal connectedUser) {
        return service.deleteClient(connectedUser);
    }

    // CUSTOMER
    @DeleteMapping("/customer/{connectedUser}")
    @PreAuthorize("hasAnyAuthority('customer:delete') or hasAnyRole('CUSTOMER')")
    String deleteCustomer(@PathVariable Principal connectedUser) {
        return service.deleteCustomer(connectedUser);
    }

    // ADMIN
    @DeleteMapping("/admin/{connectedUser}")
    @PreAuthorize("hasAnyAuthority('admin:delete') or hasAnyRole('ADMIN')")
    String deleteAdmin(@PathVariable Principal connectedUser) {
        return service.deleteAdmin(connectedUser);
    }

        // dashboard view
    @GetMapping("/admins")
    @PreAuthorize("hasAnyAuthority('admin:read') or hasAnyRole('ADMIN')")
    public List<UserDTO> getAdmins() {
        return service.getAdmins();
    }

    @GetMapping("/clients")
    @PreAuthorize("hasAnyAuthority('client:read') or hasAnyRole('ADMIN')")
    public List<UserDTO> getClients() {
        return service.getClients();
    }

    @GetMapping("/customers")
    @PreAuthorize("hasAnyAuthority('customer:read') or hasAnyRole('ADMIN')")
    public List<UserDTO> getCustomers() {
        return service.getCustomers();
    }

        //dashboard delete
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('admin:delete')")
    String deleteAdmin(@PathVariable Long id) {
        return service.deleteAdmin(id);
    }

    @DeleteMapping("/client/{id}")
    @PreAuthorize("hasAuthority('client:delete')")
    String deleteClient(@PathVariable Long id) {
        return service.deleteClient(id);
    }

    @DeleteMapping("/customer/{id}")
    @PreAuthorize("hasAuthority('customer:delete')")
    String deleteCustomer(@PathVariable Long id) {
        return service.deleteCustomer(id);
    }

        // dashboard details
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public UserDTO getUser(@PathVariable Long id) {
        return service.getUser(id);
    }

//    @PostMapping("/user")
//    User newUser(@RequestBody User newUser) {
//        return userRepository.save(newUser);
//    }

//    @GetMapping("/users")
//    List<User> getAllUsers() {
//        return userRepository.findAll();
//    }

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

//    @GetMapping("/client/{id}/restaurants")
//    public List<Restaurant> getClientRestaurants(@PathVariable Long id) {
//        User client = userRepository.findById(id)
//                .orElseThrow(() -> new UserNotFoundException(id));
//        return restaurantRepository.findByClient(client);
//    }

//    @GetMapping("/customers")
//    public Optional<User> getAllCustomers() {
//        return userRepository.findAllByRole(Role.CUSTOMER);
//    }



//    @GetMapping("/customer/{id}/reviews")
//    public List<Review> getCustomerReviews(@PathVariable Long id) {
//        User customer = userRepository.findById(id)
//                .orElseThrow(() -> new UserNotFoundException(id));
//        return reviewRepository.findByCustomer(customer);
//    }
}