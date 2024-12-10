package com.student.clearance.system.service.course.impl;

import com.student.clearance.system.domain.course.Course;
import com.student.clearance.system.repository.course.CourseRepository;
import com.student.clearance.system.service.course.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    @Override
    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public Course updateCourse(Course course) {
        Optional<Course> existingCourse = courseRepository.findById(course.getCourseId());
        if (existingCourse.isPresent()) {
            Course updatedCourse = existingCourse.get();
            updatedCourse.setCourseName(course.getCourseName());
            return courseRepository.save(updatedCourse);
        } else {
            return null;
        }
    }
}
