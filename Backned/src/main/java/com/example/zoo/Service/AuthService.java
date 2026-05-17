package com.example.zoo.Service;

import com.example.zoo.Entities.Users;
import com.example.zoo.Exceptions.AppExceptions; // ייבוא קובץ החריגות המרכזי
import com.example.zoo.Repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public Users login(String username, String password) {
        Users user = userRepo.findByUsername(username);

        // שימוש ב-BadRequest עבור פרטי התחברות שגויים
        if (user == null) {
            throw new AppExceptions.BadRequest("Invalid username or password");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AppExceptions.BadRequest("Invalid username or password");
        }

        return user;
    }

    @Transactional
    public Users register(Users user) {
        // בדיקה אם שם המשתמש כבר תפוס
        if (userRepo.findByUsername(user.getUsername()) != null) {
            throw new AppExceptions.BadRequest("Username already exists");
        }

        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        return userRepo.save(user);
    }
}