package com.student.clearance.system.service.clearanceRequest;


import com.student.clearance.system.domain.clearanceRequest.ClearanceRequest;

import java.util.List;

public interface ClearanceRequestService {

    List<ClearanceRequest> getAllClearanceRequests();

    ClearanceRequest getClearanceRequestById(Long id);

    ClearanceRequest createClearanceRequest(ClearanceRequest clearanceRequest);

    ClearanceRequest updateClearanceRequest(Long id, ClearanceRequest clearanceRequest);

    void deleteClearanceRequest(Long id);

    List<ClearanceRequest> getClearanceRequestsByStudentName(String name);

    List<ClearanceRequest> getClearanceRequestsByStudentId(Long studentId);

    List<ClearanceRequest> getClearanceRequestsByDepartmentId(Long departmentId);

    long getClearanceRequestCount();


}
