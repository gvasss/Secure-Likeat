package com.likeat.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.stream.DoubleStream;

@Data
@Builder
@AllArgsConstructor
@Entity
public class Restaurant {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "id")
    @JsonTypeInfo(use = JsonTypeInfo.Id.NONE)
    private User client;

    private String name;
    private String address;
    private String style;
    private String cuisine;
    private int cost;

    @Column(length = 1500)
    private String information;
    private String phone;
    private String openingHours;
    private String location;

    @Enumerated(EnumType.STRING)
    private RestaurantStatus status;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Photo> photos;

    public Restaurant() {
        this.status = RestaurantStatus.PENDING;
    }
}