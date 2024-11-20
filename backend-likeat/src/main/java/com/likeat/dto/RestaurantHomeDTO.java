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
    private int cost;
    private double overallRating;
    private int totalReviews;
}