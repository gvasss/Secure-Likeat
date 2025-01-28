package com.likeat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewInfoDTO {
    private String type;
    private LocalDateTime date;
    private Long reviewId;
    private String username;
    private String restaurant;
}