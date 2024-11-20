package com.likeat.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
//@Table(name = "user")
public class Customer extends User {

    private String location;

    public Customer(Long user_id, String username, String name, String surname, String password, String email, String role, String location) {
        super(user_id, username, name, surname, password, email, role);
        this.location = location;
    }

    public Customer(String location, int reviews) {
        this.location = location;
    }

    public Customer() {
        super();
    }

}
