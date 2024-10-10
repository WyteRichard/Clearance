package com.student.clearance.system.controller.laboratory;

import com.student.clearance.system.domain.laboratory.Laboratory;
import com.student.clearance.system.service.laboratory.LaboratoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Laboratory")
public class LaboratoryController {

    private final LaboratoryService laboratoryService;

    @Autowired
    public LaboratoryController(LaboratoryService laboratoryService) {
        this.laboratoryService = laboratoryService;
    }

    @GetMapping("/laboratories")
    public ResponseEntity<List<Laboratory>> getAllLaboratories() {
        return new ResponseEntity<>(laboratoryService.getAllLaboratories(), HttpStatus.OK);
    }

    @GetMapping("/laboratories/count")
    public ResponseEntity<Integer> getLaboratoryCount() {
        int count = laboratoryService.getLaboratoryCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/laboratories/{id}")
    public ResponseEntity<Void> deleteLaboratory(@PathVariable Long id) {
        laboratoryService.deleteLaboratory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
