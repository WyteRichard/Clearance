package com.student.clearance.system.service.library.impl;

import com.student.clearance.system.domain.library.Library;
import com.student.clearance.system.repository.library.LibraryRepository;
import com.student.clearance.system.service.library.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibraryServiceImpl implements LibraryService {

    private final LibraryRepository libraryRepository;

    @Autowired
    public LibraryServiceImpl(LibraryRepository libraryRepository) {
        this.libraryRepository = libraryRepository;
    }

    @Override
    public List<Library> getAllLibraries() {
        return libraryRepository.findAll();
    }

    @Override
    public int getLibraryCount() {
        return (int) libraryRepository.count();
    }

    @Override
    public void deleteLibrary(Long id) {
        libraryRepository.deleteById(id);
    }

    @Override
    public Library getLibraryByLibraryNumber(String libraryNumber) {
        return libraryRepository.findByLibraryNumber(libraryNumber);
    }
}
