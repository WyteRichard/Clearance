package com.student.clearance.system.service.student.impl;

import com.student.clearance.system.domain.student.Student;
import com.student.clearance.system.repository.student.StudentRepository;
import com.student.clearance.system.service.student.StudentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Student getStudentByStudentNumber(String studentNumber) {
        List<Student> students = studentRepository.findAllByStudentNumber(studentNumber);
        if (students.isEmpty()) {
            throw new RuntimeException("No student found with student number: " + studentNumber);
        }
        // Return the first result found; update logic here if a specific entry is needed
        return students.get(0);
    }

    @Override
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    @Transactional
    public void deleteStudentByStudentNumber(String studentNumber) {
        Student student = studentRepository.findByStudentNumber(studentNumber);
        if (student == null) {
            throw new RuntimeException("Student not found with student number: " + studentNumber);
        }

        // Add deletion logic for related entities based on foreign key dependencies if necessary

        studentRepository.delete(student);
    }

    @Override
    public int getStudentCount() {
        return (int) studentRepository.count();
    }

    @Override
    public Student updateStudentByStudentNumber(String studentNumber, Student updatedStudent) {
        Student existingStudent = studentRepository.findByStudentNumber(studentNumber);

        if (existingStudent == null) {
            throw new RuntimeException("Student not found with student number: " + studentNumber);
        }

        // Update the fields
        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setMiddleName(updatedStudent.getMiddleName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setBirthdate(updatedStudent.getBirthdate());
        existingStudent.setBirthplace(updatedStudent.getBirthplace());
        existingStudent.setSex(updatedStudent.getSex());
        existingStudent.setCivilStatus(updatedStudent.getCivilStatus());
        existingStudent.setCitizenship(updatedStudent.getCitizenship());
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
    @Transactional
    public Student updateStudentSummerStatus(String studentNumber, boolean summer) {
        Student student = studentRepository.findByStudentNumber(studentNumber);
        if (student == null) {
            throw new RuntimeException("Student not found with student number: " + studentNumber);
        }

        student.setSummer(summer);
        return studentRepository.save(student);
    }

}
