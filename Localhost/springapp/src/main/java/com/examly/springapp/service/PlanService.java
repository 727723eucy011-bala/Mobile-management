// package com.examly.springapp.service;
// import com.examly.springapp.model.Plan;
// import com.examly.springapp.exception.InvalidPlanDataException;
// import com.examly.springapp.exception.PlanNotFoundException;
// import com.examly.springapp.repository.PlanRepository;
// import org.springframework.stereotype.Service;
// import java.util.List;

// @Service
// public class PlanService {
//     private final PlanRepository repository;
//     public PlanService(PlanRepository repository) {
//         this.repository = repository;
//     }

//     // Add new plan 
//     public Plan savePlan(Plan plan){
//         if(plan.getPrice() <= 0 ){
//             throw new InvalidPlanDataException("Price must be greater than 0");
//         }
//         if(plan.getPlanName() == null || plan.getPlanName().isBlank()) {
//             throw new InvalidPlanDataException("Plan name cannot be empty");
//         }
//         return repository.save(plan);
//     }

//     // Fetch all plans
//     public List<Plan> getAllPlans() {
//         return repository.findAll();
//     }
//     // Fetch plans by type
//     public List<Plan> getPlansByType(String type){
//         return repository.findByType(type);
//     }

//     //Fetch plans sorted by price
//     public List<Plan> getPlansSortedByPrice(){
//         return repository.findAllByOrderByPriceDesc();
//     }

//     //Delete plan by ID
//     public void deletePlan(Long id) {
//         if(!repository.existsById(id)) {
//             throw new PlanNotFoundException("No plan exists with ID : "+id);
//         }
//         repository.deleteById(id);
//     } 

// }


package com.examly.springapp.service;

import org.springframework.stereotype.Service;

import com.examly.springapp.exception.InvalidPlanDataException;
import com.examly.springapp.exception.PlanNotFoundException;
import com.examly.springapp.model.Plan;
import com.examly.springapp.repository.PlanRepository;

import java.util.List;

@Service
public class PlanService {

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    public Plan savePlan(Plan plan) {
        if (plan.getPlanName() == null || plan.getPlanName().isEmpty()) {
            throw new InvalidPlanDataException("Plan name cannot be empty");
        }
        if (plan.getPrice() == null || plan.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new InvalidPlanDataException("Price must be greater than 0");
        }
        if (plan.getDuration() == null || plan.getDuration() <= 0) {
            throw new InvalidPlanDataException("Duration must be greater than 0");
        }
        return planRepository.save(plan);
    }

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public Plan getPlanById(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("Plan not found with ID: " + planId));
    }

    public Plan updatePlan(Long planId, Plan planDetails) {
        Plan plan = getPlanById(planId);
        plan.setPlanName(planDetails.getPlanName());
        plan.setPrice(planDetails.getPrice());
        plan.setDuration(planDetails.getDuration());
        plan.setDescription(planDetails.getDescription());
        return planRepository.save(plan);
    }

    public void deletePlan(Long id) {
        if (!planRepository.existsById(id)) {
            throw new PlanNotFoundException("No plan exists with ID " + id);
        }
        planRepository.deleteById(id);
    }
}