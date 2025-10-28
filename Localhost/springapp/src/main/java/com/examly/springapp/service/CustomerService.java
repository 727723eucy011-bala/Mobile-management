package com.examly.springapp.service;

import com.examly.springapp.model.Customer;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.CustomerRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    public Customer getCustomerProfile(Long userId) {
        return customerRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
    }

    public Customer updateCustomerProfile(Long userId, Customer customerDetails) {
        Customer customer = customerRepository.findById(userId).orElse(new Customer());
        if (customer.getUser() == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            customer.setUser(user);
            customer.setUserId(userId);
        }
        
        customer.setName(customerDetails.getName());
        customer.setAddress(customerDetails.getAddress());
        customer.setMobileNumber(customerDetails.getMobileNumber());
        
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}