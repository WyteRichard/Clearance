package com.student.clearance.system.service.announcement;

import com.student.clearance.system.domain.announcement.Announcement;

import java.util.List;
import java.util.Optional;

public interface AnnouncementService {
    List<Announcement> getAllAnnouncements();
    Optional<Announcement> getAnnouncementById(Long id);
    Announcement addAnnouncement(Announcement announcement);
    Announcement updateAnnouncement(Announcement announcement);
    void deleteAnnouncement(Long id);
}
