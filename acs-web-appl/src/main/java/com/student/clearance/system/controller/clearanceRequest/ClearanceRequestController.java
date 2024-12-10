package com.student.clearance.system.controller.clearanceRequest;

import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;
import com.student.clearance.system.service.clearanceRequest.ClearanceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Requests")
public class ClearanceRequestController {

    @Autowired
    private ClearanceRequestService clearanceRequestService;

    @GetMapping("/all")
    public List<ClearanceRequest> getAllClearanceRequests() {
        return clearanceRequestService.getAllClearanceRequests();
    }

    @GetMapping("/department/{departmentId}/course")
    public List<ClearanceRequest> getClearanceRequestsByDepartmentAndCourse(
            @PathVariable Long departmentId,
            @RequestParam String courseName) {
        return clearanceRequestService.getClearanceRequestsByDepartmentAndCourse(departmentId, courseName);
    }

    @GetMapping("/department/{departmentId}/cluster")
    public List<ClearanceRequest> getClearanceRequestsByDepartmentAndCluster(
            @PathVariable Long departmentId,
            @RequestParam String clusterName) {
        return clearanceRequestService.getClearanceRequestsByDepartmentAndCluster(departmentId, clusterName);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClearanceRequest> getClearanceRequestById(@PathVariable Long id) {
        ClearanceRequest clearanceRequest = clearanceRequestService.getClearanceRequestById(id);
        return ResponseEntity.ok(clearanceRequest);
    }

    @GetMapping("/student/name/{name}")
    public List<ClearanceRequest> getClearanceRequestsByStudentName(@PathVariable String name) {
        return clearanceRequestService.getClearanceRequestsByStudentName(name);
    }

    @GetMapping("/student/{studentId}")
    public List<ClearanceRequest> getClearanceRequestsByStudentId(@PathVariable Long studentId) {
        return clearanceRequestService.getClearanceRequestsByStudentId(studentId);
    }

    @GetMapping("/department/{departmentId}")
    public List<ClearanceRequest> getClearanceRequestsByDepartmentId(@PathVariable Long departmentId) {
        return clearanceRequestService.getClearanceRequestsByDepartmentId(departmentId);
    }

    @GetMapping("/count")
    public long getClearanceRequestCountByDepartment(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) {
            return clearanceRequestService.getClearanceRequestsByDepartmentId(departmentId).size();
        } else {
            return clearanceRequestService.getClearanceRequestCount();
        }
    }

    @PostMapping("/addRequests")
    public ResponseEntity<Void> createClearanceRequestForAllDepartments(@RequestBody ClearanceRequest clearanceRequest) {
        clearanceRequestService.createClearanceRequestForAllDepartments(clearanceRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/addSelectedRequests")
    public ResponseEntity<Void> createClearanceRequestForSelectedDepartments(@RequestBody ClearanceRequest clearanceRequest) {
        clearanceRequestService.createClearanceRequestForSelectedDepartments(clearanceRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClearanceRequest> updateClearanceRequest(@PathVariable Long id, @RequestBody ClearanceRequest clearanceRequest) {
        ClearanceRequest updatedClearanceRequest = clearanceRequestService.updateClearanceRequest(id, clearanceRequest);
        return ResponseEntity.ok(updatedClearanceRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClearanceRequest(@PathVariable Long id) {
        clearanceRequestService.deleteClearanceRequest(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/student/{studentNumber}/all")
    public ResponseEntity<Void> deleteAllClearanceRequestsAndStatusesByStudentNumber(@PathVariable String studentNumber) {
        clearanceRequestService.deleteAllClearanceRequestsAndStatusesByStudentNumber(studentNumber);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}/department/{departmentId}")
    public List<ClearanceRequest> getClearanceRequestByStudentAndDepartment(
            @PathVariable Long studentId,
            @PathVariable Long departmentId) {
        return clearanceRequestService.getClearanceRequestsByStudentIdAndDepartmentId(studentId, departmentId);
    }

    @GetMapping("/student/{studentId}/exists")
    public ResponseEntity<Boolean> clearanceRequestExists(@PathVariable Long studentId) {
        try {
            boolean exists = clearanceRequestService.clearanceRequestExistsByStudentId(studentId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @GetMapping("/student/number/{studentNumber}")
    public ResponseEntity<List<ClearanceRequest>> getClearanceRequestsByStudentNumber(@PathVariable String studentNumber) {
        List<ClearanceRequest> clearanceRequests = clearanceRequestService.getClearanceRequestsByStudentNumber(studentNumber);
        return ResponseEntity.ok(clearanceRequests);
    }

}
