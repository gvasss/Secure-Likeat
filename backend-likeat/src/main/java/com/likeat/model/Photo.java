package com.likeat.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.likeat.service.BlobDeserializer;
import com.likeat.service.BlobSerializer;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.sql.Blob;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EntityListeners(AuditingEntityListener.class)
public class Photo {

    @Id
    @GeneratedValue
    private Long id;

    @CreatedDate
    @Column(
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @CreatedBy
    @Column(
            nullable = false,
            updatable = false
    )
    private Long createdBy;

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