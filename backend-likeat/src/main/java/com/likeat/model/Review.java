package com.likeat.model;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Review {

    @Id
    @GeneratedValue
    private Long id;

    private int rating;
    private String description;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "customer_user_id", referencedColumnName = "id")
    @JsonTypeInfo(use = JsonTypeInfo.Id.NONE)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", referencedColumnName = "id")
    @JsonTypeInfo(use = JsonTypeInfo.Id.NONE)
    private Restaurant restaurant;
}