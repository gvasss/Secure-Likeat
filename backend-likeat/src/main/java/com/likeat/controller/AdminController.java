package com.likeat.controller;

import com.likeat.exception.UserNotFoundException;
import com.likeat.model.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class AdminController {

    @Autowired
    private com.likeat.repository.AdminRepository AdminRepository;

    @PostMapping("/admin")
    Admin newAdmin(@RequestBody Admin newAdmin) {
        return AdminRepository.save(newAdmin);
    }

    @GetMapping("/admins")
    List<Admin> getAllAdmins() {
        return AdminRepository.findAll();
    }

    @GetMapping("/admin/{user_id}")
    Admin getAdminById(@PathVariable Long user_id) {
        return AdminRepository.findById(user_id)
                .orElseThrow(()->new UserNotFoundException(user_id));
    }

    @PutMapping("/admin/{user_id}")
    Admin getUpdatedAdmin(@PathVariable Long user_id, @RequestBody Admin updatedAdmin) {
        return AdminRepository.findById(user_id)
                .map(Admin -> {
                    Admin.setUsername(updatedAdmin.getUsername());
                    Admin.setName(updatedAdmin.getName());
                    Admin.setSurname(updatedAdmin.getSurname());
                    Admin.setEmail(updatedAdmin.getEmail());
                    return AdminRepository.save(Admin);
                }).orElseThrow(()->new UserNotFoundException(user_id));
    }

    @DeleteMapping("/admin/{user_id}/delete")
    String deleteAdmin(@PathVariable Long user_id) {
        if (!AdminRepository.existsById(user_id)) {
            throw new UserNotFoundException(user_id);
        }
        AdminRepository.deleteById(user_id);
        return "Admin with id " + user_id + " deleted.";
    }
}