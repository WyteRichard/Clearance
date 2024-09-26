package com.student.clearance.system.controller.student;

import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.service.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Student")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return new ResponseEntity<>(studentService.getAllStudents(), HttpStatus.OK);
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<Optional<Student>> getStudentById(@PathVariable Long id) {
        return new ResponseEntity<>(studentService.getStudentById(id), HttpStatus.OK);
    }

    @GetMapping("/studentNumber/{studentNumber}")
    public ResponseEntity<Student> getStudentByNumber(@PathVariable String studentNumber) {
        return new ResponseEntity<>(this.studentService.getStudentByStudentNumber(studentNumber), HttpStatus.OK);
    }

    @PostMapping("/student")
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        Student createdStudent = studentService.addStudent(student);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @PutMapping("/student/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Optional<Student> studentOptional = studentService.getStudentById(id);

        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();

            // Log existing student details
            System.out.println("Existing Student: " + student);

            // Update fields only if they are present in the request
            if (studentDetails.getFirstName() != null) {
                student.setFirstName(studentDetails.getFirstName());
            }
            if (studentDetails.getLastName() != null) {
                student.setLastName(studentDetails.getLastName());
            }
            if (studentDetails.getMiddleName() != null) {
                student.setMiddleName(studentDetails.getMiddleName());
            }
            if (studentDetails.getEmail() != null) {
                student.setEmail(studentDetails.getEmail());
            }
            if (studentDetails.getContactNumber() != null) {
                student.setContactNumber(studentDetails.getContactNumber());
            }

            // Log updated student details
            System.out.println("Updated Student: " + student);

            Student updatedStudent = studentService.updateStudent(student);
            return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/student/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        Optional<Student> studentOptional = studentService.getStudentById(id);

        if (studentOptional.isPresent()) {
            studentService.deleteStudent(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/students/count")
    public ResponseEntity<Integer> getStudentCount() {
        int count = studentService.getStudentCount();
        return ResponseEntity.ok(count);
    }
}
