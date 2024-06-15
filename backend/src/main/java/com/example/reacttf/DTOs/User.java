package com.example.reacttf.DTOs;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

@Data
@Entity
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long uid;

    @Column(length = 20)
    private String username;

    @Column(length = 74)
    private String hashed_pwd;

    @Column(length = 254)
    private String email;

    @Column(length = 13)
    private String phone;

    @ColumnDefault("0")
    private int cnt;
}