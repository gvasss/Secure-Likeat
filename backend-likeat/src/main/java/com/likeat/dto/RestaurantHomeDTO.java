package com.likeat.dto;

import com.likeat.model.Photo;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RestaurantHomeDTO {
    private Long id;
    private List<Photo> photo;
    private String name;
    private String location;
    private String style;
    private String cuisine;
    private String address;
    private int cost;
    private double overallRating;
    private int totalReviews;
    private String information;
    private String phone;
    private String openingHours;
    private List<ReviewDTO> reviews;
}