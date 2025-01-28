package com.likeat.controller;

import com.likeat.dto.UserDTO;
import com.likeat.request.ChangePasswordRequest;
import com.likeat.request.UpdateUserRequest;
import com.likeat.service.UserService;
import jakarta.validation.Valid;
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
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CLIENT', 'ADMIN')")
    public UserDTO getProfile(Principal connectedUser) {
        return service.getProfile(connectedUser);
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CLIENT', 'ADMIN')")
    public ResponseEntity<?> updateUser(@Valid @RequestBody UpdateUserRequest request, Principal connectedUser) {
        service.updateUser(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/change-password")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'CLIENT', 'ADMIN')")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request, Principal connectedUser) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    // CLIENT delete
    @DeleteMapping("/client")
    @PreAuthorize("hasAnyAuthority('client:delete') or hasAnyRole('CLIENT')")
    String deleteClient(Principal connectedUser) {
        return service.deleteClient(connectedUser);
    }

    // CUSTOMER delete
    @DeleteMapping("/customer")
    @PreAuthorize("hasAnyAuthority('customer:delete') or hasAnyRole('CUSTOMER')")
    String deleteCustomer(Principal connectedUser) {
        return service.deleteCustomer(connectedUser);
    }

    // ADMIN delete
    @DeleteMapping("/admin")
    @PreAuthorize("hasAnyAuthority('admin:delete') or hasAnyRole('ADMIN')")
    String deleteAdmin(Principal connectedUser) {
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
    public String deleteAdmin(@Valid @PathVariable Long id) {
        return service.deleteAdmin(id);
    }

    @DeleteMapping("/client/{id}")
    @PreAuthorize("hasAuthority('client:delete')")
    public String deleteClient(@Valid @PathVariable Long id) {
        return service.deleteClient(id);
    }

    @DeleteMapping("/customer/{id}")
    @PreAuthorize("hasAuthority('customer:delete')")
    public String deleteCustomer(@Valid @PathVariable Long id) {
        return service.deleteCustomer(id);
    }

        // dashboard details
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public UserDTO getUserById(@Valid @PathVariable Long id) {
        return service.getUserById(id);
    }
}