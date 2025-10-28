package com.examly.springapp.service;

import com.examly.springapp.model.Subscription;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.repository.SubscriptionRepository;
import com.examly.springapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Transaction createTransaction(Long subscriptionId, BigDecimal amount, String paymentMethod) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        Transaction transaction = new Transaction();
        transaction.setSubscription(subscription);
        transaction.setAmount(amount);
        transaction.setPaymentMethod(paymentMethod);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setStatus(Transaction.Status.SUCCESS);

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Transaction getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}