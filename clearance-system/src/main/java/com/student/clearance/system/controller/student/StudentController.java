package com.student.clearance.system.controller.student;

import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.service.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/students/{studentNumber}")
    public ResponseEntity<Student> getStudentByStudentNumber(@PathVariable String studentNumber) {
        Student student = studentService.getStudentByStudentNumber(studentNumber);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @PostMapping("/student")
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        Student createdStudent = studentService.addStudent(student);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @PutMapping("/student/{studentNumber}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable String studentNumber,
            @RequestParam("contactNumber") String contactNumber,
            @RequestParam("email") String email,
            @RequestParam("address") String address,
            @RequestParam("religion") String religion,
            @RequestParam("birthdate") String birthdate,
            @RequestParam("birthplace") String birthplace,
            @RequestParam("citizenship") String citizenship,
            @RequestParam("civilStatus") String civilStatus,
            @RequestParam("sex") String sex
    ) {
        try {
            Student student = studentService.getStudentByStudentNumber(studentNumber);
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Update other fields (no profile image handling)
            student.setContactNumber(contactNumber);
            student.setEmail(email);
            student.setAddress(address);
            student.setReligion(religion);
            try {
                student.setBirthdate(java.sql.Date.valueOf(birthdate));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            student.setBirthplace(birthplace);
            student.setCitizenship(citizenship);
            student.setCivilStatus(civilStatus);
            student.setSex(sex);

            Student updatedStudent = studentService.updateStudentByStudentNumber(studentNumber, student);
            return ResponseEntity.ok(updatedStudent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/student/{studentNumber}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String studentNumber) {
        try {
            studentService.deleteStudentByStudentNumber(studentNumber);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/students/count")
    public ResponseEntity<Integer> getStudentCount() {
        int count = studentService.getStudentCount();
        return ResponseEntity.ok(count);
    }
}
