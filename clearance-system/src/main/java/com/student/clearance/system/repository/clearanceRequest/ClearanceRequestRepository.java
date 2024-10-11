package com.student.clearance.system.repository.clearanceRequest;

import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClearanceRequestRepository extends JpaRepository<ClearanceRequest, Long> {

    List<ClearanceRequest> findByStudent_FirstNameContainingIgnoreCaseOrStudent_MiddleNameContainingIgnoreCaseOrStudent_LastNameContainingIgnoreCase(
            String firstName, String middleName, String lastName);

    List<ClearanceRequest> findByStudent_Id(Long studentId);

    List<ClearanceRequest> findByDepartment_Id(Long departmentId);

    List<ClearanceRequest> findByStudentIdAndDepartmentId(Long studentId, Long departmentId);
}
