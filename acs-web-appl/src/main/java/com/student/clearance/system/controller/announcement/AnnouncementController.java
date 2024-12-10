package com.student.clearance.system.controller.announcement;

import com.student.clearance.system.domain.announcement.Announcement;
import com.student.clearance.system.service.announcement.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @Autowired
    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        return new ResponseEntity<>(announcementService.getAllAnnouncements(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Announcement>> getAnnouncementById(@PathVariable Long id) {
        return new ResponseEntity<>(announcementService.getAnnouncementById(id), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addAnnouncement(@RequestBody Announcement announcement) {
        try {
            announcementService.addAnnouncement(announcement);
            return new ResponseEntity<>("Announcement successfully added", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Announcement cannot be added", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAnnouncement(@PathVariable Long id, @RequestBody Announcement announcementDetails) {
        try {
            Optional<Announcement> announcementOptional = announcementService.getAnnouncementById(id);

            if (announcementOptional.isPresent()) {
                Announcement announcement = announcementOptional.get();
                announcement.setTitle(announcementDetails.getTitle());
                announcement.setAnnouncementDate(announcementDetails.getAnnouncementDate()); // Updated
                announcement.setDetails(announcementDetails.getDetails());

                announcementService.updateAnnouncement(announcement);
                return new ResponseEntity<>("Announcement successfully updated", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Announcement not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Announcement cannot be updated", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Long id) {
        try {
            Optional<Announcement> announcementOptional = announcementService.getAnnouncementById(id);

            if (announcementOptional.isPresent()) {
                announcementService.deleteAnnouncement(id);
                return new ResponseEntity<>("Announcement successfully deleted", HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>("Announcement not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Announcement cannot be deleted", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
