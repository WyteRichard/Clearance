package com.student.clearance.system.repository.library;

import com.student.clearance.system.domain.library.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Long> {
    boolean existsByLibraryNumberAndEmail(String libraryNumber, String email);

    boolean existsByLibraryNumber(String libraryNumber);

    Library findByLibraryNumber(String libraryNumber);
}
