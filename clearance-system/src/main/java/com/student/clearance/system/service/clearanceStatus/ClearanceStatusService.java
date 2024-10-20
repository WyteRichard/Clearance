package com.student.clearance.system.service.clearanceStatus;

import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus;

import java.util.List;
import java.util.Optional;

public interface ClearanceStatusService {
    List<ClearanceStatus> getAllClearanceStatuses();
    Optional<ClearanceStatus> getClearanceStatusById(Long id);
    ClearanceStatus addClearanceStatus(ClearanceStatus clearanceStatus);
    ClearanceStatus updateClearanceStatus(ClearanceStatus clearanceStatus);
    void deleteClearanceStatus(Long id);

    int countByStudentNumberAndStatus(String studentNumber, ClearanceStatus.Status status);
    long countRemarksByStudentNumber(String studentNumber);
    long countByStatus(ClearanceStatus.Status status);

    List<ClearanceStatus> getClearanceStatusesByStudentNumber(String studentNumber);

    int countByDepartmentIdAndStatus(Long departmentId, ClearanceStatus.Status status);

    int countByDepartmentIdAndCourseAndStatus(Long departmentId, String courseName, ClearanceStatus.Status status);

    int countByDepartmentIdAndClusterAndStatus(Long departmentId, String clusterName, ClearanceStatus.Status status);


}
