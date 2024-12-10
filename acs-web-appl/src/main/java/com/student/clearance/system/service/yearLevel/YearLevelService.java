package com.student.clearance.system.service.yearLevel;

import com.student.clearance.system.domain.yearLevel.YearLevel;

import java.util.List;
import java.util.Optional;

public interface YearLevelService {
    List<YearLevel> getAllYearLevels();
    Optional<YearLevel> getYearLevelById(Long id);
    YearLevel addYearLevel(YearLevel yearLevel);
    YearLevel updateYearLevel(YearLevel yearLevel);
    void deleteYearLevel(Long id);
}
