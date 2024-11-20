package com.likeat.model;

import jakarta.persistence.*;

@Entity
//@Table(name = "admin")
public class Admin extends User {
    public Admin(Long user_id, String username, String name, String surname, String password, String email, String role) {
        super(user_id, username, name, surname, password, email, role);
    }

    public Admin() {
        super();
    }
}
