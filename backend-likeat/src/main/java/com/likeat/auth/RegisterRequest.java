package com.likeat.auth;

import com.likeat.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String name;
    private String surname;
    private String email;
    private String password;
    private Role role;
}