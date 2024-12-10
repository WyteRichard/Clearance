package com.student.clearance.system.repository.announcement;

import com.student.clearance.system.domain.announcement.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}