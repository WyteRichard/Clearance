package com.student.clearance.system.controller.yearLevel;

import com.student.clearance.system.domain.yearLevel.YearLevel;
import com.student.clearance.system.service.yearLevel.YearLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Year")
public class YearLevelController {

    private final YearLevelService yearLevelService;

    @Autowired
    public YearLevelController(YearLevelService yearLevelService) {
        this.yearLevelService = yearLevelService;
    }

    @GetMapping("/levels")
    public ResponseEntity<List<YearLevel>> getAllYearLevels() {
        return new ResponseEntity<>(yearLevelService.getAllYearLevels(), HttpStatus.OK);
    }

    @GetMapping("/level/{id}")
    public ResponseEntity<Optional<YearLevel>> getYearLevelById(@PathVariable Long id) {
        return new ResponseEntity<>(yearLevelService.getYearLevelById(id), HttpStatus.OK);
    }

    @PostMapping("/level")
    public ResponseEntity<YearLevel> addYearLevel(@RequestBody YearLevel yearLevel) {
        YearLevel createdYearLevel = yearLevelService.addYearLevel(yearLevel);
        return new ResponseEntity<>(createdYearLevel, HttpStatus.CREATED);
    }

    @PutMapping("/level/{id}")
    public ResponseEntity<YearLevel> updateYearLevel(@PathVariable Long id, @RequestBody YearLevel yearLevelDetails) {
        Optional<YearLevel> yearLevelOptional = yearLevelService.getYearLevelById(id);

        if (yearLevelOptional.isPresent()) {
            YearLevel yearLevel = yearLevelOptional.get();
            yearLevel.setYearLevel(yearLevelDetails.getYearLevel());

            YearLevel updatedYearLevel = yearLevelService.updateYearLevel(yearLevel);
            return new ResponseEntity<>(updatedYearLevel, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/level/{id}")
    public ResponseEntity<Void> deleteYearLevel(@PathVariable Long id) {
        Optional<YearLevel> yearLevelOptional = yearLevelService.getYearLevelById(id);

        if (yearLevelOptional.isPresent()) {
            yearLevelService.deleteYearLevel(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
