package com.student.clearance.system.controller.notification;

import com.student.clearance.system.domain.notification.Notification;
import com.student.clearance.system.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Notification")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return new ResponseEntity<>(notificationService.getAllNotifications(), HttpStatus.OK);
    }

    @GetMapping("/notification/{id}")
    public ResponseEntity<Optional<Notification>> getNotificationById(@PathVariable Long id) {
        return new ResponseEntity<>(notificationService.getNotificationById(id), HttpStatus.OK);
    }

    @PostMapping("/notification")
    public ResponseEntity<Notification> addNotification(@RequestBody Notification notification) {
        Notification createdNotification = notificationService.addNotification(notification);
        return new ResponseEntity<>(createdNotification, HttpStatus.CREATED);
    }

    @DeleteMapping("/notification/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        Optional<Notification> notificationOptional = notificationService.getNotificationById(id);

        if (notificationOptional.isPresent()) {
            notificationService.deleteNotification(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
