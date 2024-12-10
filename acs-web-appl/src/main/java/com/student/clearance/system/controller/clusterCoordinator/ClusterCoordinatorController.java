package com.student.clearance.system.controller.clusterCoordinator;

import com.student.clearance.system.domain.clusterCoordinator.ClusterCoordinator;
import com.student.clearance.system.service.clusterCoordinator.ClusterCoordinatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Cluster")
public class ClusterCoordinatorController {

    private final ClusterCoordinatorService clusterCoordinatorService;

    @Autowired
    public ClusterCoordinatorController(ClusterCoordinatorService clusterCoordinatorService) {
        this.clusterCoordinatorService = clusterCoordinatorService;
    }

    @GetMapping("/coordinators")
    public ResponseEntity<List<ClusterCoordinator>> getAllClusterCoordinators() {
        return new ResponseEntity<>(clusterCoordinatorService.getAllClusterCoordinators(), HttpStatus.OK);
    }

    @GetMapping("/coordinators/count")
    public ResponseEntity<Integer> getClusterCoordinatorCount() {
        int count = clusterCoordinatorService.getClusterCoordinatorCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/coordinators/{id}")
    public ResponseEntity<Void> deleteClusterCoordinator(@PathVariable Long id) {
        clusterCoordinatorService.deleteClusterCoordinator(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/coordinators/{clusterCoordinatorNumber}")
    public ResponseEntity<ClusterCoordinator> getCoordinatorByClusterCoordinatorNumber(@PathVariable String clusterCoordinatorNumber) {
        ClusterCoordinator coordinator = clusterCoordinatorService.getCoordinatorByClusterCoordinatorNumber(clusterCoordinatorNumber);
        if (coordinator != null) {
            return new ResponseEntity<>(coordinator, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
