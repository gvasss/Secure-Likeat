package com.likeat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RestaurantInfoDTO {
    private String type;
    private LocalDateTime date;
    private Long userId;
    private String username;
    private String restaurant;
}