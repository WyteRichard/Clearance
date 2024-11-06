package com.student.clearance.system.repository.clusterCoordinator;

import com.student.clearance.system.domain.clusterCoordinator.ClusterCoordinator;
import com.student.clearance.system.domain.studentDiscipline.StudentDiscipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClusterCoordinatorRepository extends JpaRepository<ClusterCoordinator, Long> {
    boolean existsByClusterCoordinatorNumberAndEmail(String clusterCoordinatorNumber, String email);

    boolean existsByClusterCoordinatorNumber(String clusterCoordinatorNumber);

    ClusterCoordinator findByClusterCoordinatorNumber(String clusterCoordinatorNumber);

    List<ClusterCoordinator> findBySection_ClusterName(String clusterName);
}
