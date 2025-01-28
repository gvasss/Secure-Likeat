package com.likeat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserInfoDTO {
    private String type;
    private LocalDateTime date;
    private String username;
    private String role;
}