// package com.examly.springapp.controller;
// import com.examly.springapp.model.Plan;
// import com.examly.springapp.service.PlanService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.util.List;

// @RestController
// @RequestMapping("/api/plans")
// public class PlanController {
//     private final PlanService service;
//     public PlanController(PlanService service){
//         this.service = service;
//     }

//     @PostMapping("/addPlan")
//     public ResponseEntity<Plan> addPlan(@RequestBody Plan plan) {
//         return ResponseEntity.ok(service.savePlan(plan));
//     }

//     @GetMapping("/allPlans")
//     public ResponseEntity<List<Plan>> getAllPlans() {
//         return ResponseEntity.ok(service.getAllPlans());
//     }

//     @GetMapping("/byType")
//     public ResponseEntity<List<Plan>> getPlansByType(@RequestParam String type) {
//         return ResponseEntity.ok(service.getPlansByType(type));
//     } 

//     @GetMapping("/sortedByPrice")
//     public ResponseEntity<List<Plan>> getPlansSortedByPrice() {
//         return ResponseEntity.ok(service.getPlansSortedByPrice());
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deletePlan(@PathVariable Long id ){
//         service.deletePlan(id);
//         return ResponseEntity.noContent().build();
//     }
// }


package com.examly.springapp.controller;

import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Plan;
import com.examly.springapp.service.PlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plan")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081", "https://8081-debfabbeabddfcfffbdacddbfcdceaaffcc.premiumproject.examly.io"})
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createPlan(@RequestBody Plan plan) {
        try {
            Plan savedPlan = planService.savePlan(plan);
            return new ResponseEntity<>(savedPlan, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating plan: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Plan>> getAllPlans() {
        List<Plan> plans = planService.getAllPlans();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @GetMapping("/{planId}")
    public ResponseEntity<Plan> getPlanById(@PathVariable Long planId) {
        Plan plan = planService.getPlanById(planId);
        return new ResponseEntity<>(plan, HttpStatus.OK);
    }

    @PutMapping("/{planId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Plan> updatePlan(@PathVariable Long planId, @RequestBody Plan planDetails) {
        Plan updatedPlan = planService.updatePlan(planId, planDetails);
        return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
    }

    @DeleteMapping("/{planId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlan(@PathVariable Long planId) {
        planService.deletePlan(planId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}