package com.student.clearance.system.controller.clearanceHistory;

import com.student.clearance.system.domain.clearanceHistory.ClearanceHistory;
import com.student.clearance.system.service.clearanceHistory.ClearanceHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Clearance-history")
public class ClearanceHistoryController {

    private final ClearanceHistoryService clearanceHistoryService;

    @Autowired
    public ClearanceHistoryController(ClearanceHistoryService clearanceHistoryService) {
        this.clearanceHistoryService = clearanceHistoryService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ClearanceHistory>> getAllClearanceHistories() {
        return new ResponseEntity<>(clearanceHistoryService.getAllClearanceHistories(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<ClearanceHistory>> getClearanceHistoryById(@PathVariable Long id) {
        return new ResponseEntity<>(clearanceHistoryService.getClearanceHistoryById(id), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addClearanceHistory(@RequestBody ClearanceHistory clearanceHistory) {
        try {
            clearanceHistoryService.addClearanceHistory(clearanceHistory);
            return new ResponseEntity<>("Clearance history successfully added", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Clearance history cannot be added", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateClearanceHistory(@PathVariable Long id, @RequestBody ClearanceHistory clearanceHistoryDetails) {
        try {
            Optional<ClearanceHistory> historyOptional = clearanceHistoryService.getClearanceHistoryById(id);

            if (historyOptional.isPresent()) {
                ClearanceHistory clearanceHistory = historyOptional.get();
                clearanceHistory.setStatus(clearanceHistoryDetails.getStatus());
                clearanceHistory.setTimestamp(clearanceHistoryDetails.getTimestamp());
                clearanceHistory.setRemarks(clearanceHistoryDetails.getRemarks());

                clearanceHistoryService.updateClearanceHistory(clearanceHistory);
                return new ResponseEntity<>("Clearance history successfully updated", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Clearance history not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Clearance history cannot be updated", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteClearanceHistory(@PathVariable Long id) {
        try {
            Optional<ClearanceHistory> historyOptional = clearanceHistoryService.getClearanceHistoryById(id);

            if (historyOptional.isPresent()) {
                clearanceHistoryService.deleteClearanceHistory(id);
                return new ResponseEntity<>("Clearance history successfully deleted", HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>("Clearance history not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Clearance history cannot be deleted", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
