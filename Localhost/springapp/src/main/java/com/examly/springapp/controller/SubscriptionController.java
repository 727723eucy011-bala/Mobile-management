package com.examly.springapp.controller;

import com.examly.springapp.model.Subscription;
import com.examly.springapp.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subscription")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081", "https://8081-debfabbeabddfcfffbdacddbfcdceaaffcc.premiumproject.examly.io"})
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Subscription> createSubscription(@RequestBody Map<String, Long> request, Authentication auth) {
        Long userId = (Long) auth.getDetails();
        Long planId = request.get("planId");
        Subscription subscription = subscriptionService.createSubscription(userId, planId);
        return new ResponseEntity<>(subscription, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Subscription>> getUserSubscriptions(@PathVariable Long userId, Authentication auth) {
        Long currentUserId = (Long) auth.getDetails();
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) 
            && !currentUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(userId);
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/{subscriptionId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Subscription> getSubscriptionById(@PathVariable Long subscriptionId) {
        Subscription subscription = subscriptionService.getSubscriptionById(subscriptionId);
        return ResponseEntity.ok(subscription);
    }

    @PutMapping("/{subscriptionId}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Subscription> cancelSubscription(@PathVariable Long subscriptionId) {
        Subscription subscription = subscriptionService.cancelSubscription(subscriptionId);
        return ResponseEntity.ok(subscription);
    }
}