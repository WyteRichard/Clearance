package com.student.clearance.system.service.spiritualAffairs;

import com.student.clearance.system.domain.spiritualAffairs.SpiritualAffairs;
import java.util.List;

public interface SpiritualAffairsService {
    List<SpiritualAffairs> getAllSpiritualAffairs();
    int getSpiritualAffairsCount();
    void deleteSpiritualAffairs(Long id);
    SpiritualAffairs getAffairsBySpiritualAffairsNumber(String spiritualAffairsNumber);
}