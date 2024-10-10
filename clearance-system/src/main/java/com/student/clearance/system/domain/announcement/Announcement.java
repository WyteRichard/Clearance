package com.student.clearance.system.domain.announcement;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "announcement_seq")
    @SequenceGenerator(name = "announcement_seq", sequenceName = "announcement_seq", allocationSize = 1)
    private Long id;

    private String title;

    // Renamed 'date' to 'announcementDate' to avoid conflicts
    private LocalDate announcementDate;

    @Column(length = 1000)
    private String details;
}
