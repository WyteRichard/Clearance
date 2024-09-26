package com.student.clearance.system.service.library;

import com.student.clearance.system.domain.library.Library;
import java.util.List;

public interface LibraryService {
    List<Library> getAllLibraries();
    int getLibraryCount();
    void deleteLibrary(Long id);
    Library getLibraryByLibraryNumber(String libraryNumber);
}
