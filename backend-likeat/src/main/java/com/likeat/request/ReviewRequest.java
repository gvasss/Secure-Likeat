package com.likeat.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReviewRequest {
    private Long restaurantId;
    private int rating;
    private String description;
}