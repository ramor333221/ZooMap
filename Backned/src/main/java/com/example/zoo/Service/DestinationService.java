package com.example.zoo.Service;

import com.example.zoo.DTO.DestinationDTO;
import com.example.zoo.Entities.*;
import com.example.zoo.Exceptions.AppExceptions;
import com.example.zoo.Repositories.DestinationRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DestinationService {

    private final DestinationRepo destinationRepo;
    private final NavigationService navigationService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public DestinationService(DestinationRepo destinationRepo,
                              @Lazy NavigationService navigationService) {
        this.destinationRepo = destinationRepo;
        this.navigationService = navigationService;
    }

    // --- READ ---
    public List<Destination> getAll() {
        List<Destination> list = destinationRepo.findAll();
        if (list.isEmpty()) {
            throw new AppExceptions.ResourceNotFound("No destinations found in the system");
        }
        return list;
    }

    public Destination getById(int id) {
        return destinationRepo.findById(id)
                .orElseThrow(() -> new AppExceptions.ResourceNotFound("Destination not found with id: " + id));
    }

    // --- WRITE (Admin) ---
    @Transactional
    public Destination update(int id, DestinationDTO dto, MultipartFile file) {
        Destination existing = getById(id);

        try {
            if (file != null && !file.isEmpty()) {
                Path root = Paths.get(uploadDir);
                if (!Files.exists(root)) Files.createDirectories(root);

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Files.copy(file.getInputStream(), root.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

                existing.setPicUrl("/uploads/" + fileName);
            }
            else if (dto.getPicUrl() != null) {
                existing.setPicUrl(dto.getPicUrl());
            }

            existing.setName(dto.getName());
            existing.setDescription(dto.getDescription());
            existing.setCategory(findCategory(dto.getCategory()));

            Destination saved = destinationRepo.save(existing);
            navigationService.refresh();
            return saved;

        } catch (IOException e) {
            throw new AppExceptions.BadRequest("Could not update file: " + e.getMessage());
        }
    }

    @Transactional
    public Destination addWithImage(DestinationDTO dto, MultipartFile file) {
        try {
            Path root = Paths.get(uploadDir);
            if (!Files.exists(root)) Files.createDirectories(root);

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), root.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

            dto.setPicUrl("/uploads/" + fileName);

            Destination destination = Destination.builder()
                    .name(dto.getName())
                    .picUrl(dto.getPicUrl())
                    .description(dto.getDescription())
                    .category(findCategory(dto.getCategory()))
                    .location(new Point(dto.getX(), dto.getY()))
                    .build();

            Destination saved = destinationRepo.save(destination);
            navigationService.refresh();
            return saved;
        } catch (IOException e) {
            throw new AppExceptions.BadRequest("Could not store file: " + e.getMessage());
        }
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
        if (categoryStr == null || categoryStr.isEmpty()) {
            throw new AppExceptions.BadRequest("Category name cannot be empty");
        }
        try {
            return CategoryType.valueOf(categoryStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppExceptions.ResourceNotFound("Category type '" + categoryStr + "' is invalid");
        }
    }
}