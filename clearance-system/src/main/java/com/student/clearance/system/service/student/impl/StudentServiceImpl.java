package com.student.clearance.system.service.student.impl;

import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.repository.student.StudentRepository;
import com.student.clearance.system.service.student.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    @Override
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    @Override
    public int getStudentCount() {
        return (int) studentRepository.count();
    }

    @Override
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        // Update the fields
        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setMiddleName(updatedStudent.getMiddleName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setBirthdate(updatedStudent.getBirthdate());
        existingStudent.setBirthplace(updatedStudent.getBirthplace());  // New field
        existingStudent.setSex(updatedStudent.getSex());                // New field
        existingStudent.setCivilStatus(updatedStudent.getCivilStatus()); // New field
        existingStudent.setCitizenship(updatedStudent.getCitizenship()); // New field
        existingStudent.setReligion(updatedStudent.getReligion());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setAddress(updatedStudent.getAddress());
        existingStudent.setContactNumber(updatedStudent.getContactNumber());
        existingStudent.setStudentNumber(updatedStudent.getStudentNumber());
        existingStudent.setSection(updatedStudent.getSection());
        existingStudent.setYearLevel(updatedStudent.getYearLevel());
        existingStudent.setCourse(updatedStudent.getCourse());
        existingStudent.setUser(updatedStudent.getUser());

        // Save the updated student back to the database
        return studentRepository.save(existingStudent);
    }

    @Override
    public String saveProfileImage(MultipartFile profileImage) {
        try {
            String uploadDir = "uploads/";  // Define the directory to save the images
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);  // Create directories if they don't exist
            }

            String filename = profileImage.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            // Save the file to the server
            Files.write(filePath, profileImage.getBytes());

            return filePath.toString();  // Return the path where the image is saved
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }
}
