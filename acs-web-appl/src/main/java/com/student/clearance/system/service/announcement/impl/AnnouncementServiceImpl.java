package com.student.clearance.system.service.announcement.impl;

import com.student.clearance.system.domain.announcement.Announcement;
import com.student.clearance.system.repository.announcement.AnnouncementRepository;
import com.student.clearance.system.service.announcement.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    @Autowired
    public AnnouncementServiceImpl(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @Override
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    @Override
    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    @Override
    public Announcement addAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    @Override
    public Announcement updateAnnouncement(Announcement announcement) {
        if (announcementRepository.existsById(announcement.getId())) {
            return announcementRepository.save(announcement);
        }
        throw new IllegalArgumentException("Announcement not found with id: " + announcement.getId());
    }

    @Override
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}