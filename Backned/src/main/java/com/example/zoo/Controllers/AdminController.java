package com.example.zoo.Controllers;

import com.example.zoo.DTO.Auth.LoginRequestDTO;
import com.example.zoo.DTO.Auth.LoginResponseDTO;
import com.example.zoo.DTO.DestinationDTO;
import com.example.zoo.DTO.RouteDTO;
import com.example.zoo.Entities.CategoryType;
import com.example.zoo.Entities.Destination;
import com.example.zoo.Entities.Route;
import com.example.zoo.Entities.Users;
import com.example.zoo.JWT.JwtUtil;
import com.example.zoo.Service.AuthService;
import com.example.zoo.Service.DestinationService;
import com.example.zoo.Service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;
    private final DestinationService destinationService;
    private final RouteService routeService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {

        Users user = authService.login(request.getUsername(), request.getPassword());

        if (!"Admin".equalsIgnoreCase(user.getRole().name())) {
            throw new RuntimeException("Access denied - not an admin");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return ResponseEntity.ok(
                new LoginResponseDTO(
                        token,
                        user.getRole().name()
                )
        );
    }

    // --- טיפול ביעדים (Destinations) עם תמיכה בהעלאת קבצים ותמונות ---

    @PostMapping(value = "/destinations", consumes = {"multipart/form-data"})
    public ResponseEntity<Destination> addDestination(
            @RequestPart("destination") DestinationDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        if (file != null && !file.isEmpty()) {
            String fileName = saveImageFile(file);
            dto.setPicUrl(fileName); // מעדכנים את ה-DTO עם השם הקצר החדש
        }
        return ResponseEntity.ok(destinationService.add(dto));
    }

    @PutMapping(value = "/destinations/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Destination> updateDestination(
            @PathVariable int id,
            @RequestPart("destination") DestinationDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        if (file != null && !file.isEmpty()) {
            String fileName = saveImageFile(file);
            dto.setPicUrl(fileName);
        }
        return ResponseEntity.ok(destinationService.update(id, dto));
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<Destination> deleteDestination(@PathVariable int id) {
        return ResponseEntity.ok(destinationService.delete(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryType>> getCategoryTypes() {
        List<CategoryType> types = destinationService.getAllCategoryTypes();
        return ResponseEntity.ok(types);
    }

    // --- טיפול במסלולים (Routes) ---

    @PostMapping("/routes")
    public ResponseEntity<Route> addRoute(@RequestBody RouteDTO dto) {
        return ResponseEntity.ok(routeService.addRoute(dto));
    }

    @PutMapping("/routes/{id}")
    public ResponseEntity<Route> updateRoute(@PathVariable int id,
                                             @RequestBody RouteDTO dto) {
        return ResponseEntity.ok(routeService.updateRoute(id, dto));
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<String> deleteRoute(@PathVariable int id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok("Route deleted successfully");
    }

    // --- פונקציות עזר פרטיות ---

    /**
     * פונקציית עזר פרטית בתוך השרת לשמירת הקובץ הפיזי בדיסק הקשיח
     */
    private String saveImageFile(MultipartFile file) throws IOException {
        // נתיב התיקייה שבה יישמרו התמונות בשרת
        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/uploads/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs(); // יצירת התיקייה כולל תיקיות אב אם אינן קיימות
        }

        // יצירת שם ייחודי גלובלי (UUID) לקובץ כדי למנוע דריסת קבצים בעלי שם זהה
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        File destFile = new File(dir, uniqueFileName);

        file.transferTo(destFile); // כתיבת הקובץ הפיזי לדיסק
        return uniqueFileName; // מחזיר את שם הקובץ החדש בלבד (למשל: e4a3b2..._lion.jpg)
    }
}