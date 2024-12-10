package com.student.clearance.system.domain.admin;

import com.student.clearance.system.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String adminNumber;

    @Column(length = 32)
    private String email;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
