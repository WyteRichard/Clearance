package com.student.clearance.system.controller.transactionLog;

import com.student.clearance.system.domain.transactionLog.TransactionLog;
import com.student.clearance.system.service.transactionLog.TransactionLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Status")
public class TransactionLogController {

    @Autowired
    private TransactionLogService transactionLogService;

    @PostMapping("/log-transaction")
    public ResponseEntity<String> logTransaction(@RequestBody TransactionLog log) {
        System.out.println("Received Log Data: " + log); // Log incoming data
        transactionLogService.saveLog(log);
        return new ResponseEntity<>("Transaction logged successfully", HttpStatus.CREATED);
    }

    @PostMapping("/log-transactions-batch")
    public ResponseEntity<String> logTransactionsBatch(@RequestBody List<TransactionLog> logs) {
        try {
            System.out.println("Received batch log data: " + logs); // Log incoming batch data for debugging
            transactionLogService.saveLogsBatch(logs);
            return new ResponseEntity<>("Batch transaction logs saved successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error saving batch logs: " + e.getMessage());
            return new ResponseEntity<>("An error occurred while processing the batch request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/logs/{studentId}/department/{departmentId}")
    public ResponseEntity<List<TransactionLog>> getLogsByStudentIdAndDepartmentId(
            @PathVariable String studentId, @PathVariable Long departmentId) {
        List<TransactionLog> logs = transactionLogService.getLogsByStudentIdAndDepartmentId(studentId, departmentId);
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }

    @GetMapping("/logs/{studentId}/departmentName/{departmentName}")
    public ResponseEntity<List<TransactionLog>> getLogsByStudentIdAndDepartmentName(
            @PathVariable String studentId, @PathVariable String departmentName) {
        List<TransactionLog> logs = transactionLogService.getLogsByStudentIdAndDepartmentName(studentId, departmentName);
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }
}