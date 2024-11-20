package com.likeat.controller;
import com.likeat.exception.UserNotFoundException;
import com.likeat.model.Customer;
import com.likeat.model.Review;
import com.likeat.repository.CustomerRepository;
import com.likeat.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping("/customer")
    Customer newCustomer(@RequestBody Customer newCustomer) {
        return customerRepository.save(newCustomer);
    }

    @GetMapping("/customers")
    List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/customer/{user_id}")
    Customer getCustomerById(@PathVariable Long user_id) {
        return customerRepository.findById(user_id)
                .orElseThrow(()->new UserNotFoundException(user_id));
    }

    @PutMapping("/customer/{user_id}")
    Customer getUpdatedCustomer(@PathVariable Long user_id, @RequestBody Customer updatedCustomer) {
        return customerRepository.findById(user_id)
                .map(Customer -> {
                    Customer.setUsername(updatedCustomer.getUsername());
                    Customer.setName(updatedCustomer.getName());
                    Customer.setSurname(updatedCustomer.getSurname());
                    Customer.setEmail(updatedCustomer.getEmail());
                    Customer.setLocation(updatedCustomer.getLocation());
                    return customerRepository.save(Customer);
                }).orElseThrow(()->new UserNotFoundException(user_id));
    }

    @DeleteMapping("/customer/{user_id}")
    String deleteCustomer(@PathVariable Long user_id) {
        if (!customerRepository.existsById(user_id)) {
            throw new UserNotFoundException(user_id);
        }

        Customer customer = customerRepository.findById(user_id)
                .orElseThrow(() -> new UserNotFoundException(user_id));

        List<Review> reviews = reviewRepository.findByCustomerUserId(customer);
        if (!reviews.isEmpty()) {
            reviewRepository.deleteAll(reviews);
        }

        customerRepository.deleteById(user_id);
        return "Customer with id " + user_id + " and their reviews deleted.";
    }

    @GetMapping("/customer/{user_id}/reviews")
    public List<Review> getCustomerReviews(@PathVariable Long user_id) {
        Customer customer = customerRepository.findById(user_id)
                .orElseThrow(() -> new UserNotFoundException(user_id));
        return reviewRepository.findByCustomerUserId(customer);
    }
}
