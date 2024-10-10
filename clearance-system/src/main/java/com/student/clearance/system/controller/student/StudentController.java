package com.student.clearance.system.controller.student;

import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.service.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
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

    @PostMapping("/student")
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        Student createdStudent = studentService.addStudent(student);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @PutMapping("/student/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
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
        Optional<Student> studentOptional = studentService.getStudentById(id);

        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();

            // Handle file upload
            if (profileImage != null && !profileImage.isEmpty()) {
                String profileImagePath = studentService.saveProfileImage(profileImage);
                student.setProfileImage(profileImagePath);
            }

            // Update other fields
            student.setContactNumber(contactNumber);
            student.setEmail(email);
            student.setAddress(address);
            student.setReligion(religion);
            student.setBirthdate(java.sql.Date.valueOf(birthdate)); // Convert birthdate from String to Date
            student.setBirthplace(birthplace);
            student.setCitizenship(citizenship);
            student.setCivilStatus(civilStatus);
            student.setSex(sex);

            Student updatedStudent = studentService.updateStudent(id, student);
            return ResponseEntity.ok(updatedStudent);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
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
