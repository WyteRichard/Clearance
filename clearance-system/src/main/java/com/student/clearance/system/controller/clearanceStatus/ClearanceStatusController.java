package com.student.clearance.system.controller.clearanceStatus;

import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus;
import com.student.clearance.system.service.clearanceStatus.ClearanceStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/Status")
public class ClearanceStatusController {

    private final ClearanceStatusService clearanceStatusService;

    @Autowired
    public ClearanceStatusController(ClearanceStatusService clearanceStatusService) {
        this.clearanceStatusService = clearanceStatusService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ClearanceStatus>> getAllClearanceStatuses() {
        List<ClearanceStatus> statuses = clearanceStatusService.getAllClearanceStatuses();
        return new ResponseEntity<>(statuses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClearanceStatus> getClearanceStatusById(@PathVariable Long id) {
        Optional<ClearanceStatus> status = clearanceStatusService.getClearanceStatusById(id);
        return status.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/add")
    public ResponseEntity<String> addClearanceStatus(@RequestBody ClearanceStatus clearanceStatus) {
        try {
            clearanceStatusService.addClearanceStatus(clearanceStatus);
            return new ResponseEntity<>("Clearance status successfully added", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Clearance status cannot be added", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateClearanceStatus(@PathVariable Long id, @RequestBody ClearanceStatus clearanceStatusDetails) {
        try {
            Optional<ClearanceStatus> statusOptional = clearanceStatusService.getClearanceStatusById(id);

            if (statusOptional.isPresent()) {
                ClearanceStatus clearanceStatus = statusOptional.get();
                clearanceStatus.setStatus(clearanceStatusDetails.getStatus());
                clearanceStatus.setRemarks(clearanceStatusDetails.getRemarks());

                clearanceStatusService.updateClearanceStatus(clearanceStatus);
                return new ResponseEntity<>("Clearance status successfully updated", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Clearance status not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Clearance status cannot be updated", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteClearanceStatus(@PathVariable Long id) {
        try {
            Optional<ClearanceStatus> statusOptional = clearanceStatusService.getClearanceStatusById(id);

            if (statusOptional.isPresent()) {
                clearanceStatusService.deleteClearanceStatus(id);
                return new ResponseEntity<>("Clearance status successfully deleted", HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>("Clearance status not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Clearance status cannot be deleted", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Global status counts across all students
    @GetMapping("/status-counts")
    public ResponseEntity<Map<String, Long>> getAllStatusCounts() {
        long clearedCount = clearanceStatusService.countByStatus(ClearanceStatus.Status.CLEARED);
        long pendingCount = clearanceStatusService.countByStatus(ClearanceStatus.Status.PENDING);

        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("cleared", clearedCount);
        statusCounts.put("pending", pendingCount);

        return new ResponseEntity<>(statusCounts, HttpStatus.OK);
    }

    // Status counts for a specific student
    @GetMapping("/student/{studentId}/status-counts")
    public ResponseEntity<Map<String, Integer>> getStatusCountsByStudentId(@PathVariable Long studentId) {
        int clearedCount = clearanceStatusService.countByStudentIdAndStatus(studentId, ClearanceStatus.Status.CLEARED);
        int pendingCount = clearanceStatusService.countByStudentIdAndStatus(studentId, ClearanceStatus.Status.PENDING);
        long remarkCount = clearanceStatusService.countRemarksByStudentId(studentId);

        Map<String, Integer> statusCounts = new HashMap<>();
        statusCounts.put("cleared", clearedCount);
        statusCounts.put("pending", pendingCount);
        statusCounts.put("remarks", (int) remarkCount);

        return new ResponseEntity<>(statusCounts, HttpStatus.OK);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getClearanceStatusByStudentId(@PathVariable Long studentId) {
        List<ClearanceStatus> statuses = clearanceStatusService.getClearanceStatusesByStudentId(studentId);
        Map<String, Object> response = new HashMap<>();

        if (statuses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        for (ClearanceStatus status : statuses) {
            Map<String, Object> details = new HashMap<>();
            details.put("department", status.getClearanceRequest().getDepartment().getName());
            details.put("status", status.getStatus());
            details.put("remarks", status.getRemarks());
            response.put("status_" + status.getClearanceRequest().getDepartment().getId(), details);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<Map<String, Object>> updateClearanceStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        try {
            Optional<ClearanceStatus> statusOptional = clearanceStatusService.getClearanceStatusById(id);
            if (statusOptional.isPresent()) {
                ClearanceStatus clearanceStatus = statusOptional.get();
                String newStatus = statusUpdate.get("status");
                clearanceStatus.setStatus(ClearanceStatus.Status.valueOf(newStatus.toUpperCase()));

                // If remarks are included in the request, update them as well
                if (statusUpdate.containsKey("remarks")) {
                    clearanceStatus.setRemarks(statusUpdate.get("remarks"));
                }

                // Save the updated status
                clearanceStatusService.updateClearanceStatus(clearanceStatus);

                // Prepare response with status and remarks
                Map<String, Object> response = new HashMap<>();
                response.put("status", clearanceStatus.getStatus());
                response.put("remarks", clearanceStatus.getRemarks());

                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(Map.of("error", "Clearance status not found"), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Clearance status cannot be updated"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/department/{departmentId}/status-counts")
    public ResponseEntity<Map<String, Integer>> getStatusCountsByDepartmentId(@PathVariable Long departmentId) {
        int clearedCount = clearanceStatusService.countByDepartmentIdAndStatus(departmentId, ClearanceStatus.Status.CLEARED);
        int pendingCount = clearanceStatusService.countByDepartmentIdAndStatus(departmentId, ClearanceStatus.Status.PENDING);

        Map<String, Integer> statusCounts = new HashMap<>();
        statusCounts.put("cleared", clearedCount);
        statusCounts.put("pending", pendingCount);

        return new ResponseEntity<>(statusCounts, HttpStatus.OK);
    }

}
