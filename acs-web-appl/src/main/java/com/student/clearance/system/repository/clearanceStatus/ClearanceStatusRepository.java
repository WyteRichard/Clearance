package com.student.clearance.system.repository.clearanceStatus;

import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;
import com.student.clearance.system.domain.clearanceStatus.ClearanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClearanceStatusRepository extends JpaRepository<ClearanceStatus, Long> {

    int countByStudent_StudentNumberAndStatus(String studentNumber, ClearanceStatus.Status status);
    long countByStudent_StudentNumberAndRemarksIsNotNull(String studentNumber);
    long countByStatus(ClearanceStatus.Status status);

    @Query("SELECT cs FROM ClearanceStatus cs WHERE cs.student.studentNumber = :studentNumber")
    List<ClearanceStatus> findByStudentNumber(String studentNumber);

    @Query("SELECT COUNT(cs) FROM ClearanceStatus cs WHERE cs.clearanceRequest.department.id = :departmentId AND cs.student.course.courseName = :courseName AND cs.status = :status")
    int countByDepartmentIdAndCourseAndStatus(Long departmentId, String courseName, ClearanceStatus.Status status);

    @Query("SELECT COUNT(cs) FROM ClearanceStatus cs WHERE cs.clearanceRequest.department.id = :departmentId AND cs.student.section.clusterName = :clusterName AND cs.status = :status")
    int countByDepartmentIdAndClusterAndStatus(Long departmentId, String clusterName, ClearanceStatus.Status status);


    int countByClearanceRequest_Department_IdAndStatus(Long departmentId, ClearanceStatus.Status status);

    void deleteByClearanceRequest(ClearanceRequest clearanceRequest);

}
