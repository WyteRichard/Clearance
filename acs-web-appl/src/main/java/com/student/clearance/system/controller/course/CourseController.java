package com.student.clearance.system.controller.course;

import com.student.clearance.system.domain.course.Course;
import com.student.clearance.system.service.course.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Course")
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return new ResponseEntity<>(courseService.getAllCourses(), HttpStatus.OK);
    }

    @GetMapping("/course/{id}")
    public ResponseEntity<Optional<Course>> getCourseById(@PathVariable Long id) {
        return new ResponseEntity<>(courseService.getCourseById(id), HttpStatus.OK);
    }

    @PostMapping("/course")
    public ResponseEntity<String> addCourse(@RequestBody Course course) {
        try {
            courseService.addCourse(course);
            return new ResponseEntity<>("Course successfully added", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Course cannot be added", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/course/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        try {
            Optional<Course> courseOptional = courseService.getCourseById(id);

            if (courseOptional.isPresent()) {
                Course course = courseOptional.get();
                course.setCourseName(courseDetails.getCourseName());

                Course updatedCourse = courseService.updateCourse(course);
                return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
