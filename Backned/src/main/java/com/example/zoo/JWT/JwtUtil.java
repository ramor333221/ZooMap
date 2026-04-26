package com.example.zoo.JWT;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "asdfghjkl;ASDFGHJKL;'ASDFGHJKL;'ASDFGHJKL;ASDFGHJKL;";
    private final long EXPIRATION = 1000 * 60 * 60; // 1 hour

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Generate the JWT Token
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract the username from the token
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Extract the role from the token
    public String extractRole(String token) {
        return (String) getClaims(token).get("role");
    }

    // This method checks whether the JWT token is valid or not
    public boolean isValidToken(String token) {
        try {
            // Try parsing the token to see if it's valid
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true; // If no exception is thrown, the token is valid
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Invalid token
        }
    }

    // Helper method to extract the claims from the token
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}