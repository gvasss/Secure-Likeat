package com.likeat.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
public class ReviewDTO {
    private Long id;
    private int rating;
    private String description;
    private Date date;
    private String customerName;
    private String restaurantName;
}