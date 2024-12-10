package com.student.clearance.system.domain.department;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Entity
@Data
public class Department implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
}
