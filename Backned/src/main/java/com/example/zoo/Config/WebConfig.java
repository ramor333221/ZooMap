package com.example.zoo.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // תקף לכל הנתיבים ב-API
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // הכתובות של ה-React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // פעולות מותרות
                .allowedHeaders("*") // מאפשר את כל ה-Headers (כולל ה-Token שאת שולחת)
                .allowCredentials(true);
    }
}