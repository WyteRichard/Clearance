package com.student.clearance.system.repository.clearanceRequest;

import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClearanceRequestRepository extends JpaRepository<ClearanceRequest, Long> {

    List<ClearanceRequest> findByStudent_FirstNameContainingIgnoreCaseOrStudent_MiddleNameContainingIgnoreCaseOrStudent_LastNameContainingIgnoreCase(
            String firstName, String middleName, String lastName);

    List<ClearanceRequest> findByDepartment_Id(Long departmentId);

    List<ClearanceRequest> findByStudentIdAndDepartmentId(Long studentId, Long departmentId);

    List<ClearanceRequest> findByStudent_StudentNumber(String studentNumber);

    List<ClearanceRequest> findByDepartment_IdAndStudent_Course_CourseName(Long departmentId, String courseName);

    List<ClearanceRequest> findByDepartment_IdAndStudent_Section_ClusterName(Long departmentId, String clusterName);

    List<ClearanceRequest> findByStudent_Id(Long studentId);


}
