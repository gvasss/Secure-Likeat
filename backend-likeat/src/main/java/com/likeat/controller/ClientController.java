package com.likeat.controller;

import com.likeat.exception.UserNotFoundException;
import com.likeat.model.Client;
import com.likeat.model.Restaurant;
import com.likeat.repository.ClientRepository;
import com.likeat.repository.RestaurantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping("/client")
    Client newClient(@RequestBody Client newClient) {
        return clientRepository.save(newClient);
    }

    @GetMapping("/clients")
    List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @GetMapping("/client/{user_id}")
    Client getClientById(@PathVariable Long user_id) {
        return clientRepository.findById(user_id)
                .orElseThrow(()->new UserNotFoundException(user_id));
    }

    @PutMapping("/client/{user_id}")
    Client getUpdatedClient(@PathVariable Long user_id, @RequestBody Client updatedClient) {
        return clientRepository.findById(user_id)
                .map(Client -> {
                    Client.setUsername(updatedClient.getUsername());
                    Client.setName(updatedClient.getName());
                    Client.setSurname(updatedClient.getSurname());
                    Client.setEmail(updatedClient.getEmail());
                    return clientRepository.save(Client);
                }).orElseThrow(()->new UserNotFoundException(user_id));
    }

    @DeleteMapping("/client/{user_id}")
    String deleteClient(@PathVariable Long user_id) {
        if (!clientRepository.existsById(user_id)) {
            throw new UserNotFoundException(user_id);
        }

        Client client = clientRepository.findById(user_id)
                .orElseThrow(() -> new UserNotFoundException(user_id));

        List<Restaurant> restaurants = restaurantRepository.findByClientUserId(client);
        if (!restaurants.isEmpty()) {
            restaurantRepository.deleteAll(restaurants);
        }

        clientRepository.deleteById(user_id);
        return "Client with id " + user_id + " and their restaurants deleted.";
    }

    @GetMapping("/client/{user_id}/restaurants")
    public List<Restaurant> getClientRestaurants(@PathVariable Long user_id) {
        Client client = clientRepository.findById(user_id)
                .orElseThrow(() -> new UserNotFoundException(user_id));
        return restaurantRepository.findByClientUserId(client);
    }
}