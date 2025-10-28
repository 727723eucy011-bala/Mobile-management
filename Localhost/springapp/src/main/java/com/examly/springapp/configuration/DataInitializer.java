package com.examly.springapp.configuration;

import com.examly.springapp.model.Plan;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.PlanRepository;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample plans
        if (planRepository.count() == 0) {
            Plan basicPlan = new Plan();
            basicPlan.setPlanName("Basic Plan");
            basicPlan.setPrice(new BigDecimal("9.99"));
            basicPlan.setDuration(30);
            basicPlan.setDescription("Basic subscription with essential features");
            planRepository.save(basicPlan);

            Plan premiumPlan = new Plan();
            premiumPlan.setPlanName("Premium Plan");
            premiumPlan.setPrice(new BigDecimal("19.99"));
            premiumPlan.setDuration(30);
            premiumPlan.setDescription("Premium subscription with advanced features");
            planRepository.save(premiumPlan);

            Plan enterprisePlan = new Plan();
            enterprisePlan.setPlanName("Enterprise Plan");
            enterprisePlan.setPrice(new BigDecimal("49.99"));
            enterprisePlan.setDuration(30);
            enterprisePlan.setDescription("Enterprise subscription with all features");
            planRepository.save(enterprisePlan);
        }

        // Initialize admin user
        try {
            userService.registerUser("admin@example.com", "admin123", User.Role.ADMIN);
        } catch (RuntimeException e) {
            // Admin already exists
        }

        // Initialize sample user
        try {
            userService.registerUser("user@example.com", "user123", User.Role.USER);
        } catch (RuntimeException e) {
            // User already exists
        }
    }
}