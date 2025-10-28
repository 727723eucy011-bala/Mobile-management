package com.examly.springapp.controller;

import com.examly.springapp.model.Customer;
import com.examly.springapp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081", "https://8081-debfabbeabddfcfffbdacddbfcdceaaffcc.premiumproject.examly.io"})
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Customer> getCustomerProfile(@PathVariable Long userId, Authentication auth) {
        Long currentUserId = (Long) auth.getDetails();
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) 
            && !currentUserId.equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        Customer customer = customerService.getCustomerProfile(userId);
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Customer> updateCustomerProfile(@PathVariable Long userId, 
                                                         @RequestBody Customer customerDetails,
                                                         Authentication auth) {
        Long currentUserId = (Long) auth.getDetails();
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) 
            && !currentUserId.equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        Customer customer = customerService.updateCustomerProfile(userId, customerDetails);
        return ResponseEntity.ok(customer);
    }
}