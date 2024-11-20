package com.likeat.model;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.*;

@Entity
//@Table(name = "review")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Review {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "review_sequence"
    )
    @SequenceGenerator(
            name = "review_sequence",
            sequenceName = "review_sequence",
            allocationSize = 1
    )
    private Long id;

    private int rating;
    private String description;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "customer_user_id", referencedColumnName = "id")
    @JsonTypeInfo(use = JsonTypeInfo.Id.NONE)
    private Customer customerUserId;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", referencedColumnName = "id")
    @JsonTypeInfo(use = JsonTypeInfo.Id.NONE)
    private Restaurant restaurantId;

}
