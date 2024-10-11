package com.student.clearance.system.controller.supremeStudentCouncil;

import com.student.clearance.system.domain.supremeStudentCouncil.SupremeStudentCouncil;
import com.student.clearance.system.service.supremeStudentCouncil.SupremeStudentCouncilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Council")
public class SupremeStudentCouncilController {

    private final SupremeStudentCouncilService supremeStudentCouncilService;

    @Autowired
    public SupremeStudentCouncilController(SupremeStudentCouncilService supremeStudentCouncilService) {
        this.supremeStudentCouncilService = supremeStudentCouncilService;
    }

    @GetMapping("/councils")
    public ResponseEntity<List<SupremeStudentCouncil>> getAllSupremeStudentCouncils() {
        return new ResponseEntity<>(supremeStudentCouncilService.getAllSupremeStudentCouncils(), HttpStatus.OK);
    }

    @GetMapping("/councils/{supremeStudentCouncilNumber}")
    public ResponseEntity<SupremeStudentCouncil> getCouncilByNumber(@PathVariable String supremeStudentCouncilNumber) {
        SupremeStudentCouncil council = supremeStudentCouncilService.getCouncilByNumber(supremeStudentCouncilNumber);
        if (council != null) {
            return ResponseEntity.ok(council);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/councils/count")
    public ResponseEntity<Integer> getSupremeStudentCouncilCount() {
        int count = supremeStudentCouncilService.getSupremeStudentCouncilCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/councils/{id}")
    public ResponseEntity<Void> deleteSupremeStudentCouncil(@PathVariable Long id) {
        supremeStudentCouncilService.deleteSupremeStudentCouncil(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
