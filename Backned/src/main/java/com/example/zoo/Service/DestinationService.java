package com.example.zoo.Service;

import com.example.zoo.DTO.DestinationDTO;
import com.example.zoo.Entities.CategoryType;
import com.example.zoo.Entities.Destination;
import com.example.zoo.Repositories.DestinationRepo;
import org.springframework.context.annotation.Lazy; // הוספת הייבוא
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DestinationService {

    private final DestinationRepo destinationRepo;
    private final NavigationService navigationService;

    public DestinationService(DestinationRepo destinationRepo,
                              @Lazy NavigationService navigationService) {
        this.destinationRepo = destinationRepo;
        this.navigationService = navigationService;
    }

    // --- לקריאה (אורח ומנהל) ---
    public List<Destination> getAll() {
        List<Destination> list = destinationRepo.findAll();
        if (list.isEmpty()) throw new RuntimeException("אין יעדים במערכת");
        return list;
    }

    public Destination getById(int id) {
        return destinationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("יעד לא נמצא"));
    }

    // --- לכתיבה (מנהל) ---
    @Transactional
    public Destination add(DestinationDTO dto) {
        Destination destination = Destination.builder()
                .name(dto.getName())
                .picUrl(dto.getPicUrl())
                .description(dto.getDescription())
                .category(findCategory(dto.getCategory()))
                .build();

        Destination saved = destinationRepo.save(destination);
        navigationService.refresh();
        return saved;
    }

    @Transactional
    public Destination update(int id, DestinationDTO dto) {
        Destination existing = getById(id);
        existing.setName(dto.getName());
        existing.setPicUrl(dto.getPicUrl());
        existing.setDescription(dto.getDescription());
        existing.setCategory(findCategory(dto.getCategory()));

        Destination saved = destinationRepo.save(existing);
        navigationService.refresh();
        return saved;
    }

    @Transactional
    public Destination delete(int id) {
        Destination destination = getById(id);
        destination.setCategory(CategoryType.CANCELED);
        Destination saved = destinationRepo.save(destination);

        navigationService.refresh();
        return saved;
    }

    public List<CategoryType> getAllCategoryTypes() {
        return Arrays.asList(CategoryType.values());
    }



    private CategoryType findCategory(String categoryStr) {
        try {
            CategoryType type = CategoryType.valueOf(categoryStr.toUpperCase());
            if (type == null) throw new RuntimeException("קטגוריה לא קיימת");
            return type;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("סוג קטגוריה לא תקין");
        }
    }
}