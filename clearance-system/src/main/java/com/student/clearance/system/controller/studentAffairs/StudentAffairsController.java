package com.student.clearance.system.controller.studentAffairs;

import com.student.clearance.system.domain.studentAffairs.StudentAffairs;
import com.student.clearance.system.service.studentAffairs.StudentAffairsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Student")
public class StudentAffairsController {

    private final StudentAffairsService studentAffairsService;

    @Autowired
    public StudentAffairsController(StudentAffairsService studentAffairsService) {
        this.studentAffairsService = studentAffairsService;
    }

    @GetMapping("/affairs")
    public ResponseEntity<List<StudentAffairs>> getAllStudentAffairs() {
        return new ResponseEntity<>(studentAffairsService.getAllStudentAffairs(), HttpStatus.OK);
    }

    @GetMapping("/affairs/count")
    public ResponseEntity<Integer> getStudentAffairsCount() {
        int count = studentAffairsService.getStudentAffairsCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/affairs/{id}")
    public ResponseEntity<Void> deleteStudentAffairs(@PathVariable Long id) {
        studentAffairsService.deleteStudentAffairs(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}