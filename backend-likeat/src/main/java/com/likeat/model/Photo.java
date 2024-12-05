package com.likeat.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.likeat.service.BlobDeserializer;
import com.likeat.service.BlobSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Blob;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Photo {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", referencedColumnName = "id")
    @JsonBackReference
    private Restaurant restaurant;

    @Lob
    @JsonSerialize(using = BlobSerializer.class)
    @JsonDeserialize(using = BlobDeserializer.class)
    private Blob image;

    private boolean isMain;

    public boolean getIsMain() {
        return isMain;
    }

    public void setMain(boolean isMain) {
        this.isMain = isMain;
    }
}