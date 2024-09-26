package com.student.clearance.system.service.notification;

import com.student.clearance.system.domain.notification.Notification;

import java.util.List;
import java.util.Optional;

public interface NotificationService {
    List<Notification> getAllNotifications();
    Optional<Notification> getNotificationById(Long id);
    Notification addNotification(Notification notification);
    void deleteNotification(Long id);
}
