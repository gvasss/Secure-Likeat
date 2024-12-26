package com.likeat.service;

import com.likeat.dto.UserDTO;
import com.likeat.exception.UserNotFoundException;
import com.likeat.exception.WrongPasswordException;
import com.likeat.model.Restaurant;
import com.likeat.model.Review;
import com.likeat.model.Role;
import com.likeat.model.User;
import com.likeat.repository.RestaurantRepository;
import com.likeat.repository.ReviewRepository;
import com.likeat.repository.UserRepository;
import com.likeat.request.ChangePasswordRequest;
import com.likeat.request.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;

    // USER
    public void updateUser(UpdateUserRequest request, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        var email = userRepository.existsByEmailAndIdNot(request.getEmail(), user.getId());
        if (email) {
            throw new IllegalStateException("Email already exists");
        }

        userRepository.findById(user.getId())
            .map(existingUser -> {
                existingUser.setName(request.getName());
                existingUser.setSurname(request.getSurname());
                existingUser.setEmail(request.getEmail());
                return userRepository.save(existingUser);
            }).orElseThrow(() -> new UserNotFoundException(user.getId()));
    }

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new WrongPasswordException();
        }
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Passwords are not the same");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

        // profile
    public UserDTO getProfile(Principal connectedUser) {
        var currentUser = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        return UserDTO.builder()
                .id(currentUser.getId())
                .username(currentUser.getUsername())
                .surname(currentUser.getSurname())
                .name(currentUser.getName())
                .email(currentUser.getEmail())
                .build();
    }

        // user for admin
    public UserDTO getUserById(Long id) {
        var currentUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        return UserDTO.builder()
                .id(currentUser.getId())
                .role(String.valueOf(currentUser.getRole()))
                .username(currentUser.getUsername())
                .surname(currentUser.getSurname())
                .name(currentUser.getName())
                .email(currentUser.getEmail())
                .build();
    }

    // CLIENT
    public String deleteClient(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Long id = user.getId();

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

    // CUSTOMER
    public String deleteCustomer(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Long id = user.getId();

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

    // ADMIN
    public String deleteAdmin(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Long id = user.getId();

        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }

        userRepository.deleteById(id);
        return "Admin with id " + id + " and their reviews deleted.";
    }

        // dashboard view
    public List<UserDTO> getAdmins() {
        return userRepository.findAllByRole(Role.ADMIN).stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .surname(user.getSurname())
                        .name(user.getName())
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toList());
    }

    public List<UserDTO> getClients() {
        return userRepository.findAllByRole(Role.CLIENT).stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .surname(user.getSurname())
                        .name(user.getName())
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toList());
    }

    public List<UserDTO> getCustomers() {
        return userRepository.findAllByRole(Role.CUSTOMER).stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .surname(user.getSurname())
                        .name(user.getName())
                        .email(user.getEmail())
                        .totalReviews(reviewRepository.countByCustomer(user))
                        .build())
                .collect(Collectors.toList());
    }

        // admin dashboard delete
    public String deleteAdmin(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }

        userRepository.deleteById(id);
        return "Admin with id " + id + " and their reviews deleted.";
    }

    public String deleteClient(Long id) {
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

    public String deleteCustomer(Long id) {
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
}