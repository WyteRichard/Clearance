package com.student.clearance.system.domain.student;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.student.clearance.system.domain.person.Person;
import com.student.clearance.system.domain.course.Course;
import com.student.clearance.system.domain.section.Section;
import com.student.clearance.system.domain.semesterControl.SemesterControl;
import com.student.clearance.system.domain.yearLevel.YearLevel;
import com.student.clearance.system.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Student extends Person implements Serializable {

    @Column(length = 10, unique = true, nullable = false)
    private String studentNumber;

    @ManyToOne
    private Section section;

    @ManyToOne
    @JoinColumn(name = "year_level_id")
    private YearLevel yearLevel;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    private SemesterControl currentSemester;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // New column for the profile image
    @Column(length = 255)  // This will store the file path or URL
    private String profileImage;
}
