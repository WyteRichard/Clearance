package com.student.clearance.system.service.clusterCoordinator.impl;

import com.student.clearance.system.domain.clusterCoordinator.ClusterCoordinator;
import com.student.clearance.system.repository.clusterCoordinator.ClusterCoordinatorRepository;
import com.student.clearance.system.service.clusterCoordinator.ClusterCoordinatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClusterCoordinatorServiceImpl implements ClusterCoordinatorService {

    private final ClusterCoordinatorRepository clusterCoordinatorRepository;

    @Autowired
    public ClusterCoordinatorServiceImpl(ClusterCoordinatorRepository clusterCoordinatorRepository) {
        this.clusterCoordinatorRepository = clusterCoordinatorRepository;
    }

    @Override
    public List<ClusterCoordinator> getAllClusterCoordinators() {
        return clusterCoordinatorRepository.findAll();
    }

    @Override
    public int getClusterCoordinatorCount() {
        return (int) clusterCoordinatorRepository.count();
    }

    @Override
    public void deleteClusterCoordinator(Long id) {
        clusterCoordinatorRepository.deleteById(id);
    }
}
