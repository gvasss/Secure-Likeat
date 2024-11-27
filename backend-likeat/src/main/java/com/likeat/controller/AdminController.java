package com.likeat.controller;

import com.likeat.dto.RestaurantHomeDTO;
import com.likeat.dto.UserDTO;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.*;
import com.likeat.repository.AdminRepository;
import com.likeat.repository.CustomerRepository;
import com.likeat.repository.RestaurantRepository;
import com.likeat.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // admin
    @PostMapping("/admin")
    Admin newAdmin(@RequestBody Admin newAdmin) {
        return adminRepository.save(newAdmin);
    }

    @GetMapping("/admins")
    List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @GetMapping("/admin/{user_id}")
    Admin getAdminById(@PathVariable Long user_id) {
        return adminRepository.findById(user_id)
                .orElseThrow(()->new UserNotFoundException(user_id));
    }

    @PutMapping("/admin/{user_id}")
    Admin getUpdatedAdmin(@PathVariable Long user_id, @RequestBody Admin updatedAdmin) {
        return adminRepository.findById(user_id)
                .map(Admin -> {
                    Admin.setUsername(updatedAdmin.getUsername());
                    Admin.setName(updatedAdmin.getName());
                    Admin.setSurname(updatedAdmin.getSurname());
                    Admin.setEmail(updatedAdmin.getEmail());
                    return adminRepository.save(Admin);
                }).orElseThrow(()->new UserNotFoundException(user_id));
    }

    @DeleteMapping("/admin/{user_id}/delete")
    String deleteAdmin(@PathVariable Long user_id) {
        if (!adminRepository.existsById(user_id)) {
            throw new UserNotFoundException(user_id);
        }
        adminRepository.deleteById(user_id);
        return "Admin with id " + user_id + " deleted.";
    }

    // restaurant
    @GetMapping("/admin/restaurants")
    public List<RestaurantHomeDTO> getRestaurantDetailsAdmin() {
        RestaurantStatus status = RestaurantStatus.ACCEPT;
        List<Restaurant> restaurants = restaurantRepository.findByStatus(status);

        return restaurants.stream().map(restaurant -> {
            RestaurantHomeDTO dto = new RestaurantHomeDTO();
            dto.setId(restaurant.getId());
            dto.setName(restaurant.getName());
            dto.setClientName(restaurant.getClientUserId().getName());
            dto.setLocation(restaurant.getLocation());
            dto.setStyle(restaurant.getStyle());
            dto.setCost(restaurant.getCost());
            List<Review> reviews = reviewRepository.findByRestaurantId(restaurant);
            dto.setOverallRating(calculateAverageRating(reviews));
            dto.setTotalReviews(reviews.size());

            return dto;
        }).collect(Collectors.toList());
    }

    private double calculateAverageRating(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }
        double totalRating = reviews.stream()
                .mapToInt(Review::getRating)
                .sum();
        return totalRating / reviews.size();
    }

    //customer
    @GetMapping("/admin/customers")
    public List<UserDTO> getCustomerDetailsAdmin() {
        List<Customer> customers = customerRepository.findAll();

        return customers.stream().map(customer -> {
            UserDTO dto = new UserDTO();
            dto.setId(customer.getId());
            dto.setName(customer.getName());
            dto.setSurname(customer.getSurname());
            dto.setEmail(customer.getEmail());
            dto.setLocation(customer.getLocation());
            dto.setUsername(customer.getUsername());
            dto.setTotalReviews(reviewRepository.findByCustomerUserId(customer).size());
            return dto;
        }).collect(Collectors.toList());
    }
}