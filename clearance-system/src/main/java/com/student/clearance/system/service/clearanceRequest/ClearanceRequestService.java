package com.student.clearance.system.service.clearanceRequest;

import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;
import com.student.clearance.system.domain.department.Department;

import java.util.List;
import java.util.Optional;

public interface ClearanceRequestService {
    List<ClearanceRequest> getAllClearanceRequests();
    Optional<ClearanceRequest> getClearanceRequestById(Long id);
    ClearanceRequest addClearanceRequest(ClearanceRequest clearanceRequest);
    ClearanceRequest updateClearanceRequest(ClearanceRequest clearanceRequest);
    void deleteClearanceRequest(Long id);
    List<ClearanceRequest> getClearanceRequestsByStudentName(String name);
    List<ClearanceRequest> getRequestsByStudentId(Long studentId);
    List<ClearanceRequest> getRequestsByDepartmentId(Long departmentId);
    List<ClearanceRequest> getRequestsByStudentAndDepartment(Long studentId, Long departmentId);
    long getClearanceRequestCount();
    void addClearanceRequestForAllDepartments(ClearanceRequest clearanceRequest);
    List<Department> getAllDepartments();

    void addClearanceRequestAndStatus(ClearanceRequest clearanceRequest);

}
