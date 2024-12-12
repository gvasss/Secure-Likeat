package com.likeat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class UserDTO {

    private Long id;
    private String role;
    private String username;
    private String name;
    private String surname;
    private String email;
    private String location;
    private int totalReviews;
}