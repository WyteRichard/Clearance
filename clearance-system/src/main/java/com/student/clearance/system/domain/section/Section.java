package com.student.clearance.system.domain.section;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class Section implements Serializable {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sectionId;

    private String sectionName;

    private String sectionCourse;

    private String clusterName;

    private String clusterHead;
}

