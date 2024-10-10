package com.student.clearance.system.service.clusterCoordinator;

import com.student.clearance.system.domain.clusterCoordinator.ClusterCoordinator;
import java.util.List;

public interface ClusterCoordinatorService {
    List<ClusterCoordinator> getAllClusterCoordinators();
    int getClusterCoordinatorCount();
    void deleteClusterCoordinator(Long id);
}
