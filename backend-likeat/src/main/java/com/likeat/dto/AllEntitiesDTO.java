package com.likeat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AllEntitiesDTO {
    private List<UserInfoDTO> users;
    private List<ReviewInfoDTO> reviews;
    private List<RestaurantInfoDTO> restaurants;
}