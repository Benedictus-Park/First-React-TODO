package com.example.reacttf.DTOs;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    private int uid;
    private String title;
    private boolean checked;
    private String date;
}