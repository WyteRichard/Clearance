package com.student.clearance.system.controller.guidance;

import com.student.clearance.system.domain.guidance.Guidance;
import com.student.clearance.system.service.guidance.GuidanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Guidance")
public class GuidanceController {

    private final GuidanceService guidanceService;

    @Autowired
    public GuidanceController(GuidanceService guidanceService) {
        this.guidanceService = guidanceService;
    }

    @GetMapping("/guidances")
    public ResponseEntity<List<Guidance>> getAllGuidances() {
        return new ResponseEntity<>(guidanceService.getAllGuidances(), HttpStatus.OK);
    }

    @GetMapping("/guidances/count")
    public ResponseEntity<Integer> getGuidanceCount() {
        int count = guidanceService.getGuidanceCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/guidances/{id}")
    public ResponseEntity<Void> deleteGuidance(@PathVariable Long id) {
        guidanceService.deleteGuidance(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
