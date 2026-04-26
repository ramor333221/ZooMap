package com.example.zoo.Service;

import com.example.zoo.Entities.Users;
import com.example.zoo.Repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // ייבוא הספרייה
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public Users login(String username, String password) {
        Users user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("שם משתמש או סיסמה שגויים");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("שם משתמש או סיסמה שגויים");
        }

        return user;
    }

    @Transactional
    public Users register(Users user) {
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        return userRepo.save(user);
    }
}