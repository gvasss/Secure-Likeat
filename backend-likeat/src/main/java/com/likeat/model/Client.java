package com.likeat.model;

import jakarta.persistence.*;

@Entity
//@Table(name = "client")
public class Client extends User{
    public Client(Long user_id, String username, String name, String surname, String password, String email, String role) {
        super(user_id, username, name, surname, password, email, role);
    }

    public Client() {
        super();
    }
}
