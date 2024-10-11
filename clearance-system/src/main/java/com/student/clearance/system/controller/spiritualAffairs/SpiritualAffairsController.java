package com.student.clearance.system.controller.spiritualAffairs;

import com.student.clearance.system.domain.spiritualAffairs.SpiritualAffairs;
import com.student.clearance.system.service.spiritualAffairs.SpiritualAffairsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Spiritual")
public class SpiritualAffairsController {

    private final SpiritualAffairsService spiritualAffairsService;

    @Autowired
    public SpiritualAffairsController(SpiritualAffairsService spiritualAffairsService) {
        this.spiritualAffairsService = spiritualAffairsService;
    }

    @GetMapping("/affairs")
    public ResponseEntity<List<SpiritualAffairs>> getAllSpiritualAffairs() {
        return new ResponseEntity<>(spiritualAffairsService.getAllSpiritualAffairs(), HttpStatus.OK);
    }

    @GetMapping("/affairs/count")
    public ResponseEntity<Integer> getSpiritualAffairsCount() {
        int count = spiritualAffairsService.getSpiritualAffairsCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/affairs/{id}")
    public ResponseEntity<Void> deleteSpiritualAffairs(@PathVariable Long id) {
        spiritualAffairsService.deleteSpiritualAffairs(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/affairs/{spiritualAffairsNumber}")
    public ResponseEntity<SpiritualAffairs> getAffairsBySpiritualAffairsNumber(@PathVariable String spiritualAffairsNumber) {
        SpiritualAffairs affairs = spiritualAffairsService.getAffairsBySpiritualAffairsNumber(spiritualAffairsNumber);
        return new ResponseEntity<>(affairs, HttpStatus.OK);
    }
}