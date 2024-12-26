package com.likeat.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RestaurantRequest {
    private String name;
    private String address;
    private String style;
    private String cuisine;
    private int cost;
    private String information;
    private String phone;
    private String openingHours;
    private String location;
}