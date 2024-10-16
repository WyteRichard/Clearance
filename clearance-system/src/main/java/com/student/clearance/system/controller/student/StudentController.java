package com.student.clearance.system.controller.student;

import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.service.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
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
        try {
            Student student = studentService.getStudentByStudentNumber(studentNumber);
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null); // or alternatively, return ResponseEntity.badRequest().body(null);
            }

            // Handle profile image upload
            if (profileImage != null && !profileImage.isEmpty()) {
                try {
                    String profileImagePath = studentService.saveProfileImage(profileImage);
                    student.setProfileImage(profileImagePath);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(null); // Or use a more informative error message
                }
            }

            // Update other fields
            student.setContactNumber(contactNumber);
            student.setEmail(email);
            student.setAddress(address);
            student.setReligion(religion);
            try {
                student.setBirthdate(java.sql.Date.valueOf(birthdate));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null); // Provide specific feedback for invalid date format
            }
            student.setBirthplace(birthplace);
            student.setCitizenship(citizenship);
            student.setCivilStatus(civilStatus);
            student.setSex(sex);

            Student updatedStudent = studentService.updateStudentByStudentNumber(studentNumber, student);
            return ResponseEntity.ok(updatedStudent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
    @GetMapping("/uploads/{fileName:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("src/main/resources/static/uploads").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // Adjust to determine file type dynamically if needed
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/student/{studentNumber}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String studentNumber) {
        System.out.println("Delete request received for student number: " + studentNumber);
        try {
            studentService.deleteStudentByStudentNumber(studentNumber);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            System.out.println("Student not found: " + studentNumber);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/students/count")
    public ResponseEntity<Integer> getStudentCount() {
        int count = studentService.getStudentCount();
        return ResponseEntity.ok(count);
    }
}
